
import { Badge } from '@/components/ui/badge';
import BookingActions from './BookingActions';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Booking {
  id: string;
  customer_name: string;
  booking_reference: string;
  final_amount: number;
  customer_email?: string;
  customer_phone?: string;
  adults_count: number;
  children_count: number;
  travel_date?: string;
  pickup_location?: string;
  booking_status: BookingStatus;
  payment_status: string;
}

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const BookingCard = ({ booking, onUpdateStatus }: BookingCardProps) => {
  return (
    <div className="border rounded-lg p-4">
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

        <BookingActions 
          bookingId={booking.id}
          bookingStatus={booking.booking_status}
          onUpdateStatus={onUpdateStatus}
        />
      </div>
    </div>
  );
};

export default BookingCard;
