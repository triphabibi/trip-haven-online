import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

    console.log('🧪 [TEST-EMAIL] Sending test email to:', to);
    console.log('🧪 [TEST-EMAIL] SMTP Settings:', {
      host: smtp_settings.smtp_host,
      port: smtp_settings.smtp_port,
      user: smtp_settings.smtp_user,
      from: smtp_settings.from_email
    });

    // Validate required fields
    if (!smtp_settings.smtp_host || !smtp_settings.smtp_user || !smtp_settings.smtp_password || !smtp_settings.from_email) {
      throw new Error('Missing required SMTP configuration. Please check your settings.');
    }

    if (!to || !to.includes('@')) {
      throw new Error('Please provide a valid email address to send test email to.');
    }

    try {
      // Create SMTP client
      const client = new SMTPClient({
        connection: {
          hostname: smtp_settings.smtp_host,
          port: smtp_settings.smtp_port,
          tls: smtp_settings.smtp_port === 465, // Use TLS for port 465 (SSL), STARTTLS for 587
          auth: {
            username: smtp_settings.smtp_user,
            password: smtp_settings.smtp_password,
          },
        },
      });

      console.log('📤 [TEST-EMAIL] Connecting to SMTP server...');

      // Prepare email content
      const emailContent = {
        from: `${smtp_settings.from_name} <${smtp_settings.from_email}>`,
        to: to,
        subject: '✅ Test Email from TripHabibi - SMTP Configuration Working!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>SMTP Test Email</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 20px; background: #f9f9f9; }
              .success-box { background: #10B981; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
              .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10B981; }
              .footer { text-align: center; padding: 20px; color: #666; background: #f1f5f9; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 SMTP Test Successful!</h1>
              </div>
              <div class="content">
                <div class="success-box">
                  <strong>✅ Your SMTP configuration is working correctly!</strong>
                </div>
                
                <p>Congratulations! This test email confirms that your SMTP settings are properly configured and working.</p>
                
                <div class="info-box">
                  <h3>📧 Email Configuration Details</h3>
                  <p><strong>SMTP Host:</strong> ${smtp_settings.smtp_host}</p>
                  <p><strong>SMTP Port:</strong> ${smtp_settings.smtp_port}</p>
                  <p><strong>From Name:</strong> ${smtp_settings.from_name}</p>
                  <p><strong>From Email:</strong> ${smtp_settings.from_email}</p>
                  <p><strong>Test Sent At:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <div class="info-box">
                  <h3>🚀 What's Next?</h3>
                  <p>• Your booking confirmation emails will now be sent automatically</p>
                  <p>• Customers will receive professional email notifications</p>
                  <p>• Admin notifications will be delivered to your configured email</p>
                </div>

                <p>If you received this email, your email system is ready to go! 🌟</p>
              </div>
              <div class="footer">
                <p>This test email was sent from your TripHabibi admin panel</p>
                <p>Trip Habibi Email System © ${new Date().getFullYear()}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      console.log('📬 [TEST-EMAIL] Sending email...');

      // Send the email
      await client.send(emailContent);
      
      console.log('✅ [TEST-EMAIL] Email sent successfully!');

      // Close the connection
      await client.close();

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Test email sent successfully! Check your inbox.',
          email_data: {
            to: to,
            from: `${smtp_settings.from_name} <${smtp_settings.from_email}>`,
            subject: emailContent.subject,
            sent_at: new Date().toISOString()
          }
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );

    } catch (smtpError: any) {
      console.error('❌ [TEST-EMAIL] SMTP Error:', smtpError);
      
      // Provide specific error messages for common SMTP issues
      let errorMessage = 'SMTP connection failed. ';
      
      if (smtpError.message?.includes('authentication')) {
        errorMessage += 'Please check your email and password credentials.';
      } else if (smtpError.message?.includes('connection')) {
        errorMessage += 'Please verify your SMTP host and port settings.';
      } else if (smtpError.message?.includes('certificate') || smtpError.message?.includes('TLS')) {
        errorMessage += 'SSL/TLS connection issue. For Hostinger, use port 465 with SSL.';
      } else {
        errorMessage += smtpError.message || 'Unknown SMTP error occurred.';
      }
      
      throw new Error(errorMessage);
    }

  } catch (error: any) {
    console.error('❌ [TEST-EMAIL] General Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to send test email',
        details: 'Please check your SMTP configuration and try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});