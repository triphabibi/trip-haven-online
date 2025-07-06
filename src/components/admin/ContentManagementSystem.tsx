
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Image as ImageIcon, 
  Settings, 
  Eye,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import HomepageSliderManagement from './HomepageSliderManagement';
import MenuManagement from './MenuManagement';

const ContentManagementSystem = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [siteSettings, setSiteSettings] = useState({
    site_title: '',
    site_description: '',
    site_logo: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    currency: 'AED',
    maintenance_mode: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'setting_key' 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: "Settings updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating settings", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  useEffect(() => {
    if (settings) {
      const settingsObj: any = {};
      settings.forEach((setting: any) => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      setSiteSettings(prev => ({ ...prev, ...settingsObj }));
    }
  }, [settings]);

  const handleSettingUpdate = (key: string, value: string | boolean) => {
    setSiteSettings(prev => ({ ...prev, [key]: value }));
    updateSettingMutation.mutate({ key, value: value.toString() });
  };

  // Helper function to safely check boolean values
  const isBooleanTrue = (value: string | boolean): boolean => {
    if (typeof value === 'boolean') return value;
    return value === 'true';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading content management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Content Management</h2>
          <p className="text-gray-600">Manage your website content and settings</p>
        </div>
      </div>

      <Tabs defaultValue="site-settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
          <TabsTrigger value="sliders">Homepage Sliders</TabsTrigger>
          <TabsTrigger value="menus">Navigation Menus</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="site-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Site Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={siteSettings.site_title}
                    onChange={(e) => handleSettingUpdate('site_title', e.target.value)}
                    placeholder="TripHabibi"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input
                    id="currency"
                    value={siteSettings.currency}
                    onChange={(e) => handleSettingUpdate('currency', e.target.value)}
                    placeholder="AED"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={siteSettings.site_description}
                    onChange={(e) => handleSettingUpdate('site_description', e.target.value)}
                    placeholder="Your premier travel and tourism partner"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={siteSettings.contact_email}
                    onChange={(e) => handleSettingUpdate('contact_email', e.target.value)}
                    placeholder="info@triphabibi.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={siteSettings.contact_phone}
                    onChange={(e) => handleSettingUpdate('contact_phone', e.target.value)}
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={siteSettings.address}
                    onChange={(e) => handleSettingUpdate('address', e.target.value)}
                    placeholder="Dubai, UAE"
                    rows={2}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenance_mode"
                      checked={isBooleanTrue(siteSettings.maintenance_mode)}
                      onCheckedChange={(checked) => handleSettingUpdate('maintenance_mode', checked)}
                    />
                    <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Enable this to show a maintenance page to visitors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sliders">
          <HomepageSliderManagement />
        </TabsContent>

        <TabsContent value="menus">
          <MenuManagement />
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="meta_title">Default Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={siteSettings.meta_title}
                    onChange={(e) => handleSettingUpdate('meta_title', e.target.value)}
                    placeholder="TripHabibi - Your Premier Travel Partner"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">Default Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={siteSettings.meta_description}
                    onChange={(e) => handleSettingUpdate('meta_description', e.target.value)}
                    placeholder="Discover amazing tours, visa services, and travel packages with TripHabibi"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_keywords">Default Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={siteSettings.meta_keywords}
                    onChange={(e) => handleSettingUpdate('meta_keywords', e.target.value)}
                    placeholder="travel, tourism, tours, visa, Dubai, UAE"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementSystem;
