import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, Ticket, CreditCard, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const [usersCount, bookingsData, servicesData] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('bookings').select('*, services(title, service_type)').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
      ]);

      const totalRevenue = bookingsData.data?.reduce((sum, booking) => sum + Number(booking.final_amount || 0), 0) || 0;
      const pendingBookings = bookingsData.data?.filter(b => b.booking_status === 'pending').length || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue,
        pendingBookings,
      });

      setBookings(bookingsData.data || []);
      setServices(servicesData.data || []);
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

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
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

      fetchAdminData();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !isActive })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Service ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your travel business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Manage customer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.services?.title}</p>
                        <p className="text-sm text-gray-600">Ref: {booking.booking_reference}</p>
                        <p className="text-sm text-gray-600">${booking.final_amount}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          booking.booking_status === 'confirmed' ? 'bg-green-500' :
                          booking.booking_status === 'pending' ? 'bg-yellow-500' :
                          booking.booking_status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                        }>
                          {booking.booking_status}
                        </Badge>
                        {booking.booking_status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services Management</CardTitle>
                <CardDescription>Manage your tour packages and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-gray-600">{service.service_type} - ${service.price}</p>
                        <p className="text-sm text-gray-600">{service.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={service.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleServiceStatus(service.id, service.is_active)}
                        >
                          {service.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
