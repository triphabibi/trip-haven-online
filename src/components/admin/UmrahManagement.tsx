import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Calendar, 
  MapPin, 
  Users, 
  Package,
  Save,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUmrahPackages, UmrahPackage } from '@/hooks/useUmrahPackages';

export const UmrahManagement = () => {
  const { packages, loading, refetch } = useUmrahPackages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<UmrahPackage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    duration_days: '',
    duration_nights: '',
    departure_city: '',
    hotel_category: '',
    transportation_type: '',
    group_size_min: '',
    group_size_max: '',
    includes: '',
    excludes: '',
    location: '',
    pickup_points: '',
    special_notes: '',
    cancellation_policy: '',
    terms_conditions: '',
    featured_image: '',
    video_url: '',
    is_featured: false,
    is_active: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        duration_days: parseInt(formData.duration_days),
        duration_nights: parseInt(formData.duration_nights),
        group_size_min: formData.group_size_min ? parseInt(formData.group_size_min) : 1,
        group_size_max: formData.group_size_max ? parseInt(formData.group_size_max) : 50,
        includes: formData.includes ? formData.includes.split('\n').filter(item => item.trim()) : [],
        excludes: formData.excludes ? formData.excludes.split('\n').filter(item => item.trim()) : [],
        pickup_points: formData.pickup_points ? formData.pickup_points.split('\n').filter(item => item.trim()) : [],
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      };

      if (editingPackage) {
        const { error } = await supabase
          .from('umrah_packages')
          .update(packageData)
          .eq('id', editingPackage.id);
        
        if (error) throw error;
        toast.success('Package updated successfully');
      } else {
        const { error } = await supabase
          .from('umrah_packages')
          .insert([packageData]);
        
        if (error) throw error;
        toast.success('Package created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package: ' + error.message);
    }
  };

  const handleEdit = (pkg: UmrahPackage) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description || '',
      short_description: pkg.short_description || '',
      price: pkg.price.toString(),
      discount_price: pkg.discount_price?.toString() || '',
      duration_days: pkg.duration_days.toString(),
      duration_nights: pkg.duration_nights.toString(),
      departure_city: pkg.departure_city || '',
      hotel_category: pkg.hotel_category || '',
      transportation_type: pkg.transportation_type || '',
      group_size_min: pkg.group_size_min?.toString() || '',
      group_size_max: pkg.group_size_max?.toString() || '',
      includes: pkg.includes?.join('\n') || '',
      excludes: pkg.excludes?.join('\n') || '',
      location: pkg.location || '',
      pickup_points: pkg.pickup_points?.join('\n') || '',
      special_notes: pkg.special_notes || '',
      cancellation_policy: pkg.cancellation_policy || '',
      terms_conditions: pkg.terms_conditions || '',
      featured_image: pkg.featured_image || '',
      video_url: pkg.video_url || '',
      is_featured: pkg.is_featured || false,
      is_active: pkg.is_active !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const { error } = await supabase
        .from('umrah_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Package deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      title: '',
      description: '',
      short_description: '',
      price: '',
      discount_price: '',
      duration_days: '',
      duration_nights: '',
      departure_city: '',
      hotel_category: '',
      transportation_type: '',
      group_size_min: '',
      group_size_max: '',
      includes: '',
      excludes: '',
      location: '',
      pickup_points: '',
      special_notes: '',
      cancellation_policy: '',
      terms_conditions: '',
      featured_image: '',
      video_url: '',
      is_featured: false,
      is_active: true,
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Umrah Packages Management</h1>
          <p className="text-gray-600">Manage your spiritual journey packages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Package Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departure_city">Departure City</Label>
                      <Input
                        id="departure_city"
                        value={formData.departure_city}
                        onChange={(e) => handleInputChange('departure_city', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => handleInputChange('short_description', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_price">Discount Price</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        value={formData.discount_price}
                        onChange={(e) => handleInputChange('discount_price', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_days">Days *</Label>
                      <Input
                        id="duration_days"
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => handleInputChange('duration_days', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_nights">Nights *</Label>
                      <Input
                        id="duration_nights"
                        type="number"
                        value={formData.duration_nights}
                        onChange={(e) => handleInputChange('duration_nights', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotel_category">Hotel Category</Label>
                      <Select value={formData.hotel_category} onValueChange={(value) => handleInputChange('hotel_category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="3-Star">3-Star</SelectItem>
                          <SelectItem value="4-Star">4-Star</SelectItem>
                          <SelectItem value="5-Star">5-Star</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transportation_type">Transportation</Label>
                      <Select value={formData.transportation_type} onValueChange={(value) => handleInputChange('transportation_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bus">Bus</SelectItem>
                          <SelectItem value="Private Bus">Private Bus</SelectItem>
                          <SelectItem value="Flight">Flight</SelectItem>
                          <SelectItem value="Train">Train</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="group_size_min">Min Group Size</Label>
                      <Input
                        id="group_size_min"
                        type="number"
                        value={formData.group_size_min}
                        onChange={(e) => handleInputChange('group_size_min', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group_size_max">Max Group Size</Label>
                      <Input
                        id="group_size_max"
                        type="number"
                        value={formData.group_size_max}
                        onChange={(e) => handleInputChange('group_size_max', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="featured_image">Featured Image URL</Label>
                      <Input
                        id="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => handleInputChange('featured_image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => handleInputChange('video_url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Package Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Makkah, Saudi Arabia"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                      />
                      <Label htmlFor="is_featured">Featured Package</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inclusions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="includes">What's Included (one per line)</Label>
                      <Textarea
                        id="includes"
                        value={formData.includes}
                        onChange={(e) => handleInputChange('includes', e.target.value)}
                        rows={8}
                        placeholder="5-star hotel accommodation&#10;Daily breakfast and dinner&#10;Round-trip flights"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excludes">What's Excluded (one per line)</Label>
                      <Textarea
                        id="excludes"
                        value={formData.excludes}
                        onChange={(e) => handleInputChange('excludes', e.target.value)}
                        rows={8}
                        placeholder="Personal expenses&#10;Shopping&#10;Additional meals"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickup_points">Pickup Points (one per line)</Label>
                    <Textarea
                      id="pickup_points"
                      value={formData.pickup_points}
                      onChange={(e) => handleInputChange('pickup_points', e.target.value)}
                      rows={4}
                      placeholder="Dubai International Airport&#10;Dubai Mall&#10;Burj Khalifa"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="policies" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancellation_policy">Cancellation Policy</Label>
                    <Textarea
                      id="cancellation_policy"
                      value={formData.cancellation_policy}
                      onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                    <Textarea
                      id="terms_conditions"
                      value={formData.terms_conditions}
                      onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special_notes">Special Notes</Label>
                    <Textarea
                      id="special_notes"
                      value={formData.special_notes}
                      onChange={(e) => handleInputChange('special_notes', e.target.value)}
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingPackage ? 'Update' : 'Create'} Package
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              {pkg.featured_image ? (
                <img
                  src={pkg.featured_image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-green-600" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                {pkg.is_featured && (
                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
                )}
                <Badge className={pkg.is_active ? "bg-green-500" : "bg-red-500"}>
                  {pkg.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {pkg.short_description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {pkg.duration_days} Days / {pkg.duration_nights} Nights
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {pkg.departure_city}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Up to {pkg.group_size_max} people
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  {pkg.discount_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        ${pkg.discount_price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${pkg.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-green-600">
                      ${pkg.price}
                    </span>
                  )}
                </div>
                {pkg.rating && pkg.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(pkg)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(pkg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No packages found
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first Umrah package to get started.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};