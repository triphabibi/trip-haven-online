import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, X } from 'lucide-react';

interface SmartFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

const SmartFilters = ({ onSearch, onFilterChange }: SmartFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularDestinations = [
    'Dubai', 'Thailand', 'Singapore', 'Malaysia', 'Turkey', 'Europe',
    'USA', 'Canada', 'Australia', 'UK', 'Schengen', 'Japan'
  ];

  const trendingServices = [
    'Tourist Visa', 'Business Visa', 'City Tour', 'Desert Safari',
    'Theme Park Tickets', 'Airport Transfer', 'Hotel Booking'
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = [...popularDestinations, ...trendingServices]
        .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      const newFilters = [...activeFilters, filter];
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const removeFilter = (filter: string) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search destinations, visas, tours..."
          className="pl-10 pr-4 py-3 text-lg bg-white border-2 border-gray-200 rounded-xl shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Live Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => addFilter(suggestion)}
              className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <MapPin className="h-4 w-4 text-blue-500 mr-3" />
              <span className="text-gray-700">{suggestion}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {popularDestinations.includes(suggestion) ? 'Destination' : 'Service'}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {filter}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Trending Tags */}
      {searchQuery === '' && activeFilters.length === 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">🔥 Trending searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.slice(0, 6).map((destination, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => addFilter(destination)}
              >
                {destination}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartFilters;