import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Copy, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BankTransferSuccessProps {
  bookingId: string;
  bankDetails: string;
  amount: number;
  currency: string;
  onUploadComplete: () => void;
}

export function BankTransferSuccess({ 
  bookingId, 
  bankDetails, 
  amount, 
  currency,
  onUploadComplete 
}: BankTransferSuccessProps) {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image (JPG, PNG, GIF) or PDF file",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setProofFile(file);
    }
  };

  const uploadProofOfPayment = async () => {
    if (!proofFile) {
      toast({
        title: "No File Selected",
        description: "Please select a payment proof file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `payment-proof-${bookingId}-${Date.now()}.${fileExt}`;
      
      // Convert file to base64 for storage in database
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        // Update booking with proof of payment
        const { error } = await supabase
          .from('new_bookings')
          .update({
            proof_of_payment: base64String,
            admin_notes: notes ? `Customer notes: ${notes}` : null
          })
          .eq('id', bookingId);

        if (error) {
          console.error('Upload error:', error);
          throw error;
        }

        setUploadComplete(true);
        toast({
          title: "Upload Successful",
          description: "Your payment proof has been uploaded. We'll verify and confirm your booking soon.",
        });
        
        onUploadComplete();
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      reader.readAsDataURL(proofFile);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload payment proof",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const copyBankDetails = () => {
    navigator.clipboard.writeText(bankDetails);
    toast({
      title: "Copied!",
      description: "Bank details copied to clipboard"
    });
  };

  if (uploadComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Proof Uploaded!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you! We've received your payment proof. Our team will verify the payment and confirm your booking within 24 hours.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong><br/>
              • We'll verify your payment within 24 hours<br/>
              • You'll receive a confirmation email once verified<br/>
              • For urgent queries, contact our support team
            </p>
          </div>
          <Button onClick={onUploadComplete} className="w-full">
            Continue to Booking Confirmation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Bank Transfer Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Transfer Amount: {currency} {amount.toLocaleString()}
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please transfer the exact amount to the bank account below
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Bank Details</h4>
              <Button variant="outline" size="sm" onClick={copyBankDetails}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {bankDetails}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Upload Proof */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Payment Proof
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="proof-file">Payment Receipt/Screenshot *</Label>
            <Input
              id="proof-file"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a screenshot of your transfer receipt or bank statement (JPG, PNG, GIF, PDF - Max 5MB)
            </p>
          </div>

          {proofFile && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected file:</strong> {proofFile.name}
              </p>
              <p className="text-xs text-blue-600">
                Size: {(proofFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your payment..."
              rows={3}
            />
          </div>

          <Button 
            onClick={uploadProofOfPayment}
            disabled={!proofFile || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Payment Proof
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ensure the transfer amount matches exactly</li>
            <li>• Include your booking reference in the transfer description if possible</li>
            <li>• Upload a clear image/PDF of your payment receipt</li>
            <li>• Our team will verify your payment within 24 hours</li>
            <li>• You'll receive a confirmation email once verified</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}