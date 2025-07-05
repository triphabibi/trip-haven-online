
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Upload, Plus, Trash2, Move } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'TripHabibi',
    site_description: 'Your trusted travel partner',
    logo_url: '',
    favicon_url: '',
    contact_email: 'info@triphabibi.com',
    contact_phone: '+971-XX-XXXXXXX',
    address: 'Dubai, UAE',
    social_links: {}
  });
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Tours', href: '/tours', icon: 'Plane', order: 1, is_active: true },
    { id: '2', name: 'Packages', href: '/packages', icon: 'FileText', order: 2, is_active: true },
    { id: '3', name: 'Tickets', href: '/tickets', icon: 'Ticket', order: 3, is_active: true },
    { id: '4', name: 'Visas', href: '/visas', icon: 'FileText', order: 4, is_active: true },
    { id: '5', name: 'Ok to Board', href: '/ok-to-board', icon: 'Plane', order: 5, is_active: true },
    { id: '6', name: 'Transfers', href: '/transfers', icon: 'Car', order: 6, is_active: true },
  ]);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    href: '',
    icon: 'Link'
  });

  const availableIcons = [
    'Plane', 'Car', 'FileText', 'Ticket', 'Home', 'User', 'Phone', 
    'Mail', 'MapPin', 'Camera', 'Star', 'Heart', 'Link'
  ];

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Save site settings to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Save menu items
      const { error: menuError } = await supabase
        .from('menu_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (menuError) throw menuError;

      const { error: insertError } = await supabase
        .from('menu_items')
        .insert(menuItems.map(item => ({
          name: item.name,
          href: item.href,
          icon: item.icon,
          order_index: item.order,
          is_active: item.is_active
        })));

      if (insertError) throw insertError;

      toast({
        title: "Settings Saved",
        description: "Site settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.href) {
      toast({
        title: "Missing Information",
        description: "Please enter menu name and URL.",
        variant: "destructive",
      });
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: newMenuItem.name,
      href: newMenuItem.href,
      icon: newMenuItem.icon,
      order: menuItems.length + 1,
      is_active: true
    };

    setMenuItems([...menuItems, newItem]);
    setNewMenuItem({ name: '', href: '', icon: 'Link' });
    
    toast({
      title: "Menu Item Added",
      description: "New menu item has been added.",
    });
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({
      title: "Menu Item Removed",
      description: "Menu item has been removed.",
    });
  };

  const toggleMenuItem = (id: string) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, is_active: !item.is_active } : item
    ));
  };

  const moveMenuItem = (id: string, direction: 'up' | 'down') => {
    const index = menuItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === menuItems.length - 1)
    ) return;

    const newItems = [...menuItems];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    
    // Update order numbers
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });
    
    setMenuItems(newItems);
  };

  return (
    <div className="space-y-6">
      {/* Site Information */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-6 w-6" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Site Name</Label>
              <Input
                value={settings.site_name}
                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                placeholder="TripHabibi"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label className="font-medium">Contact Email</Label>
              <Input
                value={settings.contact_email}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="info@triphabibi.com"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label className="font-medium">Contact Phone</Label>
              <Input
                value={settings.contact_phone}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+971-XX-XXXXXXX"
                className="bg-white border-gray-300"
              />
            </div>
            <div>
              <Label className="font-medium">Address</Label>
              <Input
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Dubai, UAE"
                className="bg-white border-gray-300"
              />
            </div>
          </div>
          
          <div>
            <Label className="font-medium">Site Description</Label>
            <Textarea
              value={settings.site_description}
              onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
              placeholder="Your trusted travel partner"
              className="bg-white border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Management */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="text-xl">Menu Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Current Menu Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Current Menu Items</h3>
            {menuItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm text-gray-600">({item.href})</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active}
                    onCheckedChange={() => toggleMenuItem(item.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveMenuItem(item.id, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveMenuItem(item.id, 'down')}
                    disabled={index === menuItems.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMenuItem(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Menu Item */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add New Menu Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Menu Name"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border-gray-300"
              />
              <Input
                placeholder="URL (e.g., /contact)"
                value={newMenuItem.href}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, href: e.target.value }))}
                className="bg-white border-gray-300"
              />
              <select
                value={newMenuItem.icon}
                onChange={(e) => setNewMenuItem(prev => ({ ...prev, icon: e.target.value }))}
                className="h-10 px-3 border border-gray-300 rounded-md bg-white text-gray-900"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <Button onClick={addMenuItem} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        onClick={saveSettings} 
        disabled={loading}
        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {loading ? 'Saving...' : 'Save All Settings'}
      </Button>
    </div>
  );
};

export default SiteSettings;
