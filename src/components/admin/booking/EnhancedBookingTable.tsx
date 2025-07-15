import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Mail, 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { UnifiedBooking, BookingStatus } from '../BookingManagement';
import BookingDetailsDialog from './BookingDetailsDialog';

interface EnhancedBookingTableProps {
  bookings: UnifiedBooking[];
  onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  onSendEmail: (bookingId: string, emailType: 'reminder' | 'confirmation' | 'cancellation') => Promise<void>;
  onUpdateNotes: (bookingId: string, notes: string) => Promise<void>;
}

const EnhancedBookingTable = ({ 
  bookings, 
  onUpdateStatus, 
  onSendEmail, 
  onUpdateNotes 
}: EnhancedBookingTableProps) => {
  const [selectedBooking, setSelectedBooking] = useState<UnifiedBooking | null>(null);
  const [notesDialog, setNotesDialog] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    setLoading(bookingId);
    try {
      await onUpdateStatus(bookingId, newStatus);
    } finally {
      setLoading(null);
    }
  };

  const handleSendEmail = async (bookingId: string, emailType: 'reminder' | 'confirmation' | 'cancellation') => {
    setLoading(bookingId);
    try {
      await onSendEmail(bookingId, emailType);
    } finally {
      setLoading(null);
    }
  };

  const handleUpdateNotes = async (bookingId: string) => {
    setLoading(bookingId);
    try {
      await onUpdateNotes(bookingId, notes);
      setNotesDialog(null);
      setNotes('');
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      completed: { variant: 'outline' as const, icon: CheckCircle, color: 'text-blue-600' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const colors = {
      tour: 'bg-blue-100 text-blue-800',
      package: 'bg-purple-100 text-purple-800',
      visa: 'bg-green-100 text-green-800',
      ticket: 'bg-yellow-100 text-yellow-800',
      ok_to_board: 'bg-red-100 text-red-800',
      transfer: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="outline" className={colors[serviceType as keyof typeof colors] || colors.tour}>
        {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method?: string) => {
    if (!method) return <span className="text-muted-foreground">-</span>;
    
    const colors = {
      razorpay: 'bg-indigo-100 text-indigo-800',
      bank_transfer: 'bg-emerald-100 text-emerald-800',
      cash_on_arrival: 'bg-amber-100 text-amber-800',
      stripe: 'bg-violet-100 text-violet-800',
      paypal: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant="outline" className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {method.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings to display
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount (INR)</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{booking.booking_reference}</span>
                    {booking.payment_reference && (
                      <span className="text-xs text-muted-foreground">
                        Pay: {booking.payment_reference}
                      </span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.customer_name}</span>
                    <span className="text-sm text-muted-foreground">{booking.customer_email}</span>
                    {booking.customer_phone && (
                      <span className="text-xs text-muted-foreground">{booking.customer_phone}</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getServiceTypeBadge(booking.service_type)}
                    <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {booking.service_title}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{formatPrice(booking.final_amount)}</span>
                    {booking.total_amount !== booking.final_amount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(booking.total_amount)}
                      </span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  {getPaymentMethodBadge(booking.payment_method)}
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(booking.booking_status)}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{new Date(booking.created_at).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Status Update Buttons */}
                    {booking.booking_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                          disabled={loading === booking.id}
                          className="h-8 px-2"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                          disabled={loading === booking.id}
                          className="h-8 px-2"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {booking.booking_status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        disabled={loading === booking.id}
                        className="h-8 px-2"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            setNotesDialog(booking.id);
                            setNotes(booking.special_requests || '');
                          }}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Notes
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleSendEmail(booking.id, 'reminder')}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleSendEmail(booking.id, 'confirmation')}>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Confirmation
                        </DropdownMenuItem>
                        
                        {booking.booking_status === 'cancelled' && (
                          <DropdownMenuItem onClick={() => handleSendEmail(booking.id, 'cancellation')}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Cancellation Email
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={onUpdateStatus}
          onSendEmail={onSendEmail}
        />
      )}

      {/* Notes Dialog */}
      <Dialog open={!!notesDialog} onOpenChange={() => setNotesDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes for this booking..."
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNotesDialog(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => notesDialog && handleUpdateNotes(notesDialog)}
                disabled={loading === notesDialog}
              >
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedBookingTable;