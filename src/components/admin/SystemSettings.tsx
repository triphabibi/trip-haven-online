
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, Mail, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SystemSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Use site_settings table instead of system_settings
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {});
      
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default_currency">Default Currency</Label>
            <Select 
              value={settings.default_currency || 'INR'} 
              onValueChange={(value) => updateSetting('default_currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto_currency_conversion"
              checked={settings.auto_currency_conversion === 'true'}
              onCheckedChange={(checked) => updateSetting('auto_currency_conversion', checked.toString())}
            />
            <Label htmlFor="auto_currency_conversion">Enable Auto Currency Conversion</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stripe_currency">Stripe Currency</Label>
              <Input
                id="stripe_currency"
                value={settings.stripe_currency || 'USD'}
                onChange={(e) => setSettings(prev => ({ ...prev, stripe_currency: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="paypal_currency">PayPal Currency</Label>
              <Input
                id="paypal_currency"
                value={settings.paypal_currency || 'USD'}
                onChange={(e) => setSettings(prev => ({ ...prev, paypal_currency: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            SMTP Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                id="smtp_host"
                placeholder="smtp.gmail.com"
                value={settings.smtp_host || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="smtp_port">SMTP Port</Label>
              <Input
                id="smtp_port"
                type="number"
                placeholder="587"
                value={settings.smtp_port || '587'}
                onChange={(e) => setSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="smtp_username">SMTP Username</Label>
            <Input
              id="smtp_username"
              type="email"
              placeholder="your-email@gmail.com"
              value={settings.smtp_username || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="smtp_password">SMTP Password</Label>
            <Input
              id="smtp_password"
              type="password"
              placeholder="Your app password"
              value={settings.smtp_password || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp_from_email">From Email</Label>
              <Input
                id="smtp_from_email"
                type="email"
                placeholder="noreply@triphabibi.in"
                value={settings.smtp_from_email || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, smtp_from_email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="smtp_from_name">From Name</Label>
              <Input
                id="smtp_from_name"
                placeholder="TripHabibi"
                value={settings.smtp_from_name || 'TripHabibi'}
                onChange={(e) => setSettings(prev => ({ ...prev, smtp_from_name: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveAll} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  );
};

export default SystemSettings;
