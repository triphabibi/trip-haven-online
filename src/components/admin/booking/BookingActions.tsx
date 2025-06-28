
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface BookingActionsProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const BookingActions = ({ bookingId, bookingStatus, onUpdateStatus }: BookingActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      {bookingStatus === 'pending' && (
        <>
          <Button 
            size="sm" 
            onClick={() => onUpdateStatus(bookingId, 'confirmed')}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirm
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onUpdateStatus(bookingId, 'cancelled')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </>
      )}
      {bookingStatus === 'confirmed' && (
        <Button 
          size="sm" 
          onClick={() => onUpdateStatus(bookingId, 'completed')}
        >
          <Clock className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )}
    </div>
  );
};

export default BookingActions;
