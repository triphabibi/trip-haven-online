
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Menu, ExternalLink } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  menu_type: string;
  target: string;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
}

const MenuManagement = () => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    href: '',
    icon: 'Link',
    menu_type: 'header',
    target: '_self',
    parent_id: '',
    order_index: 0,
    is_active: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<MenuItem, 'id'>) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          href: item.href,
          icon: item.icon,
          menu_type: item.menu_type,
          target: item.target,
          parent_id: item.parent_id || null,
          order_index: item.order_index,
          is_active: item.is_active
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu_items'] });
      toast({ title: "Menu item created successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error creating menu item", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu_items'] });
      toast({ title: "Menu item updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error updating menu item", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu_items'] });
      toast({ title: "Menu item deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting menu item", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      href: '',
      icon: 'Link',
      menu_type: 'header',
      target: '_self',
      parent_id: '',
      order_index: 0,
      is_active: true
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMutation.mutate({ ...formData, id: editingItem.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      href: item.href,
      icon: item.icon,
      menu_type: item.menu_type,
      target: item.target,
      parent_id: item.parent_id || '',
      order_index: item.order_index,
      is_active: item.is_active
    });
  };

  const parentItems = menuItems?.filter(item => !item.parent_id) || [];
  const headerItems = menuItems?.filter(item => item.menu_type === 'header') || [];
  const footerItems = menuItems?.filter(item => item.menu_type === 'footer') || [];

  if (isLoading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Menu Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Home, About, Services..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="href">Link URL</Label>
                <Input
                  id="href"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  placeholder="/about, https://example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="menu_type">Menu Type</Label>
                <Select value={formData.menu_type} onValueChange={(value) => setFormData({ ...formData, menu_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header Menu</SelectItem>
                    <SelectItem value="footer">Footer Menu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target">Link Target</Label>
                <Select value={formData.target} onValueChange={(value) => setFormData({ ...formData, target: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Window</SelectItem>
                    <SelectItem value="_blank">New Window</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parent_id">Parent Menu (Optional)</Label>
                <Select value={formData.parent_id} onValueChange={(value) => setFormData({ ...formData, parent_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent</SelectItem>
                    {parentItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                {editingItem ? 'Update' : 'Create'} Menu Item
              </Button>
              {editingItem && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Header Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {headerItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {item.target === '_blank' && <ExternalLink className="h-4 w-4" />}
                    {item.parent_id && <span className="text-sm text-gray-500">└ Child</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {headerItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">No header menu items</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {footerItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {item.target === '_blank' && <ExternalLink className="h-4 w-4" />}
                    {item.parent_id && <span className="text-sm text-gray-500">└ Child</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {footerItems.length === 0 && (
                <p className="text-center text-gray-500 py-4">No footer menu items</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenuManagement;
