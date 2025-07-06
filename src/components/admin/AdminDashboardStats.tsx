
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Package, 
  CreditCard,
  Globe,
  FileText,
  Ticket,
  Plane
} from 'lucide-react';

const AdminDashboardStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    totalTours: 0,
    totalVisas: 0,
    totalPackages: 0,
    totalTickets: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        bookingsData,
        toursData,
        visasData,
        packagesData,
        ticketsData
      ] = await Promise.all([
        supabase.from('new_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('tours').select('id', { count: 'exact' }),
        supabase.from('visa_services').select('id', { count: 'exact' }),
        supabase.from('tour_packages').select('id', { count: 'exact' }),
        supabase.from('attraction_tickets').select('id', { count: 'exact' })
      ]);

      const totalRevenue = bookingsData.data?.reduce((sum, booking) => 
        sum + Number(booking.final_amount || 0), 0) || 0;
      
      const pendingBookings = bookingsData.data?.filter(b => 
        b.booking_status === 'pending').length || 0;

      setStats({
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue,
        pendingBookings,
        totalTours: toursData.count || 0,
        totalVisas: visasData.count || 0,
        totalPackages: packagesData.count || 0,
        totalTickets: ticketsData.count || 0,
        recentBookings: bookingsData.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `AED ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings.toString(),
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Tours',
      value: stats.totalTours.toString(),
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Visas',
      value: stats.totalVisas.toString(),
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Packages',
      value: stats.totalPackages.toString(),
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Tickets',
      value: stats.totalTickets.toString(),
      icon: Ticket,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{booking.service_title}</p>
                    <p className="text-sm text-gray-600">{booking.customer_name} • {booking.customer_email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={booking.payment_status === 'completed' ? 'default' : 'secondary'}>
                      {booking.payment_status}
                    </Badge>
                    <p className="font-bold text-green-600">AED {booking.final_amount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent bookings</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardStats;
