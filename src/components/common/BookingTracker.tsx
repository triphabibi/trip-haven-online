import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Users, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface Booking {
  id: string;
  booking_reference: string;
  service_title: string;
  service_type: string;
  customer_name: string;
  customer_email: string;
  travel_date: string | null;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  adults_count: number;
  children_count: number;
  infants_count: number;
}

const BookingTracker = () => {
  const [bookingRef, setBookingRef] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const handleSearch = async () => {
    if (!bookingRef.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your booking reference",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('new_bookings')
        .select('*')
        .eq('booking_reference', bookingRef.trim())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Booking Not Found",
          description: "No booking found with this reference number",
          variant: "destructive",
        });
        setBooking(null);
        return;
      }

      // If email is provided, verify it matches
      if (email.trim() && data.customer_email !== email.trim()) {
        toast({
          title: "Email Mismatch",
          description: "The email doesn't match our records for this booking",
          variant: "destructive",
        });
        setBooking(null);
        return;
      }

      setBooking(data);
      toast({
        title: "Booking Found!",
        description: "Your booking details are displayed below",
      });
    } catch (error) {
      console.error('Booking search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search for booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Your Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Booking Reference *
              </label>
              <Input
                placeholder="Enter booking reference (e.g., TH1234567890)"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                className="uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address (optional)
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? 'Searching...' : 'Track Booking'}
          </Button>
        </CardContent>
      </Card>

      {/* Booking Details Card */}
      {booking && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Booking Details
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getStatusColor(booking.booking_status)}>
                  {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                </Badge>
                <Badge className={getPaymentStatusColor(booking.payment_status)}>
                  Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Reference</label>
                  <p className="font-mono text-lg font-semibold">{booking.booking_reference}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Service</label>
                  <p className="font-medium">{booking.service_title}</p>
                  <Badge variant="outline" className="mt-1">
                    {booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer</label>
                  <p className="font-medium">{booking.customer_name}</p>
                  <p className="text-sm text-gray-600">{booking.customer_email}</p>
                </div>
              </div>

              <div className="space-y-3">
                {booking.travel_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Travel Date</label>
                      <p className="font-medium">
                        {new Date(booking.travel_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Travelers</label>
                    <p className="font-medium">
                      {booking.adults_count} Adult{booking.adults_count > 1 ? 's' : ''}
                      {booking.children_count > 0 && `, ${booking.children_count} Child${booking.children_count > 1 ? 'ren' : ''}`}
                      {booking.infants_count > 0 && `, ${booking.infants_count} Infant${booking.infants_count > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(booking.total_amount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Booking Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {booking.payment_status === 'completed' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Payment Completed</p>
                      <p className="text-sm text-gray-600">Payment received successfully</p>
                    </div>
                  </div>
                )}
                
                {booking.booking_status === 'confirmed' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Booking Confirmed</p>
                      <p className="text-sm text-gray-600">Your booking has been confirmed</p>
                    </div>
                  </div>
                )}
                
                {booking.booking_status === 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Awaiting Confirmation</p>
                      <p className="text-sm text-gray-600">We're processing your booking</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-800 mb-2">
                If you have any questions about your booking, please contact our support team.
              </p>
              <div className="text-sm text-blue-800">
                <p>📧 Email: info@triphabibi.in</p>
                <p>📞 Phone: +971 50 123 4567</p>
                <p>💬 WhatsApp: +971 50 123 4567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingTracker;