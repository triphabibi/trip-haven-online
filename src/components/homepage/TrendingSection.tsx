
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingSection = () => {
  const trendingItems = [
    {
      id: '1',
      title: 'Dubai Desert Safari',
      type: 'tour',
      bookings: 47,
      price: 3200,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400',
      timeLeft: '2 days',
      country: '🇦🇪'
    },
    {
      id: '2',
      title: 'Europe Grand Package',
      type: 'package',
      bookings: 23,
      price: 85000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
      timeLeft: '5 days',
      country: '🇪🇺'
    },
    {
      id: '3',
      title: 'UAE Tourist Visa',
      type: 'visa',
      bookings: 156,
      price: 8500,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
      timeLeft: '1 day',
      country: '🇦🇪'
    },
    {
      id: '4',
      title: 'Burj Khalifa Tickets',
      type: 'ticket',
      bookings: 89,
      price: 2800,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400',
      timeLeft: '3 days',
      country: '🇦🇪'
    }
  ];

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
            <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={`${getTypeColor(item.type)} text-white text-xs`}>
                    {item.type.toUpperCase()}
                  </Badge>
                  <Badge variant="destructive" className="bg-red-500 text-white text-xs animate-pulse">
                    🔥 HOT
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-2xl">{item.country}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.timeLeft} left
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.bookings} booked today</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{item.price.toLocaleString()}
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
                    💥 {item.bookings} people booked this in last 24h
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
