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
      case 'ticket': return 'Ticket Booking';
      case 'transfer': return 'Transfer Service';
      case 'ok-to-board': return 'Ok to Board Service';
      default: return 'Service Booking';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <span className="text-2xl">{getServiceIcon(bookingData.type)}</span>
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-blue-100 text-sm">Service Type</p>
                    <p className="font-semibold">{getServiceTypeLabel(bookingData.type)}</p>
                  </div>
                  
                  {bookingData.serviceTitle && (
                    <div>
                      <p className="text-blue-100 text-sm">Service</p>
                      <p className="font-semibold">{bookingData.serviceTitle}</p>
                    </div>
                  )}
                  
                  <Separator className="bg-blue-400" />
                  
                  <div>
                    <p className="text-blue-100 text-sm">Customer</p>
                    <p className="font-semibold">{bookingData.customerName}</p>
                    <p className="text-blue-200 text-sm">{bookingData.customerEmail}</p>
                    {bookingData.customerPhone && (
                      <p className="text-blue-200 text-sm">{bookingData.customerPhone}</p>
                    )}
                  </div>
                  
                  <Separator className="bg-blue-400" />
                  
                  <div>
                    <p className="text-blue-100 text-sm">Booking ID</p>
                    <Badge variant="outline" className="border-blue-300 text-blue-100">
                      {bookingData.bookingId}
                    </Badge>
                  </div>
                  
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-blue-100">Total Amount</p>
                      <p className="text-2xl font-bold">{formatPrice(bookingData.amount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Gateway Selection */}
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

          {/* Security Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p>Your payment is secured with bank-level encryption</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPaymentPage;