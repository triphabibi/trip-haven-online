import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  CreditCard, 
  FileText,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { UnifiedBooking, BookingStatus } from '../BookingManagement';

interface BookingDetailsDialogProps {
  booking: UnifiedBooking;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onSendEmail: (bookingId: string, emailType: 'reminder' | 'confirmation' | 'cancellation') => Promise<void>;
}

const BookingDetailsDialog = ({ 
  booking, 
  open, 
  onClose, 
  onUpdateStatus, 
  onSendEmail 
}: BookingDetailsDialogProps) => {
  const { formatPrice } = useCurrency();

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <Badge className={getStatusColor(booking.booking_status)}>
              {booking.booking_status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{booking.customer_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.customer_email}</span>
                </div>
                {booking.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Booking Information
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <p className="font-mono font-medium">{booking.booking_reference}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Service Type:</span>
                  <p className="font-medium">{booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Service:</span>
                  <p className="font-medium">{booking.service_title}</p>
                </div>
                {booking.travel_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
                  </div>
                )}
                {booking.pickup_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.pickup_location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span className="font-medium">{formatPrice(booking.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Amount:</span>
                  <span className="font-bold text-lg">{formatPrice(booking.final_amount)}</span>
                </div>
                {booking.payment_method && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.payment_method.replace('_', ' ').toUpperCase()}</span>
                  </div>
                )}
                {booking.payment_reference && (
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Reference:</span>
                    <p className="font-mono text-sm">{booking.payment_reference}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {booking.payment_status && (
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                    <p className="font-medium">{booking.payment_status.toUpperCase()}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Booking Date:</span>
                  <p>{new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Special Requests / Admin Notes</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{booking.special_requests}</p>
              </div>
            </>
          )}

          {/* Gateway Response (for debugging) */}
          {booking.gateway_response && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Gateway Response</h3>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(booking.gateway_response, null, 2)}
                </pre>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-wrap gap-3">
            {/* Status Update Buttons */}
            {booking.booking_status === 'pending' && (
              <>
                <Button
                  onClick={() => {
                    onUpdateStatus(booking.id, 'confirmed');
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onUpdateStatus(booking.id, 'cancelled');
                    onClose();
                  }}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Booking
                </Button>
              </>
            )}
            
            {booking.booking_status === 'confirmed' && (
              <Button
                onClick={() => {
                  onUpdateStatus(booking.id, 'completed');
                  onClose();
                }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark Completed
              </Button>
            )}

            {/* Email Buttons */}
            <Button
              variant="outline"
              onClick={() => onSendEmail(booking.id, 'reminder')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Reminder
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onSendEmail(booking.id, 'confirmation')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Resend Confirmation
            </Button>

            {booking.booking_status === 'cancelled' && (
              <Button
                variant="outline"
                onClick={() => onSendEmail(booking.id, 'cancellation')}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Cancellation Email
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;