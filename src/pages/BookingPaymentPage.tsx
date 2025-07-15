import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PaymentGatewaySelector } from '@/components/checkout/PaymentGatewaySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';

const BookingPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const bookingData = {
    type: searchParams.get('type') || 'general',
    serviceId: searchParams.get('id') || '',
    bookingId: searchParams.get('bookingId') || '',
    amount: parseFloat(searchParams.get('amount') || '0'),
    customerName: searchParams.get('customerName') || '',
    customerEmail: searchParams.get('customerEmail') || '',
    customerPhone: searchParams.get('customerPhone') || '',
    serviceTitle: searchParams.get('serviceTitle') || ''
  };

  const handlePaymentSuccess = (response: any) => {
    navigate(`/booking-confirmation?bookingId=${bookingData.bookingId}&status=success`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'tour': return '🗺️';
      case 'package': return '📦';
      case 'visa': return '🛂';
      case 'ticket': return '🎫';
      case 'transfer': return '🚗';
      case 'ok-to-board': return '✈️';
      default: return '📋';
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'tour': return 'Tour Booking';
      case 'package': return 'Package Booking';
      case 'visa': return 'Visa Service';
      case 'ticket': return 'Attraction Ticket';
      case 'transfer': return 'Transfer Service';
      case 'ok-to-board': return 'Ok to Board Service';
      default: return 'Service Booking';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure checkout for your booking</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getServiceIcon(bookingData.type)}</span>
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {getServiceTypeLabel(bookingData.type)}
                  </Badge>
                  <h3 className="font-semibold text-lg">{bookingData.serviceTitle || 'Service Booking'}</h3>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{bookingData.customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{bookingData.customerEmail}</span>
                  </div>
                  {bookingData.customerPhone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{bookingData.customerPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium font-mono">{bookingData.bookingId}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(bookingData.amount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure SSL Encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Gateway */}
          <div className="lg:col-span-2">
          <PaymentGatewaySelector
            amount={bookingData.amount}
            bookingId={bookingData.bookingId}
            customerName={bookingData.customerName}
            customerEmail={bookingData.customerEmail}
            customerPhone={bookingData.customerPhone}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPaymentPage;