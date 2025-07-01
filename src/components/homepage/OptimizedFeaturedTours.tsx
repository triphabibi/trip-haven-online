
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useTours } from '@/hooks/useTours';
import { Skeleton } from '@/components/ui/skeleton';

const OptimizedFeaturedTours = () => {
  const { data: tours, isLoading, error } = useTours();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated tour experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-20 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Tours
          </h2>
          <p className="text-gray-600">Unable to load tours. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Tours
          </h2>
          <p className="text-gray-600">No tours available at the moment.</p>
        </div>
      </section>
    );
  }

  const featuredTours = tours.filter(tour => tour.is_featured).slice(0, 6);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Tours
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated tour experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={tour.image_urls?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500'}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {tour.instant_confirmation && (
                    <Badge className="bg-green-500">Instant Confirmation</Badge>
                  )}
                  {tour.free_cancellation && (
                    <Badge className="bg-blue-500">Free Cancellation</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {tour.rating || 4.5} ({tour.total_reviews || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{tour.duration || 'Full Day'}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">₹{tour.price_adult}</span>
                    <span className="text-gray-500 text-sm ml-1">per adult</span>
                  </div>
                  <Link to={`/tours/${tour.id}`}>
                    <Button size="sm" className="group">
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/tours">
            <Button size="lg" variant="outline">
              View All Tours
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OptimizedFeaturedTours;
