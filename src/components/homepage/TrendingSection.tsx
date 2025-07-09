
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';

const TrendingSection = () => {
  const { formatPrice } = useCurrency();

  const { data: trendingItems, isLoading } = useQuery({
    queryKey: ['trending_items'],
    queryFn: async () => {
      const items = [];
      
      // Fetch featured tours
      const { data: tours } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(2);
      
      if (tours) {
        items.push(...tours.map(tour => ({
          ...tour,
          type: 'tour',
          bookings: Math.floor(Math.random() * 100) + 10
        })));
      }

      // Fetch featured packages
      const { data: packages } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(1);
      
      if (packages) {
        items.push(...packages.map(pkg => ({
          ...pkg,
          type: 'package',
          bookings: Math.floor(Math.random() * 50) + 5
        })));
      }

      // Fetch featured visas
      const { data: visas } = await supabase
        .from('visa_services')
        .select('*')
        .eq('status', 'active')
        .eq('is_featured', true)
        .limit(1);
      
      if (visas) {
        items.push(...visas.map(visa => ({
          ...visa,
          type: 'visa',
          bookings: Math.floor(Math.random() * 200) + 50,
          display_title: `${visa.country} ${visa.visa_type}`
        })));
      }

      return items.slice(0, 4); // Limit to 4 items
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tour': return 'bg-blue-500';
      case 'package': return 'bg-green-500';
      case 'visa': return 'bg-purple-500';
      case 'ticket': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getLink = (item: any) => {
    switch (item.type) {
      case 'tour': return `/tours/${item.id}`;
      case 'package': return `/packages/${item.id}`;
      case 'visa': return `/visas/${item.id}`;
      case 'ticket': return `/tickets/${item.id}`;
      default: return '/';
    }
  };

  const getPrice = (item: any) => {
    if (item.type === 'visa') return item.price;
    return item.price_adult || item.price || 0;
  };

  const getTitle = (item: any) => {
    if (item.type === 'visa') return item.display_title || `${item.country} ${item.visa_type}`;
    return item.title;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!trendingItems || trendingItems.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trending Now
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what other travelers are booking right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                {item.featured_image && (
                  <img
                    src={item.featured_image}
                    alt={getTitle(item)}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>
                    {item.type.toUpperCase()}
                  </Badge>
                  <Badge variant="destructive" className="bg-red-500 text-white text-xs animate-pulse">
                    🔥 HOT
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Limited time
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{getTitle(item)}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating || 4.5}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.bookings} booked</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(getPrice(item))}
                  </div>
                  <Link to={getLink(item)}>
                    <Button size="sm" className="group/btn">
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-3 p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 text-center font-medium">
                    💥 {item.bookings} people booked this recently
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
