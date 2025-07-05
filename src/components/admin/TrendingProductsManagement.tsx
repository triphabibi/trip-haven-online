
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Star, Plane, FileText, Ticket } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TrendingProduct {
  id: string;
  title: string;
  type: 'tour' | 'package' | 'ticket' | 'visa';
  price: number;
  is_trending: boolean;
  featured_image?: string;
  rating?: number;
}

const TrendingProductsManagement = () => {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Load tours
      const { data: tours } = await supabase
        .from('tours')
        .select('id, title, price_adult, featured_image, rating, is_featured')
        .eq('status', 'active');

      // Load packages
      const { data: packages } = await supabase
        .from('tour_packages')
        .select('id, title, price_adult, featured_image, rating, is_featured')
        .eq('status', 'active');

      // Load tickets
      const { data: tickets } = await supabase
        .from('attraction_tickets')
        .select('id, title, price_adult, featured_image, rating, is_featured')
        .eq('status', 'active');

      // Load visas
      const { data: visas } = await supabase
        .from('visa_services')
        .select('id, country, visa_type, price, featured_image, is_featured')
        .eq('status', 'active');

      const allProducts: TrendingProduct[] = [
        ...(tours || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'tour' as const,
          price: item.price_adult,
          is_trending: item.is_featured || false,
          featured_image: item.featured_image,
          rating: item.rating || 0
        })),
        ...(packages || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'package' as const,
          price: item.price_adult,
          is_trending: item.is_featured || false,
          featured_image: item.featured_image,
          rating: item.rating || 0
        })),
        ...(tickets || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'ticket' as const,
          price: item.price_adult,
          is_trending: item.is_featured || false,
          featured_image: item.featured_image,
          rating: item.rating || 0
        })),
        ...(visas || []).map(item => ({
          id: item.id,
          title: `${item.country} - ${item.visa_type}`,
          type: 'visa' as const,
          price: item.price,
          is_trending: item.is_featured || false,
          featured_image: item.featured_image
        }))
      ];

      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTrending = async (productId: string, type: string, isTrending: boolean) => {
    try {
      let tableName = '';
      switch (type) {
        case 'tour':
          tableName = 'tours';
          break;
        case 'package':
          tableName = 'tour_packages';
          break;
        case 'ticket':
          tableName = 'attraction_tickets';
          break;
        case 'visa':
          tableName = 'visa_services';
          break;
      }

      const { error } = await supabase
        .from(tableName)
        .update({ is_featured: isTrending })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, is_trending: isTrending }
          : product
      ));

      toast({
        title: "Success",
        description: `Product ${isTrending ? 'added to' : 'removed from'} trending section.`,
      });
    } catch (error) {
      console.error('Error updating trending status:', error);
      toast({
        title: "Error",
        description: "Failed to update trending status.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tour':
        return <Plane className="h-4 w-4" />;
      case 'package':
        return <FileText className="h-4 w-4" />;
      case 'ticket':
        return <Ticket className="h-4 w-4" />;
      case 'visa':
        return <FileText className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tour':
        return 'bg-blue-100 text-blue-800';
      case 'package':
        return 'bg-green-100 text-green-800';
      case 'ticket':
        return 'bg-purple-100 text-purple-800';
      case 'visa':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const trendingProducts = products.filter(p => p.is_trending);

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-6 w-6" />
            Trending Products Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Currently Trending ({trendingProducts.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingProducts.map((product) => (
                <div key={product.id} className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getTypeColor(product.type)} flex items-center gap-1`}>
                      {getTypeIcon(product.type)}
                      {product.type}
                    </Badge>
                    <Badge className="bg-green-500">Trending</Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-2 truncate">{product.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold">{formatPrice(product.price)}</span>
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {trendingProducts.length === 0 && (
              <p className="text-gray-500 text-center py-8">No trending products selected</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">All Products</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={`${getTypeColor(product.type)} flex items-center gap-1`}>
                      {getTypeIcon(product.type)}
                      {product.type}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-sm truncate max-w-48">{product.title}</h4>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    )}
                    <Switch
                      checked={product.is_trending}
                      onCheckedChange={(checked) => 
                        toggleTrending(product.id, product.type, checked)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={loadProducts} 
            disabled={loading}
            className="w-full mt-4"
            variant="outline"
          >
            {loading ? 'Loading...' : 'Refresh Products'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingProductsManagement;
