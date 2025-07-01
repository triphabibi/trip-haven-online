
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin } from 'lucide-react';

interface CountryFilterProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
}

const CountryFilter = ({ selectedCountry, onCountryChange, selectedType, onTypeChange }: CountryFilterProps) => {
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
    { code: 'CANADA', name: 'Canada', flag: '🇨🇦' }
  ];

  const serviceTypes = [
    { code: 'ALL', name: 'All Services', icon: '🎯' },
    { code: 'TOUR', name: 'Tours', icon: '🎭' },
    { code: 'PACKAGE', name: 'Packages', icon: '📦' },
    { code: 'VISA', name: 'Visas', icon: '📋' },
    { code: 'TICKET', name: 'Tickets', icon: '🎫' },
    { code: 'TRANSFER', name: 'Transfers', icon: '🚗' }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Filter by Destination & Service</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Country/Destination</label>
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Service Type</label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type.code} value={type.code}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCountry !== 'ALL' || selectedType !== 'ALL') && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Active filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCountry !== 'ALL' && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {countries.find(c => c.code === selectedCountry)?.flag} {countries.find(c => c.code === selectedCountry)?.name}
              </Badge>
            )}
            {selectedType !== 'ALL' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {serviceTypes.find(t => t.code === selectedType)?.icon} {serviceTypes.find(t => t.code === selectedType)?.name}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryFilter;
