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
import { Plus, Edit, Trash2, FileText, DollarSign } from 'lucide-react';

const EnhancedVisaManagement = () => {
  const [selectedVisa, setSelectedVisa] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    country: '',
    visa_type: '',
    price: 0,
    child_price: 0,
    processing_time: '',
    description: '',
    overview: '',
    highlights: [] as string[],
    whats_included: [] as string[],
    exclusions: [] as string[],
    requirements: [] as string[],
    cancellation_policy: '',
    refund_policy: '',
    terms_conditions: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    slug: '',
    featured_image: '',
    gallery_images: [] as string[],
    is_featured: false,
    status: 'active' as 'active' | 'inactive'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: visas, isLoading } = useQuery({
    queryKey: ['admin_visas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const generateSlug = (country: string, visaType: string): string => {
    return `${country}-${visaType}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const createVisaMutation = useMutation({
    mutationFn: async (visaData: typeof formData) => {
      if (!visaData.slug) {
        visaData.slug = generateSlug(visaData.country, visaData.visa_type);
      }

      const { data, error } = await supabase
        .from('visa_services')
        .insert([visaData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visas'] });
      toast({ title: "Success", description: "Visa service created successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateVisaMutation = useMutation({
    mutationFn: async ({ id, ...visaData }: { id: string } & typeof formData) => {
      if (!visaData.slug) {
        visaData.slug = generateSlug(visaData.country, visaData.visa_type);
      }

      const { data, error } = await supabase
        .from('visa_services')
        .update(visaData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visas'] });
      toast({ title: "Success", description: "Visa service updated successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteVisaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('visa_services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_visas'] });
      toast({ title: "Success", description: "Visa service deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      country: '', visa_type: '', price: 0, child_price: 0, processing_time: '', description: '', overview: '',
      highlights: [], whats_included: [], exclusions: [], requirements: [],
      cancellation_policy: '', refund_policy: '', terms_conditions: '',
      seo_title: '', seo_description: '', seo_keywords: '', slug: '',
      featured_image: '', gallery_images: [], is_featured: false, status: 'active'
    });
    setIsEditing(false);
    setSelectedVisa(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedVisa) {
      updateVisaMutation.mutate({ id: selectedVisa.id, ...formData });
    } else {
      createVisaMutation.mutate(formData);
    }
  };

  const handleEdit = (visa: any) => {
    setSelectedVisa(visa);
    setFormData({
      country: visa.country || '',
      visa_type: visa.visa_type || '',
      price: visa.price || 0,
      child_price: visa.child_price || 0,
      processing_time: visa.processing_time || '',
      description: visa.description || '',
      overview: visa.overview || '',
      highlights: visa.highlights || [],
      whats_included: visa.whats_included || [],
      exclusions: visa.exclusions || [],
      requirements: visa.requirements || [],
      cancellation_policy: visa.cancellation_policy || '',
      refund_policy: visa.refund_policy || '',
      terms_conditions: visa.terms_conditions || '',
      seo_title: visa.seo_title || '',
      seo_description: visa.seo_description || '',
      seo_keywords: visa.seo_keywords || '',
      slug: visa.slug || '',
      featured_image: visa.featured_image || '',
      gallery_images: visa.gallery_images || [],
      is_featured: visa.is_featured || false,
      status: visa.status || 'active'
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleArrayFieldChange = (field: keyof typeof formData, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading visa services...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Visa Services ({visas?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Visa Service' : 'Create New Visa Service'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Visa Services Management
              </CardTitle>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Visa Service
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visas?.map((visa) => (
                  <div key={visa.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{visa.country} - {visa.visa_type}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${visa.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {visa.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold text-blue-600">₹{visa.price?.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">Processing: {visa.processing_time}</p>
                      {visa.slug && <p className="text-xs text-gray-500">Slug: /{visa.slug}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(visa)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteVisaMutation.mutate(visa.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Visa Service' : 'Create New Visa Service'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        required
                        placeholder="e.g., UAE, USA, UK"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visa_type">Visa Type *</Label>
                      <Input
                        id="visa_type"
                        value={formData.visa_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, visa_type: e.target.value }))}
                        required
                        placeholder="e.g., Tourist, Business, Transit"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Adult Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Adult visa price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="child_price">Child Price (optional)</Label>
                      <Input
                        id="child_price"
                        type="number"
                        value={formData.child_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, child_price: Number(e.target.value) }))}
                        min="0"
                        step="0.01"
                        placeholder="Child visa price (defaults to adult price)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="processing_time">Processing Time</Label>
                      <Input
                        id="processing_time"
                        value={formData.processing_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, processing_time: e.target.value }))}
                        placeholder="e.g., 3-5 working days"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Highlights (one per line)</Label>
                      <Textarea
                        value={formData.highlights.join('\n')}
                        onChange={(e) => handleArrayFieldChange('highlights', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Requirements (one per line)</Label>
                      <Textarea
                        value={formData.requirements.join('\n')}
                        onChange={(e) => handleArrayFieldChange('requirements', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>What's Included (one per line)</Label>
                      <Textarea
                        value={formData.whats_included.join('\n')}
                        onChange={(e) => handleArrayFieldChange('whats_included', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>What's Not Included (one per line)</Label>
                      <Textarea
                        value={formData.exclusions.join('\n')}
                        onChange={(e) => handleArrayFieldChange('exclusions', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                      <Textarea
                        id="cancellation_policy"
                        value={formData.cancellation_policy}
                        onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="refund_policy">Refund Policy</Label>
                      <Textarea
                        id="refund_policy"
                        value={formData.refund_policy}
                        onChange={(e) => setFormData(prev => ({ ...prev, refund_policy: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                      <Textarea
                        id="terms_conditions"
                        value={formData.terms_conditions}
                        onChange={(e) => setFormData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO Settings</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          placeholder="SEO optimized title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="auto-generated from country and visa type"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="seo_description">SEO Meta Description</Label>
                      <Textarea
                        id="seo_description"
                        value={formData.seo_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        rows={2}
                        placeholder="SEO meta description (150-160 characters)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seo_keywords">SEO Keywords</Label>
                      <Input
                        id="seo_keywords"
                        value={formData.seo_keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>
                    
                    <div>
                      <Label htmlFor="featured_image">Featured Image URL</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <Label>Gallery Images (one URL per line)</Label>
                      <Textarea
                        value={formData.gallery_images.join('\n')}
                        onChange={(e) => handleArrayFieldChange('gallery_images', e.target.value)}
                        rows={3}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label>Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={createVisaMutation.isPending || updateVisaMutation.isPending}>
                      {createVisaMutation.isPending || updateVisaMutation.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
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

export default EnhancedVisaManagement;
