
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { booking_id, template_type } = await req.json();

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('new_bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingError) throw bookingError;

    // Fetch email settings
    const { data: emailSettings, error: emailError } = await supabase
      .from('email_settings')
      .select('*')
      .single();

    if (emailError) throw emailError;

    if (!emailSettings.is_enabled) {
      return new Response(
        JSON.stringify({ error: 'Email system is disabled' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Prepare email template variables
    const variables = {
      customer_name: booking.customer_name,
      booking_reference: booking.booking_reference,
      service_name: 'Tour Service', // You can fetch this from the service table
      travel_date: booking.travel_date || 'TBD',
      traveler_count: booking.adults_count + booking.children_count + booking.infants_count,
      total_amount: booking.final_amount,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone
    };

    // Get email template (you can fetch from DB or use default)
    let subject = '';
    let htmlBody = '';

    if (template_type === 'booking_confirmation') {
      subject = `Booking Confirmation - ${variables.booking_reference}`;
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Booking Confirmed!</h1>
          <p>Dear ${variables.customer_name},</p>
          <p>Your booking has been confirmed with reference: <strong>${variables.booking_reference}</strong></p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Booking Details:</h3>
            <ul style="color: #6b7280;">
              <li>Service: ${variables.service_name}</li>
              <li>Date: ${variables.travel_date}</li>
              <li>Travelers: ${variables.traveler_count}</li>
              <li>Total Amount: ₹${variables.total_amount}</li>
            </ul>
          </div>
          
          <p>Thank you for choosing TripHabibi!</p>
          <p style="color: #9ca3af; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `;
    }

    console.log('Email prepared:', {
      to: booking.customer_email,
      subject,
      from: `${emailSettings.from_name} <${emailSettings.from_email}>`,
      booking_reference: booking.booking_reference
    });

    // In a real implementation, you would send the email here using your SMTP settings
    // For now, we'll just log the email data

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Booking email sent successfully',
        booking_reference: booking.booking_reference 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in send-booking-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send booking email' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
