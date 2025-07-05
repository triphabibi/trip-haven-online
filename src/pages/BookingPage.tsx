
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UnifiedBookingForm from '@/components/booking/UnifiedBookingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/useTours';
import { usePackage } from '@/hooks/usePackages';
import { useTicket } from '@/hooks/useTickets';
import { useVisa } from '@/hooks/useVisas';
import Loading from '@/components/common/Loading';
import { ArrowLeft } from 'lucide-react';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const serviceType = searchParams.get('type') as 'tour' | 'package' | 'ticket' | 'visa' | 'transfer' || 'tour';
  const serviceId = searchParams.get('id') || '';

  const { data: tour, isLoading: tourLoading } = useTour(serviceType === 'tour' ? serviceId : '');
  const { data: packageData, isLoading: packageLoading } = usePackage(serviceType === 'package' ? serviceId : '');
  const { data: ticket, isLoading: ticketLoading } = useTicket(serviceType === 'ticket' ? serviceId : '');
  const { data: visa, isLoading: visaLoading } = useVisa(serviceType === 'visa' ? serviceId : '');

  const isLoading = tourLoading || packageLoading || ticketLoading || visaLoading;

  const getServiceData = () => {
    switch (serviceType) {
      case 'tour':
        return tour ? {
          title: tour.title,
          priceAdult: tour.price_adult,
          priceChild: tour.price_child,
          priceInfant: tour.price_infant,
          availableTimes: tour.available_times,
          languages: tour.languages,
          requiresPickup: true
        } : null;
      case 'package':
        return packageData ? {
          title: packageData.title,
          priceAdult: packageData.price_adult,
          priceChild: packageData.price_child,
          priceInfant: packageData.price_infant,
          availableTimes: packageData.available_times,
          languages: packageData.languages,
          requiresPickup: true
        } : null;
      case 'ticket':
        return ticket ? {
          title: ticket.title,
          priceAdult: ticket.price_adult,
          priceChild: ticket.price_child || 0,
          priceInfant: ticket.price_infant || 0,
          availableTimes: ticket.available_times,
          languages: ticket.languages,
          requiresPickup: false
        } : null;
      case 'visa':
        return visa ? {
          title: `${visa.country} - ${visa.visa_type}`,
          priceAdult: visa.price,
          priceChild: 0,
          priceInfant: 0,
          requiresPickup: false
        } : null;
      default:
        return null;
    }
  };

  const serviceData = getServiceData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <Loading message="Loading service details..." />
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <div className="w-full px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle>Service Not Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">The service you're trying to book could not be found.</p>
                <Button onClick={() => navigate(-1)} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      
      <main className="w-full px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Service
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Fill in your details and proceed to payment</p>
          </div>

          {/* Booking Form */}
          <div className="flex justify-center">
            <UnifiedBookingForm
              serviceType={serviceType}
              serviceId={serviceId}
              serviceTitle={serviceData.title}
              priceAdult={serviceData.priceAdult}
              priceChild={serviceData.priceChild}
              priceInfant={serviceData.priceInfant}
              availableTimes={serviceData.availableTimes}
              languages={serviceData.languages}
              requiresPickup={serviceData.requiresPickup}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
