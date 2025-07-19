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
import { Globe, Plus, Edit, Trash2 } from 'lucide-react';

const VisaCategoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_emoji: '🌍',
    display_order: 0,
    is_active: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin_visa_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('visa_categories')
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visa_categories'] });
      toast({ title: "Success", description: "Category created successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: { id: string } & any) => {
      const { data, error } = await supabase
        .from('visa_categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visa_categories'] });
      toast({ title: "Success", description: "Category updated successfully" });
      setIsEditing(false);
      setSelectedCategory(null);
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('visa_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visa_categories'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon_emoji: '🌍',
      display_order: 0,
      is_active: true,
    });
    setIsEditing(false);
    setSelectedCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, ...formData });
    } else {
      createCategoryMutation.mutate(formData);
    }
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      icon_emoji: category.icon_emoji || '🌍',
      display_order: category.display_order || 0,
      is_active: category.is_active !== false,
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Categories ({categories?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Category' : 'Create New Category'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Visa Categories
              </CardTitle>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories?.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon_emoji}</span>
                        <h4 className="font-semibold truncate">{category.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          category.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <p className="text-xs text-gray-500 mb-3">Slug: {category.slug}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
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
                <CardTitle>{isEditing ? 'Edit Category' : 'Create New Category'}</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                        className="bg-white"
                        placeholder="e.g., Asia, Europe, Middle East"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                        className="bg-white"
                        placeholder="auto-generated from name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon_emoji">Icon Emoji</Label>
                      <Input
                        id="icon_emoji"
                        value={formData.icon_emoji}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon_emoji: e.target.value }))}
                        className="bg-white"
                        placeholder="🌍"
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
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white"
                      rows={3}
                      placeholder="Brief description of this visa category"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Category is active</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                    >
                      {isEditing ? 'Update Category' : 'Create Category'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
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

export default VisaCategoryManagement;