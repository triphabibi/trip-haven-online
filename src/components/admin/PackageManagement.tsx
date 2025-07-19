
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
import { Package, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const PackageManagement = () => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    overview: '',
    location: '',
    days: 1,
    nights: 0,
    price_adult: 0,
    price_child: 0,
    price_infant: 0,
    highlights: [],
    whats_included: [],
    exclusions: [],
    languages: ['English'],
    available_times: [],
    featured_image: '',
    gallery_images: [],
    image_urls: [],
    video_url: '',
    itinerary: { days: [] },
    cancellation_policy: '',
    refund_policy: '',
    terms_conditions: '',
    meeting_point: '',
    map_location: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    instant_confirmation: true,
    free_cancellation: true,
    is_featured: false,
    status: 'active',
  });

  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: async (packageData: any) => {
      const { data, error } = await supabase
        .from('tour_packages')
        .insert([packageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_packages'] });
      toast({ title: "Success", description: "Package created successfully" });
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, ...packageData }: { id: string } & any) => {
      const { data, error } = await supabase
        .from('tour_packages')
        .update(packageData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_packages'] });
      toast({ title: "Success", description: "Package updated successfully" });
      setIsEditing(false);
      setSelectedPackage(null);
      resetForm();
      setActiveTab('list');
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tour_packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_packages'] });
      toast({ title: "Success", description: "Package deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      overview: '',
      location: '',
      days: 1,
      nights: 0,
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      highlights: [],
      whats_included: [],
      exclusions: [],
      languages: ['English'],
      available_times: [],
      featured_image: '',
      gallery_images: [],
      image_urls: [],
      video_url: '',
      itinerary: { days: [] },
      cancellation_policy: '',
      refund_policy: '',
      terms_conditions: '',
      meeting_point: '',
      map_location: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      instant_confirmation: true,
      free_cancellation: true,
      is_featured: false,
      status: 'active',
    });
    setIsEditing(false);
    setSelectedPackage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedPackage) {
      updatePackageMutation.mutate({ id: selectedPackage.id, ...formData });
    } else {
      createPackageMutation.mutate(formData);
    }
  };

  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setFormData({
      title: pkg.title || '',
      slug: pkg.slug || '',
      description: pkg.description || '',
      overview: pkg.overview || '',
      location: pkg.location || '',
      days: pkg.days || 1,
      nights: pkg.nights || 0,
      price_adult: pkg.price_adult || 0,
      price_child: pkg.price_child || 0,
      price_infant: pkg.price_infant || 0,
      highlights: pkg.highlights || [],
      whats_included: pkg.whats_included || [],
      exclusions: pkg.exclusions || [],
      languages: pkg.languages || ['English'],
      available_times: pkg.available_times || [],
      featured_image: pkg.featured_image || '',
      gallery_images: pkg.gallery_images || [],
      image_urls: pkg.image_urls || [],
      video_url: pkg.video_url || '',
      itinerary: pkg.itinerary || { days: [] },
      cancellation_policy: pkg.cancellation_policy || '',
      refund_policy: pkg.refund_policy || '',
      terms_conditions: pkg.terms_conditions || '',
      meeting_point: pkg.meeting_point || '',
      map_location: pkg.map_location || '',
      seo_title: pkg.seo_title || '',
      seo_description: pkg.seo_description || '',
      seo_keywords: pkg.seo_keywords || '',
      instant_confirmation: pkg.instant_confirmation !== false,
      free_cancellation: pkg.free_cancellation !== false,
      is_featured: pkg.is_featured || false,
      status: pkg.status || 'active',
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const addImageUrl = (field: 'gallery_images') => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), url]
      }));
    }
  };

  const removeImageUrl = (field: 'gallery_images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading packages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Packages ({packages?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Package' : 'Create New Package'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Tour Packages
              </CardTitle>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Package
              </Button>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages?.map((pkg) => (
                  <div key={pkg.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold truncate">{pkg.title}</h4>
                      <div className="flex items-center gap-2">
                        {pkg.is_featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          pkg.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pkg.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.days} Days / {pkg.nights} Nights</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(pkg.price_adult)}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deletePackageMutation.mutate(pkg.id)}
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
                <CardTitle>{isEditing ? 'Edit Package' : 'Create New Package'}</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Package Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="days">Days *</Label>
                      <Input
                        id="days"
                        type="number"
                        value={formData.days}
                        onChange={(e) => setFormData(prev => ({ ...prev, days: Number(e.target.value) }))}
                        required
                        min="1"
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nights">Nights *</Label>
                      <Input
                        id="nights"
                        type="number"
                        value={formData.nights}
                        onChange={(e) => setFormData(prev => ({ ...prev, nights: Number(e.target.value) }))}
                        required
                        min="0"
                        className="bg-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price_adult">Adult Price *</Label>
                      <Input
                        id="price_adult"
                        type="number"
                        value={formData.price_adult}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_adult: Number(e.target.value) }))}
                        required
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_child">Child Price</Label>
                      <Input
                        id="price_child"
                        type="number"
                        value={formData.price_child}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_child: Number(e.target.value) }))}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_infant">Infant Price</Label>
                      <Input
                        id="price_infant"
                        type="number"
                        value={formData.price_infant}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_infant: Number(e.target.value) }))}
                        className="bg-white"
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="video_url">YouTube Video URL</Label>
                    <Input
                      id="video_url"
                      value={formData.video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      className="bg-white"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_urls">Image URLs (one per line)</Label>
                    <Textarea
                      id="image_urls"
                      value={Array.isArray(formData.image_urls) ? formData.image_urls.join('\n') : ''}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                        setFormData(prev => ({ ...prev, image_urls: urls }));
                      }}
                      className="bg-white"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Enter up to 5 image URLs, one per line</p>
                  </div>

                  <div>
                    <Label htmlFor="featured_image">Featured Image URL</Label>
                    <Input
                      id="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                      className="bg-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label>Gallery Images</Label>
                    <div className="space-y-2">
                      {formData.gallery_images.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <Input value={url} readOnly className="bg-gray-50" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageUrl('gallery_images', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addImageUrl('gallery_images')}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Add Gallery Image URL
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="highlights">Highlights (one per line)</Label>
                    <Textarea
                      id="highlights"
                      value={formData.highlights.join('\n')}
                      onChange={(e) => handleArrayFieldChange('highlights', e.target.value)}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whats_included">What's Included (one per line)</Label>
                    <Textarea
                      id="whats_included"
                      value={formData.whats_included.join('\n')}
                      onChange={(e) => handleArrayFieldChange('whats_included', e.target.value)}
                      className="bg-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label htmlFor="is_featured">Featured Package</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                      />
                      <Label htmlFor="is_active">Published (Active)</Label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <Button type="submit" disabled={createPackageMutation.isPending || updatePackageMutation.isPending}>
                      {createPackageMutation.isPending || updatePackageMutation.isPending ? 'Saving...' : (isEditing ? 'Update Package' : 'Create Package')}
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

export default PackageManagement;
