import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TrendingUp, Eye, Edit } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const TrendingProductsManagement = () => {
  const { formatPrice } = useCurrency();
  const [selectedType, setSelectedType] = useState('all');

  // Fetch all products that could be trending
  const { data: tours } = useQuery({
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

  const { data: packages } = useQuery({
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

  const { data: tickets } = useQuery({
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

  const { data: visas } = useQuery({
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

    const { error } = await supabase
      .from(tableName as any)
      .update({ is_featured: newFeaturedStatus })
      .eq('id', product.id);

    if (!error) {
      window.location.reload();
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
              Featured products automatically appear in the "Trending Now" section on the homepage. 
              Toggle the featured status to control which products are shown.
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
              >
                Featured Only ({featuredProducts.length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedType === 'featured' ? featuredProducts : allProducts).map((product) => (
              <div key={`${product.type}-${product.id}`} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getTypeColor(product.type)} text-white text-xs`}>
                    {product.type.toUpperCase()}
                  </Badge>
                  {product.is_featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      ⭐ Trending
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
                    <span className="text-sm">Rating: {getProductRating(product)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={product.is_featured || false}
                      onCheckedChange={(checked) => toggleFeatured(product, checked)}
                    />
                    <Label className="text-sm">Featured in Trending</Label>
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
                {selectedType === 'featured' ? 'No Featured Products' : 'No Products Found'}
              </h3>
              <p className="text-gray-500">
                {selectedType === 'featured' 
                  ? 'Mark some products as featured to show them in trending section'
                  : 'Create some products first to manage trending items'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingProductsManagement;
