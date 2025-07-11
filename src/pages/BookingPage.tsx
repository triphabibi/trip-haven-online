
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
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
          price_adult: tour.price_adult,
          price_child: tour.price_child,
          price_infant: tour.price_infant,
          type: 'tour' as const,
          overview: tour.overview,
          highlights: tour.highlights,
          whats_included: tour.whats_included,
          exclusions: tour.exclusions,
          itinerary: tour.itinerary,
          duration: tour.duration,
          location: tour.location,
          cancellation_policy: tour.cancellation_policy,
          terms_conditions: tour.terms_conditions
        } : null;
      case 'package':
        return packageData ? {
          id: packageData.id,
          title: packageData.title,
          price_adult: packageData.price_adult,
          price_child: packageData.price_child,
          price_infant: packageData.price_infant,
          type: 'package' as const,
          overview: packageData.overview || packageData.description,
          highlights: packageData.highlights,
          whats_included: packageData.whats_included,
          exclusions: packageData.exclusions,
          itinerary: packageData.itinerary,
          location: packageData.location,
          cancellation_policy: packageData.cancellation_policy,
          terms_conditions: packageData.terms_conditions
        } : null;
      case 'ticket':
        return ticket ? {
          id: ticket.id,
          title: ticket.title,
          price_adult: ticket.price_adult,
          price_child: ticket.price_child || 0,
          price_infant: ticket.price_infant || 0,
          type: 'ticket' as const,
          overview: ticket.overview || ticket.description,
          highlights: ticket.highlights,
          whats_included: ticket.whats_included,
          exclusions: ticket.exclusions,
          location: ticket.location,
          cancellation_policy: ticket.cancellation_policy,
          terms_conditions: ticket.terms_conditions
        } : null;
      case 'visa':
        return visa ? {
          id: visa.id,
          title: `${visa.country} - ${visa.visa_type}`,
          price_adult: visa.price,
          price_child: 0,
          price_infant: 0,
          type: 'visa' as const,
          overview: visa.overview || visa.description,
          highlights: visa.highlights,
          whats_included: visa.whats_included,
          exclusions: visa.exclusions,
          cancellation_policy: visa.cancellation_policy,
          terms_conditions: visa.terms_conditions
        } : null;
      default:
        return null;
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

  // Use streamlined booking flow for all other services
  return (
    <SinglePageBookingFlow
      service={serviceData}
      onBack={() => window.history.back()}
    />
  );
};

export default BookingPage;
