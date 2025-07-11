
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

    let success = false;
    let paymentReference = '';

    if (paymentMethod === 'razorpay') {
      // For demo purposes, we'll accept any payment ID for Razorpay
      success = true;
      paymentReference = paymentId;
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

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          success = true;
          paymentReference = session.payment_intent as string;
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
          confirmed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

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
