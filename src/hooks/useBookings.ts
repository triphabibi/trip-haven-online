
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookingData {
  service_type: 'tour' | 'package' | 'ticket' | 'visa' | 'transfer';
  service_id: string;
  service_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  travel_date?: string;
  travel_time?: string;
  adults_count: number;
  children_count: number;
  infants_count: number;
  base_amount: number;
  total_amount: number;
  special_requests?: string;
  pickup_location?: string;
  selected_language?: string;
}

export interface TravelerData {
  traveler_type: 'adult' | 'child' | 'infant';
  title?: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  passport_number?: string;
  passport_expiry?: string;
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingData, travelers = [] }: { 
      bookingData: BookingData; 
      travelers?: TravelerData[] 
    }) => {
      // First create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Then create travelers if any
      if (travelers.length > 0) {
        const travelersWithBookingId = travelers.map(traveler => ({
          ...traveler,
          booking_id: booking.id
        }));

        const { error: travelersError } = await supabase
          .from('travelers')
          .insert(travelersWithBookingId);

        if (travelersError) throw travelersError;
      }

      return booking;
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Created!",
        description: `Booking reference: ${booking.booking_reference}`,
      });
    },
    onError: (error) => {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          travelers(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
