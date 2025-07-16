
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { HomepageSlider } from '@/types/tourism';

const HomepageSliderManagement = () => {
  const [editingSlider, setEditingSlider] = useState<HomepageSlider | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    button_text: 'Learn More',
    display_order: 0,
    is_active: true,
    cta_button_color: '#3B82F6',
    background_overlay_opacity: 0.5
  });

  const { data: sliders, isLoading } = useQuery({
    queryKey: ['homepage_sliders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as HomepageSlider[];
    }
  });

  const createSliderMutation = useMutation({
    mutationFn: async (sliderData: {
      title: string;
      subtitle?: string;
      image_url: string;
      link_url?: string;
      button_text: string;
      display_order: number;
      is_active: boolean;
      cta_button_color: string;
      background_overlay_opacity: number;
    }) => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .insert(sliderData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_sliders'] });
      toast({ title: 'Success', description: 'Slider created successfully' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create slider', variant: 'destructive' });
    }
  });

  const updateSliderMutation = useMutation({
    mutationFn: async ({ id, ...sliderData }: { id: string } & {
      title: string;
      subtitle?: string;
      image_url: string;
      link_url?: string;
      button_text: string;
      display_order: number;
      is_active: boolean;
      cta_button_color: string;
      background_overlay_opacity: number;
    }) => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .update(sliderData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_sliders'] });
      toast({ title: 'Success', description: 'Slider updated successfully' });
      setEditingSlider(null);
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update slider', variant: 'destructive' });
    }
  });

  const deleteSliderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('homepage_sliders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_sliders'] });
      toast({ title: 'Success', description: 'Slider deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete slider', variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      button_text: 'Learn More',
      display_order: 0,
      is_active: true,
      cta_button_color: '#3B82F6',
      background_overlay_opacity: 0.5
    });
    setIsCreating(false);
    setEditingSlider(null);
  };

  const handleEdit = (slider: HomepageSlider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      image_url: slider.image_url,
      link_url: slider.link_url || '',
      button_text: slider.button_text,
      display_order: slider.display_order,
      is_active: slider.is_active,
      cta_button_color: slider.cta_button_color,
      background_overlay_opacity: slider.background_overlay_opacity
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image_url) {
      toast({ title: 'Error', description: 'Title and image URL are required', variant: 'destructive' });
      return;
    }

    const submitData = {
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      image_url: formData.image_url,
      link_url: formData.link_url || undefined,
      button_text: formData.button_text,
      display_order: formData.display_order,
      is_active: formData.is_active,
      cta_button_color: formData.cta_button_color,
      background_overlay_opacity: formData.background_overlay_opacity
    };

    if (editingSlider) {
      updateSliderMutation.mutate({ id: editingSlider.id, ...submitData });
    } else {
      createSliderMutation.mutate(submitData);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading sliders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Homepage Sliders</h2>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slider
        </Button>
      </div>

      {(isCreating || editingSlider) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSlider ? 'Edit Slider' : 'Create New Slider'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Slider title"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Slider subtitle"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="Learn More"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="cta_button_color">Button Color</Label>
                <Input
                  id="cta_button_color"
                  type="color"
                  value={formData.cta_button_color}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_button_color: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="background_overlay_opacity">Overlay Opacity</Label>
                <Input
                  id="background_overlay_opacity"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.background_overlay_opacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, background_overlay_opacity: parseFloat(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {editingSlider ? 'Update' : 'Create'} Slider
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sliders?.map((slider) => (
          <Card key={slider.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {slider.image_url ? (
                    <img 
                      src={slider.image_url} 
                      alt={slider.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">No Image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{slider.title}</h3>
                    <p className="text-sm text-gray-600">{slider.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {slider.display_order}</span>
                      <span className={`text-xs px-2 py-1 rounded ${slider.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {slider.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slider)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSliderMutation.mutate(slider.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomepageSliderManagement;
