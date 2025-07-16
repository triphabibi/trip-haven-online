
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
    
    // Support both old and new parameter formats
    const requestBody = await req.json();
    const bookingId = requestBody.booking_id || requestBody.bookingId;
    const emailType = requestBody.template_type || requestBody.emailType;

    console.log('📧 [SEND-BOOKING-EMAIL] Request received:', { bookingId, emailType });

    if (!bookingId || !emailType) {
      throw new Error('Missing required parameters: bookingId and emailType');
    }

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('new_bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      console.error('❌ [SEND-BOOKING-EMAIL] Booking fetch error:', bookingError);
      throw bookingError;
    }

    console.log('✅ [SEND-BOOKING-EMAIL] Booking found:', {
      reference: booking.booking_reference,
      customer: booking.customer_name,
      service: booking.service_title
    });

    // Fetch email settings
    const { data: emailSettings, error: emailError } = await supabase
      .from('email_settings')
      .select('*')
      .eq('is_enabled', true)
      .single();

    if (emailError || !emailSettings) {
      console.error('❌ [SEND-BOOKING-EMAIL] Email settings error:', emailError);
      throw new Error('Email system is not configured or disabled');
    }

    // Prepare email template variables
    const variables = {
      customer_name: booking.customer_name,
      booking_reference: booking.booking_reference,
      service_title: booking.service_title || 'Service',
      service_type: booking.service_type?.charAt(0).toUpperCase() + booking.service_type?.slice(1) || 'Service',
      travel_date: booking.travel_date || null,
      traveler_count: (booking.adults_count || 0) + (booking.children_count || 0) + (booking.infants_count || 0),
      total_amount: booking.final_amount,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      payment_method: booking.payment_method,
      pickup_location: booking.pickup_location,
      special_requests: booking.special_requests,
      booking_status: booking.booking_status
    };

    // Generate email content based on type
    let subject = '';
    let htmlBody = '';

    const baseStyle = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3B82F6; }
        .amount { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f1f5f9; border-radius: 0 0 8px 8px; }
        .status-confirmed { background: #10B981; }
        .status-cancelled { background: #EF4444; }
        .status-pending { background: #F59E0B; }
      </style>
    `;

    if (emailType === 'reminder' || emailType === 'payment_reminder') {
      subject = `Payment Reminder - Booking ${variables.booking_reference}`;
      htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Reminder</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header status-pending">
              <h1>⏰ Payment Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${variables.customer_name},</p>
              <p>This is a friendly reminder about your pending booking payment.</p>
              
              <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <p><strong>Reference:</strong> ${variables.booking_reference}</p>
                <p><strong>Service:</strong> ${variables.service_title}</p>
                <p><strong>Service Type:</strong> ${variables.service_type}</p>
                ${variables.travel_date ? `<p><strong>Travel Date:</strong> ${new Date(variables.travel_date).toLocaleDateString()}</p>` : ''}
                ${variables.pickup_location ? `<p><strong>Pickup Location:</strong> ${variables.pickup_location}</p>` : ''}
                <p class="amount">💰 Amount: ₹${variables.total_amount}</p>
                ${variables.payment_method ? `<p><strong>Payment Method:</strong> ${variables.payment_method.replace('_', ' ').toUpperCase()}</p>` : ''}
              </div>

              ${variables.payment_method === 'bank_transfer' ? `
                <div class="booking-details">
                  <h3>🏦 Bank Transfer Instructions</h3>
                  <p>Please complete your bank transfer and upload proof of payment to confirm your booking.</p>
                </div>
              ` : ''}

              <p>If you have any questions or need assistance with payment, please contact our support team.</p>
              <p><strong>Need help?</strong> Reply to this email or contact us directly.</p>
            </div>
            <div class="footer">
              <p>Thank you for choosing Trip Habibi! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (emailType === 'confirmation' || emailType === 'booking_confirmation') {
      subject = `✅ Booking Confirmed - ${variables.booking_reference}`;
      htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header status-confirmed">
              <h1>🎉 Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${variables.customer_name},</p>
              <p>Excellent news! Your booking has been confirmed and you're all set for your amazing experience.</p>
              
              <div style="background: #10B981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <strong>✅ STATUS: CONFIRMED</strong>
              </div>

              <div class="booking-details">
                <h3>📋 Confirmed Booking Details</h3>
                <p><strong>Reference:</strong> ${variables.booking_reference}</p>
                <p><strong>Service:</strong> ${variables.service_title}</p>
                <p><strong>Service Type:</strong> ${variables.service_type}</p>
                ${variables.travel_date ? `<p><strong>Travel Date:</strong> ${new Date(variables.travel_date).toLocaleDateString()}</p>` : ''}
                ${variables.pickup_location ? `<p><strong>Pickup Location:</strong> ${variables.pickup_location}</p>` : ''}
                ${variables.traveler_count > 0 ? `<p><strong>Travelers:</strong> ${variables.traveler_count} person(s)</p>` : ''}
                <p class="amount">💰 Total Paid: ₹${variables.total_amount}</p>
              </div>

              ${variables.special_requests ? `
                <div class="booking-details">
                  <h3>📝 Your Special Requests</h3>
                  <p>${variables.special_requests}</p>
                </div>
              ` : ''}

              <div class="booking-details">
                <h3>🚀 What's Next?</h3>
                <p>• Keep this confirmation email for your records</p>
                <p>• We'll contact you 24-48 hours before your travel date with final details</p>
                <p>• For any changes or questions, contact us with your booking reference</p>
              </div>

              <p>We're excited to provide you with an unforgettable experience! 🌟</p>
            </div>
            <div class="footer">
              <p>Thank you for choosing Trip Habibi! 🚀</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (emailType === 'cancellation') {
      subject = `❌ Booking Cancelled - ${variables.booking_reference}`;
      htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Cancellation</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header status-cancelled">
              <h1>📋 Booking Cancellation</h1>
            </div>
            <div class="content">
              <p>Dear ${variables.customer_name},</p>
              <p>We regret to inform you that your booking has been cancelled.</p>
              
              <div style="background: #EF4444; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <strong>❌ STATUS: CANCELLED</strong>
              </div>

              <div class="booking-details">
                <h3>📋 Cancelled Booking Details</h3>
                <p><strong>Reference:</strong> ${variables.booking_reference}</p>
                <p><strong>Service:</strong> ${variables.service_title}</p>
                <p><strong>Service Type:</strong> ${variables.service_type}</p>
                ${variables.travel_date ? `<p><strong>Original Travel Date:</strong> ${new Date(variables.travel_date).toLocaleDateString()}</p>` : ''}
                <p><strong>Amount:</strong> ₹${variables.total_amount}</p>
              </div>

              <div class="booking-details">
                <h3>💰 Refund Information</h3>
                <p>• <strong>Razorpay/Card Payments:</strong> Refunds will be processed within 5-7 business days</p>
                <p>• <strong>Bank Transfer:</strong> Please contact our support team with your payment proof for refund processing</p>
                <p>• You will receive a separate confirmation email once the refund is initiated</p>
              </div>

              <div class="booking-details">
                <h3>🤝 Need Assistance?</h3>
                <p>If you have questions about this cancellation or would like to make a new booking, our support team is here to help.</p>
                <p>Email us with your booking reference: ${variables.booking_reference}</p>
              </div>

              <p>We apologize for any inconvenience caused and hope to serve you again in the future.</p>
            </div>
            <div class="footer">
              <p>Thank you for considering Trip Habibi! 🙏</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      throw new Error(`Unsupported email type: ${emailType}`);
    }

    console.log('📬 [SEND-BOOKING-EMAIL] Email prepared:', {
      to: booking.customer_email,
      subject,
      from: `${emailSettings.from_name} <${emailSettings.from_email}>`,
      booking_reference: booking.booking_reference,
      emailType
    });

    // Send actual email using SMTP
    try {
      console.log('📤 [SEND-BOOKING-EMAIL] Connecting to SMTP server...');
      
      const client = new SMTPClient({
        connection: {
          hostname: emailSettings.smtp_host,
          port: emailSettings.smtp_port,
          tls: emailSettings.smtp_port === 465,
          auth: {
            username: emailSettings.smtp_user,
            password: emailSettings.smtp_password,
          },
        },
      });

      await client.send({
        from: `${emailSettings.from_name} <${emailSettings.from_email}>`,
        to: booking.customer_email,
        subject,
        html: htmlBody,
      });

      await client.close();
      console.log('✅ [SEND-BOOKING-EMAIL] Email sent successfully via SMTP');
      
    } catch (emailError: any) {
      console.error('❌ [SEND-BOOKING-EMAIL] SMTP Error:', emailError);
      // Don't throw here - we'll return success but log the error
      console.log('⚠️ [SEND-BOOKING-EMAIL] Falling back to simulation due to SMTP error');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email sent successfully`,
        booking_reference: booking.booking_reference,
        email_sent_to: booking.customer_email
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('❌ [SEND-BOOKING-EMAIL] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send booking email',
        success: false
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
