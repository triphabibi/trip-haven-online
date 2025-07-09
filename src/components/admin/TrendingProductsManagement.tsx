
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star } from 'lucide-react';

interface TrendingProduct {
  id: string;
  service_id: string;
  service_type: 'tour' | 'package' | 'visa' | 'ticket';
  display_order: number;
  is_active: boolean;
  created_at: string;
  service_title?: string;
  service_price?: number;
  service_image?: string;
}

const TrendingProductsManagement = () => {
  const [selectedServiceType, setSelectedServiceType] = useState<'tour' | 'package' | 'visa' | 'ticket'>('tour');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trending products
  const { data: trendingProducts, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trending_products')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      
      // Fetch service details for each trending product
      const productsWithDetails = await Promise.all(
        data.map(async (product) => {
          let serviceData = null;
          
          switch (product.service_type) {
            case 'tour':
              const { data: tourData } = await supabase
                .from('tours')
                .select('title, price_adult, featured_image')
                .eq('id', product.service_id)
                .single();
              serviceData = tourData;
              break;
            case 'package':
              const { data: packageData } = await supabase
                .from('tour_packages')
                .select('title, price_adult, featured_image')
                .eq('id', product.service_id)
                .single();
              serviceData = packageData;
              break;
            case 'visa':
              const { data: visaData } = await supabase
                .from('visa_services')
                .select('country, visa_type, price, featured_image')
                .eq('id', product.service_id)
                .single();
              serviceData = visaData ? {
                title: `${visaData.country} - ${visaData.visa_type}`,
                price_adult: visaData.price,
                featured_image: visaData.featured_image
              } : null;
              break;
            case 'ticket':
              const { data: ticketData } = await supabase
                .from('attraction_tickets')
                .select('title, price_adult, featured_image')
                .eq('id', product.service_id)
                .single();
              serviceData = ticketData;
              break;
          }
          
          return {
            ...product,
            service_title: serviceData?.title || 'Unknown Service',
            service_price: serviceData?.price_adult || 0,
            service_image: serviceData?.featured_image || null
          };
        })
      );
      
      return productsWithDetails;
    }
  });

  // Fetch available services based on selected type
  const { data: availableServices } = useQuery({
    queryKey: ['available_services', selectedServiceType],
    queryFn: async () => {
      let tableName = '';
      let selectFields = 'id, title';
      
      switch (selectedServiceType) {
        case 'tour':
          tableName = 'tours';
          break;
        case 'package':
          tableName = 'tour_packages';
          break;
        case 'visa':
          tableName = 'visa_services';
          selectFields = 'id, country, visa_type';
          break;
        case 'ticket':
          tableName = 'attraction_tickets';
          break;
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select(selectFields)
        .eq('status', 'active');
      
      if (error) throw error;
      
      // Format visa services differently
      if (selectedServiceType === 'visa') {
        return data.map(item => ({
          ...item,
          title: `${item.country} - ${item.visa_type}`
        }));
      }
      
      return data;
    }
  });

  const addTrendingMutation = useMutation({
    mutationFn: async (data: { service_id: string; service_type: string; display_order: number }) => {
      const { error } = await supabase
        .from('trending_products')
        .insert({
          service_id: data.service_id,
          service_type: data.service_type,
          display_order: data.display_order,
          is_active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trending_products'] });
      toast({ title: 'Success', description: 'Product added to trending list' });
      setSelectedServiceId('');
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to add trending product', variant: 'destructive' });
    }
  });

  const removeTrendingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trending_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trending_products'] });
      toast({ title: 'Success', description: 'Product removed from trending list' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to remove trending product', variant: 'destructive' });
    }
  });

  const handleAddTrending = () => {
    if (!selectedServiceId) {
      toast({ title: 'Error', description: 'Please select a service', variant: 'destructive' });
      return;
    }

    const nextOrder = (trendingProducts?.length || 0) + 1;
    addTrendingMutation.mutate({
      service_id: selectedServiceId,
      service_type: selectedServiceType,
      display_order: nextOrder
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trending Products Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Product to Trending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Select value={selectedServiceType} onValueChange={(value: any) => setSelectedServiceType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tour">Tours</SelectItem>
                  <SelectItem value="package">Packages</SelectItem>
                  <SelectItem value="visa">Visa Services</SelectItem>
                  <SelectItem value="ticket">Tickets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service_id">Select Service</Label>
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddTrending} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add to Trending
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Current Trending Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTrending ? (
            <div>Loading trending products...</div>
          ) : (
            <div className="grid gap-4">
              {trendingProducts?.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {product.service_image && (
                      <img 
                        src={product.service_image} 
                        alt={product.service_title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{product.service_title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="capitalize">{product.service_type}</span>
                        <span>•</span>
                        <span>AED {product.service_price}</span>
                        <span>•</span>
                        <span>Order: {product.display_order}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTrendingMutation.mutate(product.id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
              {(!trendingProducts || trendingProducts.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No trending products configured yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingProductsManagement;
