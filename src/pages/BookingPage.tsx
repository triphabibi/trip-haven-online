
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import ProfessionalBookingFlow from '@/components/booking/ProfessionalBookingFlow';
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
          id: tour.id,
          title: tour.title,
          priceAdult: tour.price_adult,
          priceChild: tour.price_child,
          priceInfant: tour.price_infant,
          image: tour.featured_image,
          description: tour.description
        } : null;
      case 'package':
        return packageData ? {
          id: packageData.id,
          title: packageData.title,
          priceAdult: packageData.price_adult,
          priceChild: packageData.price_child,
          priceInfant: packageData.price_infant,
          image: packageData.image_urls?.[0] || '/placeholder.svg',
          description: packageData.description
        } : null;
      case 'ticket':
        return ticket ? {
          id: ticket.id,
          title: ticket.title,
          priceAdult: ticket.price_adult,
          priceChild: ticket.price_child || 0,
          priceInfant: ticket.price_infant || 0,
          image: ticket.image_urls?.[0] || '/placeholder.svg',
          description: ticket.description
        } : null;
      case 'visa':
        return visa ? {
          id: visa.id,
          title: `${visa.country} - ${visa.visa_type}`,
          priceAdult: visa.price,
          priceChild: 0,
          priceInfant: 0,
          image: visa.image_urls?.[0] || '/placeholder.svg',
          description: visa.description
        } : null;
      case 'transfer':
        return {
          id: 'transfer-service',
          title: 'Transfer Service',
          priceAdult: 150,
          priceChild: 0,
          priceInfant: 0,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
          description: 'Professional transfer service'
        };
      default:
        return {
          id: 'general-service',
          title: 'General Service',
          priceAdult: 1000,
          priceChild: 0,
          priceInfant: 0,
          image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
          description: 'Professional service booking'
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

  // Use professional booking flow for other services
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{serviceData.title}</CardTitle>
                <p className="text-gray-600">{serviceData.description}</p>
              </CardHeader>
              <CardContent>
                {serviceData.image && (
                  <img
                    src={serviceData.image}
                    alt={serviceData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <ProfessionalBookingFlow
            bookingData={{
              serviceId: serviceData.id,
              serviceType: serviceType,
              serviceTitle: serviceData.title,
              priceAdult: serviceData.priceAdult,
              priceChild: serviceData.priceChild,
              priceInfant: serviceData.priceInfant
            }}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
