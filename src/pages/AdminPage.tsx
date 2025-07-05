import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, CreditCard, TrendingUp, Settings as SettingsIcon, Ticket, Car } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BulkUpload from '@/components/admin/BulkUpload';
import SystemSettings from '@/components/admin/SystemSettings';
import EnhancedTourManagement from '@/components/admin/EnhancedTourManagement';
import BookingManagement from '@/components/admin/BookingManagement';
import PaymentGatewaySettings from '@/components/admin/PaymentGatewaySettings';
import EmailSettings from '@/components/admin/EmailSettings';
import EnhancedVisaManagement from '@/components/admin/EnhancedVisaManagement';
import TicketManagement from '@/components/admin/TicketManagement';
import PackageManagement from '@/components/admin/PackageManagement';

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [
        usersCount,
        bookingsData,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('new_bookings').select('*').order('created_at', { ascending: false }),
      ]);

      const totalRevenue = bookingsData.data?.reduce((sum, booking) => sum + Number(booking.final_amount || 0), 0) || 0;
      const pendingBookings = bookingsData.data?.filter(b => b.booking_status === 'pending').length || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue,
        pendingBookings,
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading admin dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your travel business with ease</p>
            <p className="text-sm text-gray-500 mt-1">Logged in as: {user?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline" size="lg">
            Sign Out
          </Button>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <Package className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Bookings</p>
                  <p className="text-3xl font-bold">{stats.pendingBookings}</p>
                </div>
                <CreditCard className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card className="shadow-lg bg-white border border-gray-200">
          <Tabs defaultValue="tours" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-gray-100 border-b border-gray-200">
              <TabsTrigger value="tours" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-white text-gray-700">Tours</TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-white text-gray-700">Tickets</TabsTrigger>
              <TabsTrigger value="packages" className="data-[state=active]:bg-green-500 data-[state=active]:text-white bg-white text-gray-700">Packages</TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white bg-white text-gray-700">Bookings</TabsTrigger>
              <TabsTrigger value="visas" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white bg-white text-gray-700">Visas</TabsTrigger>
              <TabsTrigger value="transfers" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white bg-white text-gray-700">Transfers</TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-red-500 data-[state=active]:text-white bg-white text-gray-700">Payments</TabsTrigger>
              <TabsTrigger value="emails" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white bg-white text-gray-700">Emails</TabsTrigger>
              <TabsTrigger value="bulk" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white bg-white text-gray-700">Bulk Upload</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white bg-white text-gray-700">Settings</TabsTrigger>
            </TabsList>

            <div className="p-6 bg-white border-t border-gray-200">
              <TabsContent value="tours" className="mt-0">
                <EnhancedTourManagement />
              </TabsContent>

              <TabsContent value="tickets" className="mt-0">
                <TicketManagement />
              </TabsContent>

              <TabsContent value="packages" className="mt-0">
                <PackageManagement />
              </TabsContent>

              <TabsContent value="bookings" className="mt-0">
                <BookingManagement />
              </TabsContent>

              <TabsContent value="visas" className="mt-0">
                <EnhancedVisaManagement />
              </TabsContent>

              <TabsContent value="transfers" className="mt-0">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer Management</h3>
                      <p className="text-gray-500">Transfer management coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-0">
                <PaymentGatewaySettings />
              </TabsContent>

              <TabsContent value="emails" className="mt-0">
                <EmailSettings />
              </TabsContent>

              <TabsContent value="bulk" className="mt-0">
                <BulkUpload />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SystemSettings />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
