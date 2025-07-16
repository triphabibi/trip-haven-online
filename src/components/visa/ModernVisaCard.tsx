
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

interface VisaService {
  id: string;
  country: string;
  visa_type: string;
  price: number;
  processing_time?: string;
  requirements?: string[];
  description?: string;
  is_featured: boolean;
}

interface ModernVisaCardProps {
  visa: VisaService;
}

const ModernVisaCard = ({ visa }: ModernVisaCardProps) => {
  const { formatPrice } = useCurrency();

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'UAE': '🇦🇪',
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'Thailand': '🇹🇭',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭'
    };
    return flags[country] || '🌍';
  };

  const getVisaTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      'Tourist': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Transit': 'bg-yellow-100 text-yellow-800',
      'Student': 'bg-purple-100 text-purple-800',
      'Work': 'bg-orange-100 text-orange-800',
      'Multiple Entry': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">{getCountryFlag(visa.country)}</div>
            <h3 className="text-xl font-bold">{visa.country}</h3>
            <p className="text-blue-100 text-sm">{visa.visa_type} Visa</p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {visa.is_featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Featured
            </Badge>
          )}
          <Badge className={`${getVisaTypeBadge(visa.visa_type)} border-0`}>
            {visa.visa_type}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="font-bold text-lg text-gray-900 mb-2">
            {visa.country} {visa.visa_type} Visa
          </h4>
          <p className="text-gray-600 text-sm line-clamp-2">
            {visa.description || `Get your ${visa.visa_type.toLowerCase()} visa for ${visa.country} processed quickly and efficiently with our expert assistance.`}
          </p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">
              Processing: {visa.processing_time || '5-7 working days'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">
              {visa.requirements?.length || 5} documents required
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">Expert assistance included</span>
          </div>
        </div>

        {visa.requirements && visa.requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Required documents:</p>
            <div className="flex flex-wrap gap-1">
              {visa.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                  {req}
                </Badge>
              ))}
              {visa.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-50">
                  +{visa.requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-blue-600">{formatPrice(visa.price, 'USD')}</span>
            <span className="text-gray-500 text-sm ml-2">per person</span>
          </div>
          <Link to={`/visas/${visa.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 group">
              Apply Now
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernVisaCard;
