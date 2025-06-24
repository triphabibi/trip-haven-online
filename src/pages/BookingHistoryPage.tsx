
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, DollarSign, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (title, service_type, location),
          booking_travelers (full_name, age)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load booking history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'refunded': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">View and manage your travel bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No bookings found. Start exploring our services!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {booking.services?.title}
                        <Badge className={`${getStatusColor(booking.booking_status)} text-white`}>
                          {booking.booking_status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Booking Reference: {booking.booking_reference}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${booking.final_amount}
                      </div>
                      <Badge className={`${getPaymentStatusColor(booking.payment_status)} text-white`}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.services?.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{booking.traveler_count} travelers</span>
                      </div>
                      {booking.travel_date && (
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>Total: ${booking.total_amount}</span>
                      </div>
                      {booking.discount_amount > 0 && (
                        <div className="flex items-center text-sm text-green-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>Discount: -${booking.discount_amount}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Booked on: {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {booking.booking_travelers && booking.booking_travelers.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Travelers:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {booking.booking_travelers.map((traveler: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            {traveler.full_name} {traveler.age && `(${traveler.age} years)`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
