import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BookingFilters from './booking/BookingFilters';
import EnhancedBookingTable from './booking/EnhancedBookingTable';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface UnifiedBooking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_type: string;
  service_title: string;
  total_amount: number;
  final_amount: number;
  payment_method?: string;
  payment_gateway?: string;
  booking_status: BookingStatus;
  payment_status?: string;
  created_at: string;
  travel_date?: string;
  special_requests?: string;
  pickup_location?: string;
  payment_reference?: string;
  gateway_response?: any;
  // Additional fields for enhanced functionality
  admin_notes?: string;
  proof_of_payment?: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log('📋 [BOOKING-MANAGEMENT] Fetching all bookings from new_bookings table');
      
      // Fetch from new_bookings table (primary booking table)
      const { data: newBookings, error: newBookingsError } = await supabase
        .from('new_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (newBookingsError) {
        console.error('❌ [BOOKING-MANAGEMENT] Error fetching new_bookings:', newBookingsError);
        throw newBookingsError;
      }

      console.log(`✅ [BOOKING-MANAGEMENT] Fetched ${newBookings?.length || 0} bookings from new_bookings`);

      // Transform bookings to unified format
      const unifiedBookings: UnifiedBooking[] = (newBookings || []).map(booking => ({
        id: booking.id,
        booking_reference: booking.booking_reference,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        service_type: booking.service_type,
        service_title: booking.service_title,
        total_amount: booking.total_amount,
        final_amount: booking.final_amount,
        payment_method: booking.payment_method,
        payment_gateway: booking.payment_gateway,
        booking_status: booking.booking_status as BookingStatus,
        payment_status: booking.payment_status,
        created_at: booking.created_at,
        travel_date: booking.travel_date,
        special_requests: booking.special_requests,
        pickup_location: booking.pickup_location,
        payment_reference: booking.payment_reference,
        gateway_response: booking.gateway_response,
      }));

      console.log('📊 [BOOKING-MANAGEMENT] Unified bookings prepared:', {
        totalBookings: unifiedBookings.length,
        serviceTypes: [...new Set(unifiedBookings.map(b => b.service_type))],
        statuses: [...new Set(unifiedBookings.map(b => b.booking_status))]
      });

      setBookings(unifiedBookings);
    } catch (error) {
      console.error('❌ [BOOKING-MANAGEMENT] Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      console.log('🔄 [BOOKING-MANAGEMENT] Updating booking status:', { bookingId, newStatus });
      
      const { error } = await supabase
        .from('new_bookings')
        .update({ 
          booking_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });

      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('❌ [BOOKING-MANAGEMENT] Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const sendBookingEmail = async (bookingId: string, emailType: 'reminder' | 'confirmation' | 'cancellation') => {
    try {
      console.log('📧 [BOOKING-MANAGEMENT] Sending email:', { bookingId, emailType });
      
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: { bookingId, emailType }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${emailType.charAt(0).toUpperCase() + emailType.slice(1)} email sent successfully`,
      });
    } catch (error) {
      console.error('❌ [BOOKING-MANAGEMENT] Error sending email:', error);
      toast({
        title: "Error",
        description: `Failed to send ${emailType} email`,
        variant: "destructive",
      });
    }
  };

  const updateAdminNotes = async (bookingId: string, notes: string) => {
    try {
      console.log('📝 [BOOKING-MANAGEMENT] Updating admin notes:', { bookingId, notes });
      
      const { error } = await supabase
        .from('new_bookings')
        .update({ 
          // Add admin_notes column if it doesn't exist in new_bookings
          // For now, we'll store it in special_requests as a workaround
          special_requests: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin notes updated successfully",
      });

      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('❌ [BOOKING-MANAGEMENT] Error updating admin notes:', error);
      toast({
        title: "Error",
        description: "Failed to update admin notes",
        variant: "destructive",
      });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || booking.service_type === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const exportToExcel = () => {
    const csvContent = [
      ['Reference', 'Customer', 'Email', 'Phone', 'Service Type', 'Service Title', 'Amount (INR)', 'Payment Method', 'Status', 'Date'].join(','),
      ...filteredBookings.map(booking => [
        booking.booking_reference || '',
        booking.customer_name || '',
        booking.customer_email || '',
        booking.customer_phone || '',
        booking.service_type || '',
        booking.service_title || '',
        booking.final_amount || 0,
        booking.payment_method || '',
        booking.booking_status || '',
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Booking Management</span>
          <span className="text-sm font-normal text-muted-foreground">
            {filteredBookings.length} of {bookings.length} bookings
          </span>
        </CardTitle>
        <BookingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          serviceTypeFilter={serviceTypeFilter}
          setServiceTypeFilter={setServiceTypeFilter}
          onExport={exportToExcel}
        />
      </CardHeader>
      <CardContent>
        <EnhancedBookingTable
          bookings={filteredBookings}
          onUpdateStatus={updateBookingStatus}
          onSendEmail={sendBookingEmail}
          onUpdateNotes={updateAdminNotes}
        />

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">No bookings found</p>
            <p className="text-sm text-muted-foreground">
              {bookings.length === 0 
                ? "No bookings have been created yet." 
                : "Try adjusting your search criteria."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingManagement;