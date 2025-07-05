
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import PaymentGatewaySelector from '@/components/common/PaymentGatewaySelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTour } from '@/hooks/useTours';
import { usePackage } from '@/hooks/usePackages';
import { useTicket } from '@/hooks/useTickets';
import { useVisa } from '@/hooks/useVisas';
import Loading from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const serviceType = searchParams.get('type') || 'general';
  const serviceId = searchParams.get('id') || 'sample-service-id';
  const [selectedGateway, setSelectedGateway] = useState('');
  const [showGatewaySelector, setShowGatewaySelector] = useState(false);

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

  const handleProceedToPayment = () => {
    if (!selectedGateway) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment processing based on selected gateway
    if (selectedGateway === 'razorpay') {
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_9WaeLLJnOFJCBz', // Replace with your Razorpay key
        amount: bookingDetails.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'TripHabibi',
        description: serviceData?.title || 'Booking Payment',
        handler: function (response: any) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          navigate('/booking-confirmation?status=success');
        },
        prefill: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          contact: bookingDetails.mobile,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } else if (selectedGateway === 'cash_on_arrival') {
      toast({
        title: "Booking Confirmed",
        description: "Your booking has been confirmed. You can pay later.",
      });
      navigate('/booking-confirmation?status=success');
    } else {
      // For other gateways, show a placeholder
      toast({
        title: "Payment Gateway",
        description: `Redirecting to ${selectedGateway} payment gateway...`,
      });
      setTimeout(() => {
        navigate('/booking-confirmation?status=success');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <Loading message="Processing booking..." />
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="w-full px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600">The service you're trying to book could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // For tickets, use the specialized booking form
  if (serviceType === 'ticket' && ticket) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        
        <div className="w-full px-4 py-8">
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

  // Show payment gateway selector if we have booking details
  if (bookingDetails.name && bookingDetails.email && bookingDetails.amount > 0) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        
        <div className="w-full px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
              <p className="text-gray-600">Choose your preferred payment method</p>
            </div>

            {/* Booking Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{serviceData.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Adults: {bookingDetails.adults}</p>
                      {bookingDetails.children > 0 && <p>Children: {bookingDetails.children}</p>}
                      {bookingDetails.infants > 0 && <p>Infants: {bookingDetails.infants}</p>}
                      {bookingDetails.date && <p>Date: {bookingDetails.date}</p>}
                      {bookingDetails.time && <p>Time: {bookingDetails.time}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Contact Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Name: {bookingDetails.name}</p>
                      <p>Email: {bookingDetails.email}</p>
                      <p>Mobile: {bookingDetails.mobile}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(bookingDetails.amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Gateway Selector */}
            <PaymentGatewaySelector
              onGatewaySelect={setSelectedGateway}
              onProceedToPayment={handleProceedToPayment}
              selectedGateway={selectedGateway}
              amount={bookingDetails.amount}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Fallback - redirect back to service page
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      
      <div className="w-full px-4 py-8">
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
