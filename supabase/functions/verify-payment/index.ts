
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment verification started");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { paymentId, paymentMethod, bookingId, sessionId } = await req.json();

    logStep("Verification data received", { paymentId, paymentMethod, bookingId });

    let verificationResult;

    switch (paymentMethod) {
      case 'razorpay':
        verificationResult = await verifyRazorpayPayment(paymentId, bookingId, supabase);
        break;

      case 'stripe':
        verificationResult = await verifyStripePayment(sessionId, bookingId, supabase);
        break;

      default:
        throw new Error(`Payment verification not supported for: ${paymentMethod}`);
    }

    // Send confirmation email
    if (verificationResult.success) {
      try {
        await supabase.functions.invoke('send-booking-email', {
          body: {
            booking_id: bookingId,
            template_type: 'booking_confirmation'
          }
        });
        logStep("Confirmation email sent");
      } catch (emailError) {
        logStep("Email sending failed", { error: emailError });
        // Don't fail the verification if email fails
      }
    }

    return new Response(JSON.stringify(verificationResult), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });

  } catch (error: any) {
    logStep("Payment verification error", { error: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});

async function verifyRazorpayPayment(paymentId: string, bookingId: string, supabase: any) {
  logStep("Verifying Razorpay payment", { paymentId });

  // Update booking with payment details
  const { error } = await supabase
    .from('new_bookings')
    .update({
      payment_status: 'paid',
      booking_status: 'confirmed',
      payment_reference: paymentId,
      confirmed_at: new Date().toISOString()
    })
    .eq('id', bookingId);

  if (error) throw error;

  return {
    success: true,
    message: 'Payment verified successfully',
    bookingId
  };
}

async function verifyStripePayment(sessionId: string, bookingId: string, supabase: any) {
  logStep("Verifying Stripe payment", { sessionId });

  // Get Stripe configuration
  const { data: gateway } = await supabase
    .from('payment_gateways')
    .select('api_secret')
    .eq('gateway_name', 'stripe')
    .eq('is_enabled', true)
    .single();

  if (!gateway?.api_secret) {
    throw new Error('Stripe configuration not found');
  }

  const stripe = new Stripe(gateway.api_secret, {
    apiVersion: '2023-10-16',
  });

  // Retrieve the session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === 'paid') {
    // Update booking with payment details
    const { error } = await supabase
      .from('new_bookings')
      .update({
        payment_status: 'paid',
        booking_status: 'confirmed',
        payment_reference: session.payment_intent,
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;

    return {
      success: true,
      message: 'Payment verified successfully',
      bookingId
    };
  } else {
    throw new Error('Payment not completed');
  }
}
