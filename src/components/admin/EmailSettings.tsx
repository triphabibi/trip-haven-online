
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Send, FileText, Settings } from 'lucide-react';

interface EmailTemplate {
  id?: string;
  template_name: string;
  subject: string;
  html_body: string;
  variables: string[];
  is_active: boolean;
}

const EmailSettings = () => {
  const [smtpSettings, setSmtpSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_name: 'TripHabibi',
    from_email: '',
    is_enabled: true
  });
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailSettings();
    initializeTemplates();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSmtpSettings({
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_user: data.smtp_user,
          smtp_password: data.smtp_password,
          from_name: data.from_name,
          from_email: data.from_email,
          is_enabled: data.is_enabled
        });
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
    }
  };

  const initializeTemplates = () => {
    const defaultTemplates: EmailTemplate[] = [
      {
        template_name: 'booking_confirmation',
        subject: 'Booking Confirmation - {{booking_reference}}',
        html_body: `
          <h1>Booking Confirmed!</h1>
          <p>Dear {{customer_name}},</p>
          <p>Your booking has been confirmed with reference: <strong>{{booking_reference}}</strong></p>
          <h3>Booking Details:</h3>
          <ul>
            <li>Service: {{service_name}}</li>
            <li>Date: {{travel_date}}</li>
            <li>Travelers: {{traveler_count}}</li>
            <li>Total Amount: ₹{{total_amount}}</li>
          </ul>
          <p>Thank you for choosing TripHabibi!</p>
        `,
        variables: ['customer_name', 'booking_reference', 'service_name', 'travel_date', 'traveler_count', 'total_amount'],
        is_active: true
      },
      {
        template_name: 'admin_booking_alert',
        subject: 'New Booking Alert - {{booking_reference}}',
        html_body: `
          <h1>New Booking Received</h1>
          <p>A new booking has been received:</p>
          <h3>Details:</h3>
          <ul>
            <li>Reference: {{booking_reference}}</li>
            <li>Customer: {{customer_name}}</li>
            <li>Email: {{customer_email}}</li>
            <li>Phone: {{customer_phone}}</li>
            <li>Service: {{service_name}}</li>
            <li>Amount: ₹{{total_amount}}</li>
          </ul>
          <p>Please review and process this booking.</p>
        `,
        variables: ['booking_reference', 'customer_name', 'customer_email', 'customer_phone', 'service_name', 'total_amount'],
        is_active: true
      },
      {
        template_name: 'visa_approval',
        subject: 'Visa Application Approved - {{application_id}}',
        html_body: `
          <h1>Visa Application Approved!</h1>
          <p>Dear {{applicant_name}},</p>
          <p>Your visa application ({{application_id}}) has been approved.</p>
          <p>Please find your visa documents attached.</p>
          <p>Safe travels!</p>
        `,
        variables: ['applicant_name', 'application_id'],
        is_active: true
      }
    ];
    setTemplates(defaultTemplates);
  };

  const saveSmtpSettings = async () => {
    setLoading(true);
    try {
      // First, try to get existing settings
      const { data: existingData } = await supabase
        .from('email_settings')
        .select('id')
        .single();

      let result;
      
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('email_settings')
          .update({
            smtp_host: smtpSettings.smtp_host,
            smtp_port: smtpSettings.smtp_port,
            smtp_user: smtpSettings.smtp_user,
            smtp_password: smtpSettings.smtp_password,
            from_name: smtpSettings.from_name,
            from_email: smtpSettings.from_email,
            is_enabled: smtpSettings.is_enabled
          })
          .eq('id', existingData.id)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('email_settings')
          .insert({
            smtp_host: smtpSettings.smtp_host,
            smtp_port: smtpSettings.smtp_port,
            smtp_user: smtpSettings.smtp_user,
            smtp_password: smtpSettings.smtp_password,
            from_name: smtpSettings.from_name,
            from_email: smtpSettings.from_email,
            is_enabled: smtpSettings.is_enabled
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('SMTP settings save error:', result.error);
        throw result.error;
      }

      console.log('SMTP settings saved:', result.data);
      toast({
        title: "Success",
        description: "SMTP settings saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving SMTP settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save SMTP settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: {
          to: testEmail,
          smtp_settings: smtpSettings
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test email sent successfully",
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = (templateName: string, field: string, value: any) => {
    setTemplates(prev => prev.map(template => 
      template.template_name === templateName 
        ? { ...template, [field]: value }
        : template
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="smtp" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="test">Test Email</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SMTP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="email_enabled"
                  checked={smtpSettings.is_enabled}
                  onCheckedChange={(checked) => setSmtpSettings(prev => ({ ...prev, is_enabled: checked }))}
                />
                <Label htmlFor="email_enabled">Enable Email System</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={smtpSettings.smtp_host}
                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={smtpSettings.smtp_port}
                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_port: parseInt(e.target.value) }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtp_user">SMTP Username</Label>
                <Input
                  id="smtp_user"
                  type="email"
                  value={smtpSettings.smtp_user}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="smtp_password">SMTP Password</Label>
                <Input
                  id="smtp_password"
                  type="password"
                  value={smtpSettings.smtp_password}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                  placeholder="Your app password"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={smtpSettings.from_email}
                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, from_email: e.target.value }))}
                    placeholder="noreply@triphabibi.in"
                  />
                </div>
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={smtpSettings.from_name}
                    onChange={(e) => setSmtpSettings(prev => ({ ...prev, from_name: e.target.value }))}
                    placeholder="TripHabibi"
                  />
                </div>
              </div>

              <Button onClick={saveSmtpSettings} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save SMTP Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.template_name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {template.template_name.replace('_', ' ').toUpperCase()}
                    </CardTitle>
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={(checked) => updateTemplate(template.template_name, 'is_active', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={template.subject}
                      onChange={(e) => updateTemplate(template.template_name, 'subject', e.target.value)}
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <Label>HTML Body</Label>
                    <Textarea
                      value={template.html_body}
                      onChange={(e) => updateTemplate(template.template_name, 'html_body', e.target.value)}
                      placeholder="Email HTML content"
                      rows={8}
                    />
                  </div>
                  <div>
                    <Label>Available Variables</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.variables.map((variable) => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Test Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test_email">Test Email Address</Label>
                <Input
                  id="test_email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to test"
                />
              </div>
              <Button onClick={sendTestEmail} disabled={loading} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Test Email'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailSettings;
