
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  bookingId: string;
  gatewayName: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Payment processing started");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const {
      bookingId,
      gatewayName,
      amount,
      currency = 'AED',
      customerName,
      customerEmail,
      customerPhone,
      returnUrl
    }: PaymentRequest = await req.json();

    logStep("Request data received", { bookingId, gatewayName, amount });

    // Get payment gateway configuration
    const { data: gateway, error: gatewayError } = await supabase
      .from('payment_gateways')
      .select('*')
      .eq('gateway_name', gatewayName)
      .eq('is_enabled', true)
      .single();

    if (gatewayError || !gateway) {
      throw new Error(`Payment gateway ${gatewayName} not found or disabled`);
    }

    logStep("Gateway found", { gatewayName: gateway.display_name });

    let paymentResult;

    switch (gatewayName) {
      case 'razorpay':
        paymentResult = await processRazorpayPayment({
          gateway,
          amount,
          currency,
          customerName,
          customerEmail,
          customerPhone,
          bookingId,
          returnUrl
        });
        break;

      case 'stripe':
        paymentResult = await processStripePayment({
          gateway,
          amount,
          currency,
          customerName,
          customerEmail,
          customerPhone,
          bookingId,
          returnUrl
        });
        break;

      case 'cash_on_arrival':
        paymentResult = await processCashPayment({
          gateway,
          bookingId,
          supabase
        });
        break;

      case 'bank_transfer':
        paymentResult = await processBankTransferPayment({
          gateway,
          bookingId,
          supabase
        });
        break;

      default:
        throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }

    logStep("Payment processed successfully", { paymentResult });

    return new Response(JSON.stringify(paymentResult), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });

  } catch (error: any) {
    logStep("Payment processing error", { error: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});

async function processRazorpayPayment(params: any) {
  const { gateway, amount, currency, customerName, customerEmail, customerPhone, bookingId, returnUrl } = params;
  
  logStep("Processing Razorpay payment");

  // For Razorpay, we create an order and return the order details for frontend processing
  const razorpayOptions = {
    key: gateway.api_key || 'rzp_test_9wuOSlATpSiUGq',
    amount: Math.round(amount * 100), // Convert to paise
    currency: currency,
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
    },
    handler_url: `${returnUrl}?status=success`,
    cancel_url: `${returnUrl}?status=cancelled`
  };

  return {
    success: true,
    paymentMethod: 'razorpay',
    requiresAction: true,
    actionType: 'redirect_to_checkout',
    checkoutData: razorpayOptions
  };
}

async function processStripePayment(params: any) {
  const { gateway, amount, currency, customerName, customerEmail, customerPhone, bookingId, returnUrl } = params;
  
  logStep("Processing Stripe payment");

  if (!gateway.api_secret) {
    throw new Error('Stripe secret key not configured');
  }

  const stripe = new Stripe(gateway.api_secret, {
    apiVersion: '2023-10-16',
  });

  // Check if customer exists
  let customer;
  const existingCustomers = await stripe.customers.list({
    email: customerEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: 'Tour Booking',
            description: `Booking ID: ${bookingId}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${returnUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?status=cancelled`,
    metadata: {
      booking_id: bookingId,
    },
  });

  return {
    success: true,
    paymentMethod: 'stripe',
    requiresAction: true,
    actionType: 'redirect_to_checkout',
    checkoutUrl: session.url,
    sessionId: session.id
  };
}

async function processCashPayment(params: any) {
  const { gateway, bookingId, supabase } = params;
  
  logStep("Processing cash payment");

  // Update booking status to confirmed for cash payment
  const { error } = await supabase
    .from('new_bookings')
    .update({
      payment_status: 'pending',
      booking_status: 'confirmed',
      payment_method: 'cash_on_arrival',
      confirmed_at: new Date().toISOString()
    })
    .eq('id', bookingId);

  if (error) throw error;

  return {
    success: true,
    paymentMethod: 'cash_on_arrival',
    requiresAction: false,
    message: 'Booking confirmed! Please pay in cash at the pickup location.',
    instructions: gateway.instructions || 'You can pay in cash at the pickup location or when you meet our representative.'
  };
}

async function processBankTransferPayment(params: any) {
  const { gateway, bookingId, supabase } = params;
  
  logStep("Processing bank transfer payment");

  // Update booking status to pending for bank transfer
  const { error } = await supabase
    .from('new_bookings')
    .update({
      payment_status: 'pending',
      booking_status: 'pending',
      payment_method: 'bank_transfer'
    })
    .eq('id', bookingId);

  if (error) throw error;

  return {
    success: true,
    paymentMethod: 'bank_transfer',
    requiresAction: false,
    message: 'Please transfer the amount to our bank account. Payment confirmation will be processed within 24 hours.',
    bankDetails: gateway.bank_details,
    instructions: gateway.instructions
  };
}
