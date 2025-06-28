
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CurrencySettings from './settings/CurrencySettings';
import SMTPSettings from './settings/SMTPSettings';

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

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
      <CurrencySettings 
        settings={settings}
        onSettingChange={handleSettingChange}
        onSettingUpdate={updateSetting}
      />
      
      <SMTPSettings 
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      <Button onClick={handleSaveAll} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  );
};

export default SystemSettings;
