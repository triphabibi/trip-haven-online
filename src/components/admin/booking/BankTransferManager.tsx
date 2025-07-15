import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

interface BankTransferManagerProps {
  bookingId: string;
  bookingReference: string;
  customerName: string;
  amount: number;
  paymentStatus?: string;
  proofOfPayment?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  onVerificationComplete: () => void;
}

const BankTransferManager = ({
  bookingId,
  bookingReference,
  customerName,
  amount,
  paymentStatus,
  proofOfPayment,
  verifiedAt,
  verifiedBy,
  onVerificationComplete
}: BankTransferManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [proofUrl, setProofUrl] = useState(proofOfPayment || '');
  const [adminNotes, setAdminNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const handleVerifyPayment = async (action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      console.log('🏦 [BANK-TRANSFER] Processing verification:', { bookingId, action });

      const updateData: any = {
        payment_status: action === 'approve' ? 'completed' : 'failed',
        booking_status: action === 'approve' ? 'confirmed' : 'cancelled',
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('new_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        variant: action === 'approve' ? 'default' : 'destructive'
      });

      onVerificationComplete();
    } catch (error) {
      console.error('❌ [BANK-TRANSFER] Error:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} payment`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProofUrl = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('new_bookings')
        .update({ 
          proof_of_payment: proofUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment proof URL updated successfully",
      });
    } catch (error) {
      console.error('❌ [BANK-TRANSFER] Error updating proof:', error);
      toast({
        title: "Error",
        description: "Failed to update payment proof URL",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (verifiedAt) {
      return paymentStatus === 'completed' ? (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified & Approved
        </Badge>
      ) : (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        <Upload className="h-3 w-3 mr-1" />
        Pending Verification
      </Badge>
    );
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            🏦 Bank Transfer
            {getStatusBadge()}
          </CardTitle>
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bank Transfer Verification</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Booking Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Booking Reference</Label>
                    <p className="font-mono text-sm">{bookingReference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount</Label>
                    <p className="text-lg font-bold text-green-600">{formatPrice(amount)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Customer</Label>
                    <p className="text-sm">{customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge()}</div>
                  </div>
                </div>

                {/* Payment Proof */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Payment Proof URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="Enter URL to payment proof document/image..."
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUpdateProofUrl}
                      disabled={loading || !proofUrl}
                      size="sm"
                    >
                      Update
                    </Button>
                  </div>
                  {proofOfPayment && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(proofOfPayment, '_blank')}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Current Proof
                    </Button>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this verification..."
                    rows={3}
                  />
                </div>

                {/* Verification Status */}
                {verifiedAt && (
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Verified on: {new Date(verifiedAt).toLocaleString()}</span>
                    </div>
                    {verifiedBy && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm">Verified by: {verifiedBy}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {!verifiedAt && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleVerifyPayment('approve')}
                      disabled={loading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button
                      onClick={() => handleVerifyPayment('reject')}
                      disabled={loading}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Payment
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>Amount:</strong> {formatPrice(amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Reference:</strong> {bookingReference}
          </p>
          
          {proofOfPayment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(proofOfPayment, '_blank')}
              className="w-full mt-2"
            >
              <FileText className="h-3 w-3 mr-1" />
              View Proof
            </Button>
          )}
          
          {!verifiedAt && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handleVerifyPayment('approve')}
                disabled={loading}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 h-8"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                onClick={() => handleVerifyPayment('reject')}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="flex-1 h-8"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferManager;