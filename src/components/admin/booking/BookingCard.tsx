
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Phone, Mail, MapPin, DollarSign } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BookingCardProps {
  booking: any;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const BookingCard = ({ booking, onUpdateStatus }: BookingCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { formatPrice } = useCurrency();

  // Fetch service details based on booking type and service_id
  const { data: serviceDetails } = useQuery({
    queryKey: ['service_details', booking.service_id, booking.booking_type],
    queryFn: async () => {
      if (!booking.service_id || !booking.booking_type) return null;

      let query;
      
      if (booking.booking_type === 'visa') {
        query = supabase
          .from('visa_services')
          .select('country, visa_type')
          .eq('id', booking.service_id)
          .single();
      } else if (booking.booking_type === 'package') {
        query = supabase
          .from('tour_packages')
          .select('title')
          .eq('id', booking.service_id)
          .single();
      } else if (booking.booking_type === 'ticket') {
        query = supabase
          .from('attraction_tickets')
          .select('title')
          .eq('id', booking.service_id)
          .single();
      } else {
        // Default to tours
        query = supabase
          .from('tours')
          .select('title')
          .eq('id', booking.service_id)
          .single();
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!booking.service_id,
  });

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(booking.id, newStatus);
    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getServiceTitle = () => {
    if (!serviceDetails) return `${booking.booking_type} Service`;
    
    if (booking.booking_type === 'visa') {
      return `${serviceDetails.country} ${serviceDetails.visa_type}`;
    }
    
    return serviceDetails.title || `${booking.booking_type} Service`;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{booking.booking_reference}</h3>
                <p className="text-sm text-gray-600">
                  {getServiceTitle()}
                </p>
              </div>
              <Badge className={getStatusColor(booking.booking_status)}>
                {booking.booking_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{booking.customer_name}</span>
              </div>
              {booking.customer_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{booking.customer_email}</span>
                </div>
              )}
              {booking.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{booking.customer_phone}</span>
                </div>
              )}
              {booking.travel_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
                </div>
              )}
              {booking.pickup_location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{booking.pickup_location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{formatPrice(booking.final_amount)}</span>
              </div>
            </div>

            {booking.special_requests && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Special Requests: </span>
                <span className="text-gray-600">{booking.special_requests}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <Select
              value={booking.booking_status}
              onValueChange={handleStatusUpdate}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-xs text-gray-500 text-center">
              {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
