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
      {/* Hero Section - Mosque Theme */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&h=1080&fit=crop&crop=center')`,
          }}
        />
        
        {/* Video Background (optional) */}
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src="https://player.vimeo.com/external/376677742.sd.mp4?s=c6c6b8b8b8b8b8b8b8b8b8b8b8b8b8b8&profile_id=165" type="video/mp4" />
        </video>
        
        {/* Audio for Adhan */}
        <audio autoPlay loop muted>
          <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
        </audio>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        
        {/* Islamic Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            {/* Arabic Calligraphy */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-arabic mb-4" style={{ fontFamily: 'Amiri, serif' }}>
                ۞ لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ ۞
              </h2>
              <p className="text-lg opacity-90 italic">
                "Here I am, O Allah, here I am"
              </p>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 golden-text drop-shadow-2xl">
              Sacred Journey to Umrah
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Experience the spiritual journey of a lifetime with our carefully crafted Umrah packages. 
              Walk in the footsteps of the Prophet (PBUH) and find peace in the holy lands.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search packages by city, features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 rounded-full border-0 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500"
              />
            </div>
            
            {/* Islamic Greeting */}
            <div className="text-lg opacity-80">
              <p>السلام عليكم ورحمة الله وبركاته</p>
              <p className="text-sm mt-1 italic">Peace be upon you and Allah's mercy and blessings</p>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/30 to-transparent"></div>
        
        {/* Floating Islamic Stars */}
        <div className="absolute top-20 left-10 text-yellow-400 opacity-60 text-2xl animate-pulse">✦</div>
        <div className="absolute top-40 right-16 text-yellow-400 opacity-60 text-3xl animate-pulse delay-1000">✧</div>
        <div className="absolute bottom-32 left-20 text-yellow-400 opacity-60 text-xl animate-pulse delay-2000">✦</div>
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