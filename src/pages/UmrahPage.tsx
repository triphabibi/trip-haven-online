import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Star, Clock, Search, Filter } from 'lucide-react';
import { useUmrahPackages, UmrahPackage } from '@/hooks/useUmrahPackages';
import { useCurrency } from '@/hooks/useCurrency';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Link } from 'react-router-dom';

export const UmrahPage = () => {
  const { packages, loading } = useUmrahPackages();
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPackages, setFilteredPackages] = useState<UmrahPackage[]>([]);

  useEffect(() => {
    if (packages.length > 0) {
      const filtered = packages.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.departure_city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [packages, searchTerm]);

  if (loading) return <BeautifulLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Sacred Journey to Umrah
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Experience the spiritual journey of a lifetime with our carefully crafted Umrah packages
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search packages by city, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 rounded-full border-0 bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Available Packages ({filteredPackages.length})
          </h2>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
              {/* Package Image */}
              <div className="relative h-64 overflow-hidden">
                {pkg.featured_image && (
                  <img
                    src={pkg.featured_image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  {pkg.is_featured && (
                    <Badge className="bg-yellow-500 text-white border-0">
                      Featured
                    </Badge>
                  )}
                  <Badge className="bg-green-600 text-white border-0">
                    {pkg.hotel_category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{pkg.title}</h3>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {pkg.departure_city}
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Package Details */}
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pkg.short_description || pkg.description}
                  </p>

                  {/* Duration & Group Size */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {pkg.duration_days} Days / {pkg.duration_nights} Nights
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Up to {pkg.group_size_max} people
                    </div>
                  </div>

                  {/* Rating */}
                  {pkg.rating && pkg.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{pkg.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({pkg.total_reviews} reviews)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.discount_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(pkg.discount_price)}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(pkg.price)}
                        </span>
                      )}
                      <p className="text-sm text-gray-500">per person</p>
                    </div>

                    <Link to={`/umrah/${pkg.slug || pkg.id}`}>
                      <Button className="bg-gradient-to-r from-green-600 to-yellow-600 text-white border-0 hover:from-green-700 hover:to-yellow-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No packages found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or clear the search to see all packages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};