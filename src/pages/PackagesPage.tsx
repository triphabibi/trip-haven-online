
import { useState } from 'react';
import { usePackages } from '@/hooks/usePackages';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Star, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PackagesPage = () => {
  const { data: packages, isLoading, error } = usePackages();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-20 w-full mb-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Holiday Packages</h1>
          <p className="text-gray-600">Unable to load packages. Please try again later.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Holiday Packages</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete vacation packages with accommodation, tours, and experiences included
          </p>
        </div>

        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={pkg.image_urls?.[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500'}
                    alt={pkg.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {pkg.is_featured && (
                      <Badge className="bg-orange-500">Featured</Badge>
                    )}
                    <Badge className="bg-blue-500">
                      {pkg.nights}N / {pkg.days}D
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {pkg.rating || 4.5} ({pkg.total_reviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{pkg.days} Days</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pkg.description}</p>
                  
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Highlights:</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.slice(0, 2).map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {pkg.highlights.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pkg.highlights.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{pkg.price_adult}</span>
                      <span className="text-gray-500 text-sm ml-1">per person</span>
                    </div>
                    <Link to={`/packages/${pkg.id}`}>
                      <Button size="sm" className="group">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No packages available at the moment.</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PackagesPage;
