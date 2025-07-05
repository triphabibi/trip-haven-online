
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/useTours';
import { usePackage } from '@/hooks/usePackages';
import { useTicket } from '@/hooks/useTickets';
import { useVisa } from '@/hooks/useVisas';
import Loading from '@/components/common/Loading';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceType = searchParams.get('type') || 'general';
  const serviceId = searchParams.get('id') || 'sample-service-id';

  const { data: tour, isLoading: tourLoading } = useTour(serviceType === 'tour' ? serviceId : '');
  const { data: packageData, isLoading: packageLoading } = usePackage(serviceType === 'package' ? serviceId : '');
  const { data: ticket, isLoading: ticketLoading } = useTicket(serviceType === 'ticket' ? serviceId : '');
  const { data: visa, isLoading: visaLoading } = useVisa(serviceType === 'visa' ? serviceId : '');

  const isLoading = tourLoading || packageLoading || ticketLoading || visaLoading;

  // Get booking details from URL params
  const bookingDetails = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    mobile: searchParams.get('mobile') || '',
    amount: parseFloat(searchParams.get('amount') || '0'),
    adults: parseInt(searchParams.get('adults') || '1'),
    children: parseInt(searchParams.get('children') || '0'),
    infants: parseInt(searchParams.get('infants') || '0'),
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
  };

  useEffect(() => {
    // If we have all required booking details, redirect directly to payment
    if (bookingDetails.name && bookingDetails.email && bookingDetails.amount > 0) {
      // Simulate payment gateway redirect
      setTimeout(() => {
        alert(`Redirecting to payment gateway for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(bookingDetails.amount)}`);
        // In real implementation, redirect to actual payment gateway
        navigate('/payment-success');
      }, 1000);
    }
  }, [bookingDetails, navigate]);

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
        <Loading message="Processing booking..." />
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

  // If we have booking details, show processing message
  if (bookingDetails.name && bookingDetails.email) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle>Processing Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <h2 className="text-xl font-semibold">{serviceData.title}</h2>
                  <p className="text-gray-600">Redirecting to secure payment gateway...</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(bookingDetails.amount)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // For tickets, use the specialized booking form
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

  // Fallback - redirect back to service page
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardHeader>
              <CardTitle>Booking Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Please fill out the booking form first.</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;
