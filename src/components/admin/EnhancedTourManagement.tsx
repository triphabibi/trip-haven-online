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
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Users, DollarSign, Upload, X } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface TourForm {
  title: string;
  slug: string;
  description: string;
  overview: string;
  location: string;
  duration: string;
  price_adult: number;
  price_child: number;
  price_infant: number;
  category: string;
  highlights: string[];
  whats_included: string[];
  exclusions: string[];
  languages: string[];
  available_times: string[];
  itinerary: any;
  cancellation_policy: string;
  refund_policy: string;
  terms_conditions: string;
  meeting_point: string;
  map_location: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  is_featured: boolean;
  status: 'active' | 'inactive';
  image_urls: string[];
  featured_image: string;
  gallery_images: string[];
  instant_confirmation: boolean;
  free_cancellation: boolean;
  rating: number;
  total_reviews: number;
  youtube_video_url: string;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const EnhancedTourManagement = () => {
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState<TourForm>({
    title: '',
    slug: '',
    description: '',
    overview: '',
    location: '',
    duration: '',
    price_adult: 0,
    price_child: 0,
    price_infant: 0,
    category: 'tour',
    highlights: [],
    whats_included: [],
    exclusions: [],
    languages: ['English'],
    available_times: [],
    itinerary: {
      days: [
        {
          day: 1,
          title: 'Day 1 - Arrival',
          description: 'Arrival and check-in',
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
        }
      ]
    },
    cancellation_policy: 'Free cancellation up to 24 hours before the experience starts (local time)',
    refund_policy: 'Full refund for cancellations made 24+ hours in advance',
    terms_conditions: 'Standard terms and conditions apply',
    meeting_point: '',
    map_location: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_featured: false,
    status: 'active',
    image_urls: [],
    featured_image: '',
    gallery_images: [],
    instant_confirmation: true,
    free_cancellation: true,
    rating: 0,
    total_reviews: 0,
    youtube_video_url: ''
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

  const handleTitleChange = (title: string) => {
    const newSlug = generateSlug(title);
    setFormData(prev => ({ 
      ...prev, 
      title, 
      slug: newSlug,
      seo_title: prev.seo_title || title,
      seo_description: prev.seo_description || `Experience ${title} - Book now for the best rates`
    }));
  };

  const createTourMutation = useMutation({
    mutationFn: async (tourData: Omit<TourForm, 'rating' | 'total_reviews'>) => {
      // Ensure slug is generated
      if (!tourData.slug && tourData.title) {
        tourData.slug = generateSlug(tourData.title);
      }

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
        description: "Tour created successfully with auto-generated slug",
      });
      resetForm();
      setActiveTab('list');
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
    mutationFn: async ({ id, ...tourData }: { id: string } & Omit<TourForm, 'rating' | 'total_reviews'>) => {
      // Ensure slug is generated
      if (!tourData.slug && tourData.title) {
        tourData.slug = generateSlug(tourData.title);
      }

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
      resetForm();
      setActiveTab('list');
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
      location: '',
      duration: '',
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      category: 'tour',
      highlights: [],
      whats_included: [],
      exclusions: [],
      languages: ['English'],
      available_times: [],
      itinerary: {
        days: [
          {
            day: 1,
            title: 'Day 1 - Arrival',
            description: 'Arrival and check-in',
            activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
          }
        ]
      },
      cancellation_policy: 'Free cancellation up to 24 hours before the experience starts (local time)',
      refund_policy: 'Full refund for cancellations made 24+ hours in advance',
      terms_conditions: 'Standard terms and conditions apply',
      meeting_point: '',
      map_location: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      is_featured: false,
      status: 'active',
      image_urls: [],
      featured_image: '',
      gallery_images: [],
      instant_confirmation: true,
      free_cancellation: true,
      rating: 0,
      total_reviews: 0,
      youtube_video_url: ''
    });
    setIsEditing(false);
    setSelectedTour(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { rating, total_reviews, ...submitData } = formData;
    
    if (isEditing && selectedTour) {
      updateTourMutation.mutate({ id: selectedTour.id, ...submitData });
    } else {
      createTourMutation.mutate(submitData);
    }
  };

  const handleEdit = (tour: any) => {
    setSelectedTour(tour);
    setFormData({
      title: tour.title || '',
      slug: tour.slug || '',
      description: tour.description || '',
      overview: tour.overview || '',
      location: tour.location || '',
      duration: tour.duration || '',
      price_adult: tour.price_adult || 0,
      price_child: tour.price_child || 0,
      price_infant: tour.price_infant || 0,
      category: tour.category || 'tour',
      highlights: tour.highlights || [],
      whats_included: tour.whats_included || [],
      exclusions: tour.exclusions || [],
      languages: tour.languages || ['English'],
      available_times: tour.available_times || [],
      itinerary: tour.itinerary || {
        days: [
          {
            day: 1,
            title: 'Day 1 - Arrival',
            description: 'Arrival and check-in',
            activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner']
          }
        ]
      },
      cancellation_policy: tour.cancellation_policy || 'Free cancellation up to 24 hours before the experience starts (local time)',
      refund_policy: tour.refund_policy || 'Full refund for cancellations made 24+ hours in advance',
      terms_conditions: tour.terms_conditions || 'Standard terms and conditions apply',
      meeting_point: tour.meeting_point || '',
      map_location: tour.map_location || '',
      seo_title: tour.seo_title || '',
      seo_description: tour.seo_description || '',
      seo_keywords: tour.seo_keywords || '',
      is_featured: tour.is_featured || false,
      status: tour.status || 'active',
      image_urls: tour.image_urls || [],
      featured_image: tour.featured_image || '',
      gallery_images: tour.gallery_images || [],
      instant_confirmation: tour.instant_confirmation !== false,
      free_cancellation: tour.free_cancellation !== false,
      rating: tour.rating || 0,
      total_reviews: tour.total_reviews || 0,
      youtube_video_url: tour.youtube_video_url || ''
    });
    setIsEditing(true);
    setActiveTab('form');
  };

  const handleArrayFieldChange = (field: keyof TourForm, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleNewTour = () => {
    resetForm();
    setActiveTab('form');
  };

  const addImageUrl = (field: 'image_urls' | 'gallery_images') => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), url]
      }));
    }
  };

  const removeImageUrl = (field: 'image_urls' | 'gallery_images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addItineraryDay = () => {
    const currentDays = formData.itinerary?.days || [];
    const newDay = {
      day: currentDays.length + 1,
      title: `Day ${currentDays.length + 1}`,
      description: '',
      activities: []
    };
    setFormData(prev => ({
      ...prev,
      itinerary: {
        ...prev.itinerary,
        days: [...currentDays, newDay]
      }
    }));
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const currentDays = [...(formData.itinerary?.days || [])];
    currentDays[index] = { ...currentDays[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      itinerary: { ...prev.itinerary, days: currentDays }
    }));
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Tour List ({tours?.length || 0})</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? 'Edit Tour' : 'Create New Tour'}</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Tours Management
              </CardTitle>
              <Button onClick={handleNewTour} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tour
              </Button>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours?.map((tour) => (
                  <div key={tour.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold truncate text-lg">{tour.title}</h4>
                      <div className="flex items-center gap-2">
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
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.location || 'No location set'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{tour.duration || 'Duration not set'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold text-blue-600">{formatPrice(tour.price_adult)}</span>
                      </div>
                    </div>

                    {tour.slug && (
                      <p className="text-xs text-gray-500 mb-3">Slug: /{tour.slug}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tour)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteTourMutation.mutate(tour.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {tours?.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Users className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600">No Tours Yet</h3>
                      <p className="text-gray-500">Create your first tour to get started</p>
                    </div>
                    <Button onClick={handleNewTour} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Tour
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="form">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {isEditing ? 'Edit Tour' : 'Create New Tour'}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Tour Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          required
                          className="bg-white"
                          placeholder="Enter tour title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">SEO Slug (Auto-generated)</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="auto-generated from title"
                          className="bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL: /tours/{formData.slug}</p>
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
                          placeholder="e.g., Paris, France"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g., 4 hours, Full Day"
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
                        placeholder="Brief description of the tour"
                      />
                    </div>

                    <div>
                      <Label htmlFor="overview">Detailed Overview</Label>
                      <Textarea
                        id="overview"
                        value={formData.overview}
                        onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                        className="bg-white"
                        rows={5}
                        placeholder="Detailed overview of what the tour includes"
                      />
                    </div>
                  </div>

                  {/* Images & Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images & Media</h3>
                    
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
                      <Label htmlFor="youtube_video_url">YouTube Video URL (Optional)</Label>
                      <Input
                        id="youtube_video_url"
                        value={formData.youtube_video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, youtube_video_url: e.target.value }))}
                        className="bg-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Detailed Itinerary</h3>
                    
                    {formData.itinerary?.days?.map((day: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label>Day {day.day} Title</Label>
                            <Input
                              value={day.title}
                              onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                              className="bg-white"
                              placeholder={`Day ${day.day} title`}
                            />
                          </div>
                          <div>
                            <Label>Day {day.day} Description</Label>
                            <Input
                              value={day.description}
                              onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                              className="bg-white"
                              placeholder="Brief description"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Activities (one per line)</Label>
                          <Textarea
                            value={day.activities?.join('\n') || ''}
                            onChange={(e) => updateItineraryDay(index, 'activities', e.target.value.split('\n').filter(a => a.trim()))}
                            className="bg-white"
                            rows={3}
                            placeholder="Activity 1&#10;Activity 2&#10;Activity 3"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button type="button" variant="outline" onClick={addItineraryDay} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Day
                    </Button>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
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
                          min="0"
                          step="0.01"
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
                          min="0"
                          step="0.01"
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
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Tour Content</h3>
                    
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
                      <Label htmlFor="whats_included">What's Included (one per line)</Label>
                      <Textarea
                        id="whats_included"
                        value={formData.whats_included.join('\n')}
                        onChange={(e) => handleArrayFieldChange('whats_included', e.target.value)}
                        className="bg-white"
                        rows={4}
                        placeholder="Hotel pickup and drop-off&#10;Professional guide&#10;Entry tickets"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exclusions">What's Not Included (one per line)</Label>
                      <Textarea
                        id="exclusions"
                        value={formData.exclusions.join('\n')}
                        onChange={(e) => handleArrayFieldChange('exclusions', e.target.value)}
                        className="bg-white"
                        rows={3}
                        placeholder="Meals&#10;Personal expenses&#10;Tips"
                      />
                    </div>

                    <div>
                      <Label htmlFor="available_times">Available Times (one per line)</Label>
                      <Textarea
                        id="available_times"
                        value={formData.available_times.join('\n')}
                        onChange={(e) => handleArrayFieldChange('available_times', e.target.value)}
                        className="bg-white"
                        rows={3}
                        placeholder="9:00 AM&#10;2:00 PM&#10;6:00 PM"
                      />
                    </div>
                  </div>

                  {/* Policies */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Policies & Terms</h3>
                    
                    <div>
                      <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                      <Textarea
                        id="cancellation_policy"
                        value={formData.cancellation_policy}
                        onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                        className="bg-white"
                        rows={3}
                        placeholder="Describe the cancellation policy"
                      />
                    </div>

                    <div>
                      <Label htmlFor="refund_policy">Refund Policy</Label>
                      <Textarea
                        id="refund_policy"
                        value={formData.refund_policy}
                        onChange={(e) => setFormData(prev => ({ ...prev, refund_policy: e.target.value }))}
                        className="bg-white"
                        rows={3}
                        placeholder="Describe the refund policy"
                      />
                    </div>
                  </div>

                  {/* SEO Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO Settings</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                          className="bg-white"
                          placeholder="SEO optimized title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="bg-white"
                          placeholder="tour, adventure, cultural"
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
                        placeholder="SEO meta description (150-160 characters)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seo_keywords">SEO Keywords</Label>
                      <Input
                        id="seo_keywords"
                        value={formData.seo_keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                        className="bg-white"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>

                  {/* Settings & Status */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Settings</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
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
                        <Label htmlFor="is_active">Published (Active)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="instant_confirmation"
                          checked={formData.instant_confirmation}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, instant_confirmation: checked }))}
                        />
                        <Label htmlFor="instant_confirmation">Instant Confirmation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="free_cancellation"
                          checked={formData.free_cancellation}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, free_cancellation: checked }))}
                        />
                        <Label htmlFor="free_cancellation">Free Cancellation</Label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button 
                      type="submit" 
                      disabled={createTourMutation.isPending || updateTourMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createTourMutation.isPending || updateTourMutation.isPending ? 'Saving...' : (isEditing ? 'Update Tour' : 'Create Tour')}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Clear Form
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

export default EnhancedTourManagement;
