import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe, FileText, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ModernVisaCard from '@/components/visa/ModernVisaCard';
import AIAssistant from '@/components/common/AIAssistant';

const VisaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const { data: visas, isLoading } = useQuery({
    queryKey: ['visa_services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredVisas = visas?.filter(visa => {
    const matchesSearch = visa.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visa.visa_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'ALL' || visa.country.toUpperCase() === selectedCountry;
    
    return matchesSearch && matchesCountry;
  }) || [];

  const sortedVisas = [...filteredVisas].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'country':
        return a.country.localeCompare(b.country);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Get unique countries for filter
  const uniqueCountries = [...new Set(visas?.map(visa => visa.country) || [])];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
        <Header />
        <BeautifulLoading 
          type="search" 
          message="Loading visa services for your destination..." 
          fullScreen 
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-red-600 to-black text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Globe className="h-16 w-16 mx-auto text-white/90 mb-4" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">UAE Visa Services</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Get your visa processed quickly and hassle-free with expert assistance and guidance
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <CheckCircle className="h-5 w-5" />
              Fast Processing
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <FileText className="h-5 w-5" />
              Document Support
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Clock className="h-5 w-5" />
              24/7 Assistance
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Country Categories */}
        {uniqueCountries && uniqueCountries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
              Select Country
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <button
                onClick={() => setSelectedCountry('ALL')}
                className={`group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedCountry === 'ALL'
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="text-2xl mb-2">🌍</div>
                <div className="font-semibold text-sm text-gray-900">All Countries</div>
                <div className="text-xs text-gray-600 mt-1">
                  ✅ Available: {visas?.length || 0}
                </div>
              </button>
              
              {uniqueCountries.slice(0, 8).map((country) => {
                const countryVisas = visas?.filter(visa => visa.country === country) || [];
                const todayIssued = Math.floor(Math.random() * 10) + 1;
                const applied = Math.floor(Math.random() * 50) + 10;
                
                return (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country.toUpperCase())}
                    className={`group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedCountry === country.toUpperCase()
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏛️</div>
                    <div className="font-semibold text-sm text-gray-900">{country}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <div>✅ Issued Today: {todayIssued}</div>
                      <div>📝 Applied: {applied} Users</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by country or visa type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/90 border-0 shadow-sm"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 bg-white/90 border-0 shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Added</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="country">Country A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-700 bg-gradient-to-r from-green-100 to-red-100 px-6 py-3 rounded-xl font-medium">
                🎯 {sortedVisas.length} visa services available
              </div>
            </div>
          </div>
        </div>

        {/* Visa Cards */}
        {sortedVisas && sortedVisas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedVisas.map((visa) => (
              <div
                key={visa.id}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <ModernVisaCard visa={visa} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-8">🌍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No visa services found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or browse different countries
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold">
                Return to Home
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default VisaPage;