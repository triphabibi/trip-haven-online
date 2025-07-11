
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[CREATE-PAYMENT] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment creation started");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const requestData = await req.json();
    logStep("Request received", requestData);

    const {
      bookingId,
      paymentMethod,
      amount,
      customerName,
      customerEmail,
      customerPhone
    } = requestData;

    // Validate required fields
    if (!bookingId || !paymentMethod || !amount || !customerName || !customerEmail) {
      throw new Error('Missing required fields');
    }

    // Get payment gateway configuration
    const { data: gateway, error: gatewayError } = await supabase
      .from('payment_gateways')
      .select('*')
      .eq('gateway_name', paymentMethod)
      .eq('is_enabled', true)
      .single();

    if (gatewayError || !gateway) {
      logStep("Gateway error", gatewayError);
      throw new Error(`Payment gateway ${paymentMethod} not found or disabled`);
    }

    logStep("Gateway found", gateway.display_name);

    let result;

    switch (paymentMethod) {
      case 'razorpay':
        result = await handleRazorpay({
          gateway,
          amount,
          customerName,
          customerEmail,
          customerPhone,
          bookingId
        });
        break;

      case 'stripe':
        result = await handleStripe({
          gateway,
          amount,
          customerName,
          customerEmail,
          customerPhone,
          bookingId,
          origin: req.headers.get("origin") || 'https://triphabibi.in'
        });
        break;

      case 'cash_on_arrival':
        result = await handleCash({ bookingId, supabase });
        break;

      case 'bank_transfer':
        result = await handleBankTransfer({ bookingId, supabase, gateway });
        break;

      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }

    logStep("Payment processed", result);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });

  } catch (error: any) {
    logStep("Payment error", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});

async function handleRazorpay(params: any) {
  const { gateway, amount, customerName, customerEmail, customerPhone, bookingId } = params;
  
  logStep("Processing Razorpay payment");

  return {
    success: true,
    paymentMethod: 'razorpay',
    requiresAction: true,
    actionType: 'razorpay_checkout',
    checkoutData: {
      key: gateway.api_key || 'rzp_test_9wuOSlATpSiUGq',
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'AED',
      name: 'Trip Habibi',
      description: 'Tour Booking Payment',
      order_id: bookingId,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      theme: {
        color: '#3B82F6'
      }
    }
  };
}

async function handleStripe(params: any) {
  const { gateway, amount, customerName, customerEmail, customerPhone, bookingId, origin } = params;
  
  logStep("Processing Stripe payment");

  if (!gateway.api_secret) {
    throw new Error('Stripe secret key not configured');
  }

  const stripe = new Stripe(gateway.api_secret, {
    apiVersion: '2023-10-16',
  });

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'aed',
            product_data: {
              name: 'Tour Booking',
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to fils
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?cancelled=true`,
      metadata: {
        booking_id: bookingId,
      },
    });

    return {
      success: true,
      paymentMethod: 'stripe',
      requiresAction: true,
      actionType: 'redirect',
      checkoutUrl: session.url,
      sessionId: session.id
    };
  } catch (error: any) {
    logStep("Stripe error", error.message);
    throw new Error(`Stripe payment failed: ${error.message}`);
  }
}

async function handleCash(params: any) {
  const { bookingId, supabase } = params;
  
  logStep("Processing cash payment");

  const { error } = await supabase
    .from('new_bookings')
    .update({
      payment_status: 'pending',
      booking_status: 'confirmed',
      payment_method: 'cash_on_arrival',
      confirmed_at: new Date().toISOString()
    })
    .eq('id', bookingId);

  if (error) {
    logStep("Cash payment update error", error);
    throw error;
  }

  return {
    success: true,
    paymentMethod: 'cash_on_arrival',
    requiresAction: false,
    message: 'Booking confirmed! Please pay in cash at the pickup location.'
  };
}

async function handleBankTransfer(params: any) {
  const { bookingId, supabase, gateway } = params;
  
  logStep("Processing bank transfer");

  const { error } = await supabase
    .from('new_bookings')
    .update({
      payment_status: 'pending',
      booking_status: 'pending',
      payment_method: 'bank_transfer'
    })
    .eq('id', bookingId);

  if (error) {
    logStep("Bank transfer update error", error);
    throw error;
  }

  return {
    success: true,
    paymentMethod: 'bank_transfer',
    requiresAction: false,
    message: 'Please transfer the amount to our bank account.',
    bankDetails: gateway.bank_details
  };
}
