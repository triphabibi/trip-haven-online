
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Globe, FileText, Search, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

const VisaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const { formatPrice } = useCurrency();

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

  const filteredVisas = visas?.filter(visa => 
    visa.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.visa_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visa Services</h1>
          <p className="text-xl text-gray-600">Get your visa processed quickly and hassle-free</p>
        </div>

        {/* Filters */}
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
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="country">Country A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {sortedVisas.length} Countries
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVisas.map((visa) => (
            <Card key={visa.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="text-lg font-bold">{visa.country}</h3>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  {visa.is_featured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-lg mb-1">{visa.visa_type}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{visa.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Processing: {visa.processing_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{visa.requirements?.length || 0} documents required</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(visa.price)}</span>
                    <span className="text-gray-500 text-sm ml-1">per person</span>
                  </div>
                  <Link to={`/visas/${visa.id}`}>
                    <Button size="sm" className="group">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {visa.requirements && visa.requirements.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-1">Required documents:</p>
                    <div className="flex flex-wrap gap-1">
                      {visa.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {visa.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{visa.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedVisas.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No visa services found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VisaPage;
