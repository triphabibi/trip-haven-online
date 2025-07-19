
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ModernVisaCard from '@/components/visa/ModernVisaCard';
import CountryFilter from '@/components/common/CountryFilter';
import AIAssistant from '@/components/common/AIAssistant';

const VisaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

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
    const matchesType = selectedType === 'ALL' || selectedType === 'VISA';
    
    return matchesSearch && matchesCountry && matchesType;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your visa processed quickly and hassle-free with expert assistance and guidance
          </p>
        </div>

        {/* Country & Service Filter */}
        <CountryFilter
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {/* Search & Sort */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by country or visa type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
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
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-3 rounded-lg">
                {sortedVisas.length} visa services available
              </div>
            </div>
          </div>
        </div>

        {sortedVisas && sortedVisas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVisas.map((visa) => (
              <ModernVisaCard key={visa.id} visa={visa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No visa services found</h3>
            <p className="text-gray-500 text-lg mb-8">Try adjusting your search or filter criteria</p>
            <Link to="/">
              <Button>Return to Home</Button>
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
