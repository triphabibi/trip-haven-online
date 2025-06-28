
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('new_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('new_bookings')
        .update({ booking_status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToExcel = () => {
    // Simple CSV export
    const csvContent = [
      ['Reference', 'Customer', 'Email', 'Phone', 'Amount', 'Status', 'Date'].join(','),
      ...filteredBookings.map(booking => [
        booking.booking_reference,
        booking.customer_name,
        booking.customer_email || '',
        booking.customer_phone || '',
        booking.final_amount,
        booking.booking_status,
        new Date(booking.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Bookings exported successfully",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{booking.customer_name}</h3>
                    <Badge 
                      variant={
                        booking.booking_status === 'confirmed' ? 'default' :
                        booking.booking_status === 'pending' ? 'secondary' :
                        booking.booking_status === 'cancelled' ? 'destructive' : 'outline'
                      }
                    >
                      {booking.booking_status}
                    </Badge>
                    <Badge 
                      variant={
                        booking.payment_status === 'completed' ? 'default' :
                        booking.payment_status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {booking.payment_status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Reference:</span> {booking.booking_reference}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ₹{booking.final_amount}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {booking.customer_email || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {booking.customer_phone || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Adults:</span> {booking.adults_count}
                    </div>
                    <div>
                      <span className="font-medium">Children:</span> {booking.children_count}
                    </div>
                    <div>
                      <span className="font-medium">Travel Date:</span> {booking.travel_date || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Pickup:</span> {booking.pickup_location || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.booking_status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.booking_status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingManagement;
