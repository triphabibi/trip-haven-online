
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Filter } from 'lucide-react';

interface HomepageFiltersProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const HomepageFilters = ({ selectedCountry, onCountryChange, selectedType, onTypeChange }: HomepageFiltersProps) => {
  const countries = [
    { code: 'ALL', name: 'All Countries', flag: '🌍' },
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'FRANCE', name: 'France', flag: '🇫🇷' },
    { code: 'ITALY', name: 'Italy', flag: '🇮🇹' },
    { code: 'SPAIN', name: 'Spain', flag: '🇪🇸' },
    { code: 'GERMANY', name: 'Germany', flag: '🇩🇪' },
    { code: 'JAPAN', name: 'Japan', flag: '🇯🇵' },
    { code: 'SINGAPORE', name: 'Singapore', flag: '🇸🇬' },
    { code: 'THAILAND', name: 'Thailand', flag: '🇹🇭' },
    { code: 'AUSTRALIA', name: 'Australia', flag: '🇦🇺' },
    { code: 'CANADA', name: 'Canada', flag: '🇨🇦' },
    { code: 'SAUDI', name: 'Saudi Arabia', flag: '🇸🇦' }
  ];

  const serviceTypes = [
    { code: 'ALL', name: 'All Services', icon: '🎯' },
    { code: 'TOUR', name: 'Tours', icon: '🎭' },
    { code: 'PACKAGE', name: 'Packages', icon: '📦' },
    { code: 'VISA', name: 'Visas', icon: '📋' },
    { code: 'TICKET', name: 'Tickets', icon: '🎫' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
      <div className="flex-1">
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="h-8 md:h-12 bg-white border border-gray-300 text-gray-900 text-sm md:text-base shadow-sm">
            <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code} className="hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-gray-900">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-8 md:h-12 bg-white border border-gray-300 text-gray-900 text-sm md:text-base shadow-sm">
            <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
            {serviceTypes.map((type) => (
              <SelectItem key={type.code} value={type.code} className="hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-gray-900">{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HomepageFilters;
