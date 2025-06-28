
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  smtp_settings: {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    from_name: string;
    from_email: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, smtp_settings }: EmailRequest = await req.json();

    // This is a simplified test email sender
    // In production, you would integrate with an actual email service
    console.log('Test email would be sent to:', to);
    console.log('SMTP Settings:', {
      host: smtp_settings.smtp_host,
      port: smtp_settings.smtp_port,
      user: smtp_settings.smtp_user,
      from: smtp_settings.from_email
    });

    // Simulate email sending
    const emailData = {
      to,
      from: `${smtp_settings.from_name} <${smtp_settings.from_email}>`,
      subject: 'Test Email from TripHabibi',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your TripHabibi email system.</p>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `
    };

    console.log('Email data prepared:', emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        email_data: emailData 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in send-test-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send test email' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
