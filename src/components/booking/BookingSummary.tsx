import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Users, CreditCard, Check } from 'lucide-react';

interface BookingSummaryProps {
  service: {
    type: 'tour' | 'visa' | 'ticket' | 'package' | 'ok-to-board';
    title: string;
    destination?: string;
    date?: string;
    travelers?: number;
    basePrice: number;
    currency?: string;
  };
  isVisible: boolean;
  position?: 'sidebar' | 'popup';
}

const BookingSummary = ({ service, isVisible, position = 'sidebar' }: BookingSummaryProps) => {
  const [totalPrice, setTotalPrice] = useState(service.basePrice);
  const [currency, setCurrency] = useState(service.currency || 'INR');
  const [fees, setFees] = useState({
    processing: service.basePrice * 0.05,
    tax: service.basePrice * 0.18,
    insurance: 299
  });

  useEffect(() => {
    const total = service.basePrice + fees.processing + fees.tax + fees.insurance;
    setTotalPrice(total);
  }, [service.basePrice, fees]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getServiceIcon = () => {
    switch (service.type) {
      case 'tour': return '🎭';
      case 'visa': return '📋';
      case 'ticket': return '🎫';
      case 'package': return '📦';
      case 'ok-to-board': return '✈️';
      default: return '🏷️';
    }
  };

  const getServiceTypeLabel = () => {
    switch (service.type) {
      case 'tour': return 'Tour Booking';
      case 'visa': return 'Visa Application';
      case 'ticket': return 'Ticket Booking';
      case 'package': return 'Package Booking';
      case 'ok-to-board': return 'Ok to Board Service';
      default: return 'Service Booking';
    }
  };

  if (!isVisible) return null;

  const cardClass = position === 'popup' 
    ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 shadow-2xl animate-scale-in'
    : 'sticky top-4 shadow-xl';

  return (
    <Card className={cardClass}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{getServiceIcon()}</span>
          Booking Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Service Details */}
        <div className="space-y-3">
          <div>
            <Badge variant="outline" className="mb-2">
              {getServiceTypeLabel()}
            </Badge>
            <h3 className="font-semibold text-gray-900 leading-tight">
              {service.title}
            </h3>
          </div>

          {service.destination && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {service.destination}
            </div>
          )}

          {service.date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {service.date}
            </div>
          )}

          {service.travelers && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              {service.travelers} Traveler{service.travelers > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Price Breakdown</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span>{formatPrice(service.basePrice)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Processing Fee:</span>
              <span>{formatPrice(fees.processing)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Tax & GST:</span>
              <span>{formatPrice(fees.tax)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Travel Insurance:</span>
              <span>{formatPrice(fees.insurance)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold text-blue-900">
            <span>Total Amount:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800 text-sm">
            <Check className="h-4 w-4" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-green-700 text-xs mt-1">
            SSL encrypted & protected by industry standards
          </p>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">We accept</p>
          <div className="flex justify-center items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-600">
              Cards • UPI • Net Banking • Wallets
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;