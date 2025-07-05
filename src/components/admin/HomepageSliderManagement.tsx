
import { useState } from 'react';
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
import { Image, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const HomepageSliderManagement = () => {
  const [selectedSlider, setSelectedSlider] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    button_text: 'Learn More',
    is_active: true,
    display_order: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sliders, isLoading } = useQuery({
    queryKey: ['homepage_sliders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createSliderMutation = useMutation({
    mutationFn: async (sliderData: any) => {
      const { data, error } = await supabase
        .from('homepage_sliders')
        .insert([sliderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage_sliders'] });
      toast({ title: "Success", description: "Slider created successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateSliderMutation = useMutation({
    mutationFn: async ({ id, ...sliderData }: { id: string } & any) => {
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
      toast({ title: "Success", description: "Slider updated successfully" });
      setIsEditing(false);
      setSelectedSlider(null);
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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
      toast({ title: "Success", description: "Slider deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      button_text: 'Learn More',
      is_active: true,
      display_order: 0,
    });
    setIsEditing(false);
    setSelectedSlider(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedSlider) {
      updateSliderMutation.mutate({ id: selectedSlider.id, ...formData });
    } else {
      createSliderMutation.mutate(formData);
    }
  };

  const handleEdit = (slider: any) => {
    setSelectedSlider(slider);
    setFormData({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      image_url: slider.image_url || '',
      link_url: slider.link_url || '',
      button_text: slider.button_text || 'Learn More',
      is_active: slider.is_active !== false,
      display_order: slider.display_order || 0,
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading sliders...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Homepage Sliders ({sliders?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Slider' : 'Create New Slider'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Homepage Sliders
              </CardTitle>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Slider
              </Button>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-4">
                {sliders?.map((slider) => (
                  <div key={slider.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <img src={slider.image_url} alt={slider.title} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <h4 className="font-semibold">{slider.title}</h4>
                          <p className="text-sm text-gray-600">{slider.subtitle}</p>
                          <p className="text-xs text-gray-500">Order: {slider.display_order}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          slider.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slider.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(slider)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteSliderMutation.mutate(slider.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="form">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Slider' : 'Create New Slider'}</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url">Image URL *</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      required
                      className="bg-white"
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
                        className="bg-white"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="button_text">Button Text</Label>
                      <Input
                        id="button_text"
                        value={formData.button_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                        className="bg-white"
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

                  <div className="flex gap-4 pt-6 border-t">
                    <Button type="submit" disabled={createSliderMutation.isPending || updateSliderMutation.isPending}>
                      {createSliderMutation.isPending || updateSliderMutation.isPending ? 'Saving...' : (isEditing ? 'Update Slider' : 'Create Slider')}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default HomepageSliderManagement;
