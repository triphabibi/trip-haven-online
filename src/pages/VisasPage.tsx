
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, Clock, Star } from 'lucide-react';
import { useVisas } from '@/hooks/useVisas';
import { useCurrency } from '@/contexts/CurrencyContext';
import Loading from '@/components/common/Loading';

const VisasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: visas, isLoading } = useVisas();
  const { formatPrice } = useCurrency();

  const filteredVisas = visas?.filter(visa =>
    visa.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visa.visa_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading message="Loading visa services..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Visa Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Fast and reliable visa processing for your travel needs
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by country or visa type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Visa Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisas.map((visa) => (
            <Card key={visa.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">{visa.country}</h3>
                  </div>
                  {visa.is_featured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-2">{visa.visa_type}</p>
                
                {visa.processing_time && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>Processing: {visa.processing_time}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(visa.price)}
                  </div>
                  <Link to={`/visas/${visa.id}`}>
                    <Button>Apply Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVisas.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No visa services found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VisasPage;
