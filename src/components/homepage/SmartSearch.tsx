
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Package, FileText, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: 'tour' | 'package' | 'visa' | 'ticket';
  country?: string;
  price?: number;
}

const SmartSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all data for search
  const { data: searchData } = useQuery({
    queryKey: ['search-data'],
    queryFn: async () => {
      const [tours, packages, visas, tickets] = await Promise.all([
        supabase.from('tours').select('id, title, country, price_adult').eq('status', 'active'),
        supabase.from('tour_packages').select('id, title, country, price_adult').eq('status', 'active'),
        supabase.from('visa_services').select('id, country, visa_type, price').eq('status', 'active'),
        supabase.from('attraction_tickets').select('id, title, country, price_adult').eq('status', 'active')
      ]);

      const results: SearchResult[] = [
        ...(tours.data || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'tour' as const,
          country: item.country,
          price: item.price_adult
        })),
        ...(packages.data || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'package' as const,
          country: item.country,
          price: item.price_adult
        })),
        ...(visas.data || []).map(item => ({
          id: item.id,
          title: `${item.country} - ${item.visa_type}`,
          type: 'visa' as const,
          country: item.country,
          price: item.price
        })),
        ...(tickets.data || []).map(item => ({
          id: item.id,
          title: item.title,
          type: 'ticket' as const,
          country: item.country,
          price: item.price_adult
        }))
      ];

      return results;
    },
  });

  useEffect(() => {
    if (searchQuery.length >= 2 && searchData) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);
      setFilteredResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery, searchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'tour': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'package': return <Package className="h-4 w-4 text-green-500" />;
      case 'visa': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'ticket': return <Ticket className="h-4 w-4 text-orange-500" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case 'tour': return `/tours/${result.id}`;
      case 'package': return `/packages/${result.id}`;
      case 'visa': return `/visas/${result.id}`;
      case 'ticket': return `/tickets/${result.id}`;
      default: return '/';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tours, packages, visas, tickets... (e.g., 'Dubai', 'Europe')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 h-14 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-all duration-300"
        />
        <Button 
          size="sm" 
          className="absolute right-2 top-2 h-10 bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowResults(true)}
        >
          Search
        </Button>
      </div>

      {showResults && filteredResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-2xl border-0">
          <div className="p-2">
            {filteredResults.map((result) => (
              <Link
                key={result.id}
                to={getLink(result)}
                onClick={() => setShowResults(false)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                {getIcon(result.type)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{result.title}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {result.type} {result.country && `• ${result.country}`}
                  </div>
                </div>
                {result.price && (
                  <div className="text-blue-600 font-semibold">
                    ₹{result.price.toLocaleString()}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {showResults && searchQuery.length >= 2 && filteredResults.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-2xl border-0">
          <div className="p-4 text-center text-gray-500">
            No results found for "{searchQuery}"
          </div>
        </Card>
      )}
    </div>
  );
};

export default SmartSearch;
