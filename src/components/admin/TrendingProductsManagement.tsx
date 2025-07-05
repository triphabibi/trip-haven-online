
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, Eye, Edit, Plus, Trash2 } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

const TrendingProductsManagement = () => {
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('all');

  // Fetch all products that could be trending
  const { data: tours, refetch: refetchTours } = useQuery({
    queryKey: ['trending_tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(item => ({ ...item, type: 'tour' })) || [];
    },
  });

  const { data: packages, refetch: refetchPackages } = useQuery({
    queryKey: ['trending_packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(item => ({ ...item, type: 'package' })) || [];
    },
  });

  const { data: tickets, refetch: refetchTickets } = useQuery({
    queryKey: ['trending_tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attraction_tickets')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(item => ({ ...item, type: 'ticket' })) || [];
    },
  });

  const { data: visas, refetch: refetchVisas } = useQuery({
    queryKey: ['trending_visas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(item => ({ ...item, type: 'visa', display_title: `${item.country} ${item.visa_type}` })) || [];
    },
  });

  // Combine all products
  const allProducts = [
    ...(tours || []),
    ...(packages || []),
    ...(tickets || []),
    ...(visas || [])
  ];

  // Filter featured products (these appear in trending)
  const featuredProducts = allProducts.filter(product => product.is_featured);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tour': return 'bg-blue-500';
      case 'package': return 'bg-green-500';
      case 'visa': return 'bg-purple-500';
      case 'ticket': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleFeatured = async (product: any, newFeaturedStatus: boolean) => {
    let tableName = 'tours';
    if (product.type === 'package') tableName = 'tour_packages';
    else if (product.type === 'ticket') tableName = 'attraction_tickets';
    else if (product.type === 'visa') tableName = 'visa_services';

    try {
      const { error } = await supabase
        .from(tableName as any)
        .update({ is_featured: newFeaturedStatus })
        .eq('id', product.id);

      if (error) throw error;

      // Refetch data
      refetchTours();
      refetchPackages();
      refetchTickets();
      refetchVisas();

      toast({
        title: "Success",
        description: `Product ${newFeaturedStatus ? 'added to' : 'removed from'} trending section`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update trending status",
        variant: "destructive",
      });
    }
  };

  const getProductLocation = (product: any) => {
    if (product.type === 'visa') return product.country;
    return product.location || 'No location set';
  };

  const getProductPrice = (product: any) => {
    if (product.type === 'visa') return product.price;
    return product.price_adult || product.price || 0;
  };

  const getProductTitle = (product: any) => {
    if (product.type === 'visa') return product.display_title || `${product.country} ${product.visa_type}`;
    return product.title;
  };

  const getProductRating = (product: any) => {
    // Visa services don't have rating, so return 0 for them
    if (product.type === 'visa') return 0;
    return product.rating || 0;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Products Management
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Control which products appear in the "Trending Now" section on the homepage. 
              Toggle the featured status to add or remove products from trending.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                All Products ({allProducts.length})
              </Button>
              <Button 
                variant={selectedType === 'featured' ? 'default' : 'outline'}
                onClick={() => setSelectedType('featured')}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                🔥 Trending Only ({featuredProducts.length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedType === 'featured' ? featuredProducts : allProducts).map((product) => (
              <div key={`${product.type}-${product.id}`} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getTypeColor(product.type)} text-white text-xs`}>
                    {product.type.toUpperCase()}
                  </Badge>
                  {product.is_featured && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 animate-pulse">
                      🔥 TRENDING
                    </Badge>
                  )}
                </div>

                <div className="mb-3">
                  {product.featured_image && (
                    <img 
                      src={product.featured_image} 
                      alt={getProductTitle(product)} 
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h4 className="font-semibold truncate">{getProductTitle(product)}</h4>
                  <p className="text-sm text-gray-600">{getProductLocation(product)}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(getProductPrice(product))}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">⭐ {getProductRating(product)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={product.is_featured || false}
                      onCheckedChange={(checked) => toggleFeatured(product, checked)}
                    />
                    <Label className="text-sm">Show in Trending</Label>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {(selectedType === 'featured' ? featuredProducts : allProducts).length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">
                {selectedType === 'featured' ? 'No Trending Products' : 'No Products Found'}
              </h3>
              <p className="text-gray-500">
                {selectedType === 'featured' 
                  ? 'Mark some products as featured to show them in trending section'
                  : 'Create some products first to manage trending items'
                }
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Products marked as "Trending" will appear on the homepage</li>
              <li>• Mix different product types (tours, visas, tickets, packages) for variety</li>
              <li>• Update trending products regularly to keep content fresh</li>
              <li>• Featured products get more visibility and bookings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingProductsManagement;
