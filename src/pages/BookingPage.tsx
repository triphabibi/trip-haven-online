
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import GuestBookingForm from '@/components/booking/GuestBookingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTour } from '@/hooks/useTours';
import { usePackage } from '@/hooks/usePackages';
import { useTicket } from '@/hooks/useTickets';
import { useVisa } from '@/hooks/useVisas';
import Loading from '@/components/common/Loading';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type') || 'general';
  const serviceId = searchParams.get('id') || 'sample-service-id';

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
          priceInfant: tour.price_infant
        } : null;
      case 'package':
        return packageData ? {
          title: packageData.title,
          priceAdult: packageData.price_adult,
          priceChild: packageData.price_child,
          priceInfant: packageData.price_infant
        } : null;
      case 'ticket':
        return ticket ? {
          title: ticket.title,
          priceAdult: ticket.price_adult,
          priceChild: ticket.price_child || 0,
          priceInfant: ticket.price_infant || 0
        } : null;
      case 'visa':
        return visa ? {
          title: `${visa.country} - ${visa.visa_type}`,
          priceAdult: visa.price,
          priceChild: 0,
          priceInfant: 0
        } : null;
      case 'transfer':
        return {
          title: 'Transfer Service',
          priceAdult: 150,
          priceChild: 0,
          priceInfant: 0
        };
      default:
        return {
          title: 'General Service',
          priceAdult: 1000,
          priceChild: 0,
          priceInfant: 0
        };
    }
  };

  const serviceData = getServiceData();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loading message="Loading booking details..." />
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600">The service you're trying to book could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use simplified ticket booking form for tickets
  if (serviceType === 'ticket' && ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {ticket.title}
                    </CardTitle>
                    <p className="text-gray-600">{ticket.location}</p>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={ticket.image_urls?.[0] || 'https://images.unsplash.com/photo-1564053489984-317bbd824340?w=800'}
                      alt={ticket.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-700">{ticket.description}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <SimpleTicketBooking ticket={ticket} />
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Use regular booking form for other services
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
              <p className="text-gray-600">Service: {serviceData.title}</p>
            </CardHeader>
            <CardContent>
              <GuestBookingForm
                serviceId={serviceId}
                serviceType={serviceType}
                serviceTitle={serviceData.title}
                priceAdult={serviceData.priceAdult}
                priceChild={serviceData.priceChild}
                priceInfant={serviceData.priceInfant}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
