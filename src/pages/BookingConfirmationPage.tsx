
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Calendar, Users, MapPin, Clock, Phone, Mail } from 'lucide-react';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // Fetch booking details
      const { data: bookingData, error: bookingError } = await supabase
        .from('new_bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      setBooking(bookingData);

      // Fetch service details based on booking type
      let serviceData = null;
      if (bookingData.booking_type === 'tour') {
        const { data } = await supabase
          .from('tours')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        serviceData = data;
      } else if (bookingData.booking_type === 'package') {
        const { data } = await supabase
          .from('tour_packages')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        serviceData = data;
      } else if (bookingData.booking_type === 'ticket') {
        const { data } = await supabase
          .from('attraction_tickets')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        serviceData = data;
      } else if (bookingData.booking_type === 'visa') {
        const { data } = await supabase
          .from('visa_services')
          .select('*')
          .eq('id', bookingData.service_id)
          .single();
        serviceData = data;
      }

      setService(serviceData);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = () => {
    // This would generate and download a PDF invoice
    // For now, we'll just show a toast
    console.log('Download invoice for booking:', booking?.booking_reference);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your booking reference is: <span className="font-bold text-blue-600">{booking.booking_reference}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{service?.title}</h3>
                <Badge className="capitalize">{booking.booking_type}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Booking Reference</div>
                  <div className="font-medium">{booking.booking_reference}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.booking_status}
                  </Badge>
                </div>
                {booking.travel_date && (
                  <div>
                    <div className="text-gray-500">Travel Date</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(booking.travel_date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {booking.selected_time && (
                  <div>
                    <div className="text-gray-500">Time</div>
                    <div className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {booking.selected_time}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500">Group Size</div>
                  <div className="font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.adults_count} Adults
                    {booking.children_count > 0 && `, ${booking.children_count} Children`}
                    {booking.infants_count > 0 && `, ${booking.infants_count} Infants`}
                  </div>
                </div>
                {booking.pickup_location && (
                  <div className="col-span-2">
                    <div className="text-gray-500">Pickup Location</div>
                    <div className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.pickup_location}
                    </div>
                  </div>
                )}
                {booking.selected_language && (
                  <div>
                    <div className="text-gray-500">Language</div>
                    <div className="font-medium">{booking.selected_language}</div>
                  </div>
                )}
              </div>

              {booking.special_requests && (
                <div>
                  <div className="text-gray-500 text-sm">Special Requests</div>
                  <div className="text-sm bg-gray-50 p-2 rounded">{booking.special_requests}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer & Payment */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-gray-500 text-sm">Name</div>
                  <div className="font-medium">{booking.customer_name}</div>
                </div>
                {booking.customer_email && (
                  <div>
                    <div className="text-gray-500 text-sm">Email</div>
                    <div className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {booking.customer_email}
                    </div>
                  </div>
                )}
                {booking.customer_phone && (
                  <div>
                    <div className="text-gray-500 text-sm">Phone</div>
                    <div className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {booking.customer_phone}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{booking.total_amount.toLocaleString()}</span>
                </div>
                {booking.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>₹{booking.final_amount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Payment Status: 
                  <Badge variant={booking.payment_status === 'completed' ? 'default' : 'secondary'} className="ml-1">
                    {booking.payment_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={downloadInvoice} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
          <Link to="/tours">
            <Button>Book Another Tour</Button>
          </Link>
        </div>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>• A confirmation email has been sent to your registered email address.</p>
              <p>• Please arrive at the pickup location 15 minutes before the scheduled time.</p>
              <p>• Carry a valid ID proof and this booking confirmation.</p>
              <p>• For any changes or cancellations, please contact our support team.</p>
              <p>• Weather conditions may affect the tour schedule.</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
