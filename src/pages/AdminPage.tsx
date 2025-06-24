
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

const AdminPage = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes, promoCodesRes] = await Promise.all([
        supabase.from('bookings').select(`
          *,
          services (title, service_type),
          profiles (full_name, email)
        `).order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
        supabase.from('promo_codes').select('*').order('created_at', { ascending: false })
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (promoCodesRes.error) throw promoCodesRes.error;

      setBookings(bookingsRes.data || []);
      setServices(servicesRes.data || []);
      setPromoCodes(promoCodesRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (bookingId: string, status: PaymentStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage bookings, services, and promo codes</p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
            <TabsTrigger value="promocodes">Promo Codes ({promoCodes.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {booking.services?.title} - {booking.booking_reference}
                      </CardTitle>
                      <CardDescription>
                        Customer: {booking.profiles?.full_name} ({booking.profiles?.email})
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${booking.final_amount}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Travelers:</strong> {booking.traveler_count}</p>
                      <p><strong>Travel Date:</strong> {booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : 'Not specified'}</p>
                      <p><strong>Created:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Booking Status:</label>
                        <div className="flex gap-2">
                          <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.booking_status}
                          </Badge>
                          <select 
                            value={booking.booking_status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatus)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Status:</label>
                        <div className="flex gap-2">
                          <Badge variant={booking.payment_status === 'completed' ? 'default' : 'secondary'}>
                            {booking.payment_status}
                          </Badge>
                          <select 
                            value={booking.payment_status}
                            onChange={(e) => updatePaymentStatus(booking.id, e.target.value as PaymentStatus)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {booking.special_requests && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Special Requests:</h4>
                      <p className="text-gray-600">{booking.special_requests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.service_type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600 mb-2">${service.price}</p>
                    <p className="text-sm text-gray-600 mb-2">{service.location}</p>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="promocodes" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promoCodes.map((promo) => (
                <Card key={promo.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{promo.code}</CardTitle>
                    <CardDescription>
                      {promo.discount_percentage}% discount
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      Uses: {promo.current_uses}/{promo.max_uses}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Valid until: {new Date(promo.valid_until).toLocaleDateString()}
                    </p>
                    <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
