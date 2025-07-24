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

      {/* Body Content - Umrah Features & Information */}
      <div className="relative py-16 bg-gradient-to-br from-green-900/90 to-yellow-900/90">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30zm-45 0c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15-15-6.716-15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container mx-auto px-4 text-white relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 golden-text">Why Choose Our Umrah Packages?</h3>
            <p className="text-xl opacity-90 leading-relaxed">
              Experience a spiritually enriching journey with our comprehensive Umrah services, 
              designed to make your pilgrimage comfortable, meaningful, and unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Service Features */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕌</span>
                </div>
                <h4 className="text-xl font-bold mb-3">Sacred Guidance</h4>
                <p className="opacity-90">Expert Islamic scholars accompany you throughout your journey, providing spiritual guidance and religious insights.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏨</span>
                </div>
                <h4 className="text-xl font-bold mb-3">Premium Accommodation</h4>
                <p className="opacity-90">Stay in carefully selected hotels near the Haram, ensuring comfort and easy access to the holy sites.</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✈️</span>
                </div>
                <h4 className="text-xl font-bold mb-3">Seamless Travel</h4>
                <p className="opacity-90">Complete travel arrangements including flights, transfers, and documentation assistance for a hassle-free experience.</p>
              </div>
            </div>
          </div>

          {/* Spiritual Journey Timeline */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-3xl font-bold text-center mb-12 golden-text">Your Spiritual Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
                <h4 className="font-bold mb-2">Arrival & Ihram</h4>
                <p className="text-sm opacity-80">Don the sacred Ihram and begin your spiritual transformation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
                <h4 className="font-bold mb-2">Tawaf & Sa'i</h4>
                <p className="text-sm opacity-80">Perform Tawaf around the Kaaba and Sa'i between Safa and Marwah</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
                <h4 className="font-bold mb-2">Hair Cutting</h4>
                <p className="text-sm opacity-80">Complete the Umrah with symbolic hair cutting or shaving</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">4</div>
                <h4 className="font-bold mb-2">Spiritual Reflection</h4>
                <p className="text-sm opacity-80">Time for prayer, reflection, and spiritual renewal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative bg-gradient-to-br from-gray-900 to-black text-white py-16">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&h=1080&fit=crop&crop=center')`,
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 golden-text">TripHabibi Umrah</h3>
              <p className="text-gray-300 mb-4">
                Your trusted partner for sacred journeys to the holy lands. We provide comprehensive Umrah services with spiritual guidance and exceptional care.
              </p>
              <div className="text-sm text-gray-400">
                <p>🕌 Licensed Umrah Operator</p>
                <p>✈️ IATA Certified Travel Agent</p>
                <p>🛡️ Ministry of Hajj & Umrah Approved</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/umrah" className="hover:text-yellow-400 transition-colors">Umrah Packages</a></li>
                <li><a href="/visa" className="hover:text-yellow-400 transition-colors">Visa Services</a></li>
                <li><a href="/hotels" className="hover:text-yellow-400 transition-colors">Hotel Booking</a></li>
                <li><a href="/flights" className="hover:text-yellow-400 transition-colors">Flight Booking</a></li>
                <li><a href="/guides" className="hover:text-yellow-400 transition-colors">Umrah Guide</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 umrah@triphabibi.com</p>
                <p>📞 +1 (555) 123-UMRAH</p>
                <p>💬 WhatsApp: +1 (555) 123-4567</p>
                <p>📍 123 Islamic Center Dr<br />   Sacred City, SC 12345</p>
              </div>
            </div>

            {/* Islamic Quote */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Spiritual Inspiration</h4>
              <div className="bg-gradient-to-br from-green-800/50 to-yellow-800/50 rounded-lg p-4 border border-yellow-600/30">
                <p className="text-lg font-arabic mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
                </p>
                <p className="text-sm italic text-gray-300">
                  "Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire." - Quran 2:201
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-yellow-400 font-semibold">May Allah accept your pilgrimage</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 TripHabibi. All rights reserved. | Made with ❤️ for the Ummah
            </p>
            <p className="text-sm text-gray-500 mt-2">
              السلام عليكم ورحمة الله وبركاته
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};