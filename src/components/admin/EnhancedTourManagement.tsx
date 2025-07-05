
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
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface TourForm {
  title: string;
  slug: string;
  description: string;
  overview: string;
  duration: string;
  location: string;
  price_adult: number;
  price_child: number;
  price_infant: number;
  category: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  languages: string[];
  available_times: string[];
  seo_title: string;
  seo_description: string;
  is_featured: boolean;
  status: 'active' | 'inactive';
  image_urls: string[];
  featured_image: string;
}

const EnhancedTourManagement = () => {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TourForm>({
    title: '',
    slug: '',
    description: '',
    overview: '',
    duration: '',
    location: '',
    price_adult: 0,
    price_child: 0,
    price_infant: 0,
    category: 'tour',
    highlights: [],
    inclusions: [],
    exclusions: [],
    languages: ['English'],
    available_times: [],
    seo_title: '',
    seo_description: '',
    is_featured: false,
    status: 'active',
    image_urls: [],
    featured_image: ''
  });

  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['admin_tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createTourMutation = useMutation({
    mutationFn: async (tourData: Partial<TourForm>) => {
      const { data, error } = await supabase
        .from('tours')
        .insert([tourData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tours'] });
      toast({
        title: "Success",
        description: "Tour created successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTourMutation = useMutation({
    mutationFn: async ({ id, ...tourData }: { id: string } & Partial<TourForm>) => {
      const { data, error } = await supabase
        .from('tours')
        .update(tourData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tours'] });
      toast({
        title: "Success",
        description: "Tour updated successfully",
      });
      setIsEditing(false);
      setSelectedTour(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTourMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tours'] });
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      overview: '',
      duration: '',
      location: '',
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      category: 'tour',
      highlights: [],
      inclusions: [],
      exclusions: [],
      languages: ['English'],
      available_times: [],
      seo_title: '',
      seo_description: '',
      is_featured: false,
      status: 'active',
      image_urls: [],
      featured_image: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedTour) {
      updateTourMutation.mutate({ id: selectedTour.id, ...formData });
    } else {
      createTourMutation.mutate(formData);
    }
  };

  const handleEdit = (tour: any) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.title || '',
      slug: tour.slug || '',
      description: tour.description || '',
      overview: tour.overview || '',
      duration: tour.duration || '',
      location: tour.location || '',
      price_adult: tour.price_adult || 0,
      price_child: tour.price_child || 0,
      price_infant: tour.price_infant || 0,
      category: tour.category || 'tour',
      highlights: tour.highlights || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      languages: tour.languages || ['English'],
      available_times: tour.available_times || [],
      seo_title: tour.seo_title || '',
      seo_description: tour.seo_description || '',
      is_featured: tour.is_featured || false,
      status: tour.status || 'active',
      image_urls: tour.image_urls || [],
      featured_image: tour.featured_image || ''
    });
    setIsEditing(true);
  };

  const handleArrayFieldChange = (field: keyof TourForm, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">Loading tours...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Tour List</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Tour' : 'Create Tour'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Tours ({tours?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tours?.map((tour) => (
                  <div key={tour.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold truncate">{tour.title}</h4>
                      <div className="flex items-center gap-1">
                        {tour.is_featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          tour.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tour.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tour.location}</p>
                    <p className="text-sm text-gray-600 mb-2">Duration: {tour.duration}</p>
                    <p className="text-lg font-bold text-blue-600 mb-3">{formatPrice(tour.price_adult)}</p>
                    {tour.slug && (
                      <p className="text-xs text-gray-500 mb-3">Slug: /{tour.slug}</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteTourMutation.mutate(tour.id)}
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
                <CardTitle>{isEditing ? 'Edit Tour' : 'Create New Tour'}</CardTitle>
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
                      <Label htmlFor="slug">SEO Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="auto-generated from title"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 4 hours"
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
                    <Label htmlFor="highlights">Highlights (one per line)</Label>
                    <Textarea
                      id="highlights"
                      value={formData.highlights.join('\n')}
                      onChange={(e) => handleArrayFieldChange('highlights', e.target.value)}
                      className="bg-white"
                      rows={4}
                      placeholder="Visit iconic landmarks&#10;Professional guide&#10;Small group experience"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inclusions">Inclusions (one per line)</Label>
                    <Textarea
                      id="inclusions"
                      value={formData.inclusions.join('\n')}
                      onChange={(e) => handleArrayFieldChange('inclusions', e.target.value)}
                      className="bg-white"
                      rows={4}
                      placeholder="Hotel pickup and drop-off&#10;Professional guide&#10;Entry tickets"
                    />
                  </div>

                  <div>
                    <Label htmlFor="exclusions">Exclusions (one per line)</Label>
                    <Textarea
                      id="exclusions"
                      value={formData.exclusions.join('\n')}
                      onChange={(e) => handleArrayFieldChange('exclusions', e.target.value)}
                      className="bg-white"
                      rows={3}
                      placeholder="Meals&#10;Personal expenses&#10;Tips"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input
                        id="seo_title"
                        value={formData.seo_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seo_description">SEO Meta Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                      className="bg-white"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label htmlFor="is_featured">Featured Tour</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))}
                      />
                      <Label htmlFor="is_active">Active/Published</Label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={createTourMutation.isPending || updateTourMutation.isPending}>
                      {createTourMutation.isPending || updateTourMutation.isPending ? 'Saving...' : (isEditing ? 'Update Tour' : 'Create Tour')}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={() => {
                        setIsEditing(false);
                        setSelectedTour(null);
                        resetForm();
                      }}>
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

export default EnhancedTourManagement;
