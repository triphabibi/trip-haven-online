
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[CONFIRM-PAYMENT] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment confirmation started");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { paymentId, paymentMethod, bookingId, sessionId } = await req.json();
    logStep("Confirmation data received", { paymentId, paymentMethod, bookingId });

    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    let success = false;
    let paymentReference = '';

    if (paymentMethod === 'razorpay' && paymentId) {
      // SECURITY: Proper Razorpay payment verification
      const { data: gateway } = await supabase
        .from('payment_gateways')
        .select('api_secret')
        .eq('name', 'Razorpay')
        .eq('enabled', true)
        .single();

      if (gateway?.api_secret) {
        try {
          // Verify payment with Razorpay API
          const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
            headers: {
              'Authorization': `Basic ${btoa(gateway.api_secret + ':')}`
            }
          });
          
          if (response.ok) {
            const paymentData = await response.json();
            if (paymentData.status === 'captured') {
              success = true;
              paymentReference = paymentId;
            }
          }
        } catch (error) {
          logStep("Razorpay verification error", error);
          throw new Error('Failed to verify Razorpay payment');
        }
      } else {
        throw new Error('Razorpay gateway not configured');
      }
    } else if (paymentMethod === 'stripe' && sessionId) {
      // Verify Stripe payment
      const { data: gateway } = await supabase
        .from('payment_gateways')
        .select('api_secret')
        .eq('gateway_name', 'stripe')
        .eq('is_enabled', true)
        .single();

      if (gateway?.api_secret) {
        const stripe = new Stripe(gateway.api_secret, {
          apiVersion: '2023-10-16',
        });

        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (session.payment_status === 'paid') {
            success = true;
            paymentReference = session.payment_intent as string;
          }
        } catch (error) {
          logStep("Stripe verification error", error);
          throw new Error('Failed to verify Stripe payment');
        }
      }
    }

    if (success) {
      // Update booking status
      const { error } = await supabase
        .from('new_bookings')
        .update({
          payment_status: 'paid',
          booking_status: 'confirmed',
          payment_reference: paymentReference,
          payment_method: paymentMethod,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        logStep("Booking update error", error);
        throw error;
      }

      logStep("Booking confirmed successfully");

      return new Response(JSON.stringify({
        success: true,
        message: 'Payment confirmed successfully',
        bookingId
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      });
    } else {
      throw new Error('Payment verification failed');
    }

  } catch (error: any) {
    logStep("Payment confirmation error", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});
