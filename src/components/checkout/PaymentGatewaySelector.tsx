import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, DollarSign, Globe, Shield, Loader2 } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'api' | 'manual';
  api_key?: string;
  api_secret?: string;
  manual_instructions?: string;
  enabled: boolean;
}

interface PaymentGatewaySelectorProps {
  amount: number;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentGatewaySelector({
  amount,
  bookingId,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentError
}: PaymentGatewaySelectorProps) {
  const { toast } = useToast();
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['enabled-payment-gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('enabled', true)
        .order('name');
      
      if (error) throw error;
      return data as PaymentGateway[];
    }
  });

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'paypal':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'bank_transfer':
        return <Banknote className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <DollarSign className="h-5 w-5 text-orange-600" />;
      case 'ccavenue':
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const handlePayment = async () => {
    if (!selectedGateway) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    const gateway = gateways?.find(g => g.id === selectedGateway);
    if (!gateway) return;

    setIsProcessing(true);

    try {
      console.log('Processing payment with gateway:', gateway.name);
      
      // Convert amount to INR for processing (assuming AED to INR rate of 22.5)
      const amountInINR = amount * 22.5;
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          bookingId,
          paymentMethod: gateway.name,
          amount: amountInINR,
          customerName,
          customerEmail,
          customerPhone
        }
      });

      if (error) {
        console.error('Payment function error:', error);
        throw error;
      }

      console.log('Payment response:', data);

      if (data.success) {
        if (data.requiresAction) {
          // Handle different payment actions
          if (data.actionType === 'razorpay_checkout') {
            await handleRazorpayCheckout(data.checkoutData);
          } else if (data.actionType === 'redirect') {
            // Open Stripe checkout in new tab
            window.open(data.checkoutUrl, '_blank');
          }
        } else {
          // Direct success (cash, bank transfer)
          onPaymentSuccess({
            gateway: gateway.name,
            type: gateway.type,
            status: 'pending',
            amount: amountInINR,
            message: data.message
          });
          
          toast({
            title: "Payment Confirmed",
            description: data.message,
          });
        }
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      onPaymentError(error.message || 'Payment processing failed');
      toast({
        title: "Payment Error",
        description: error.message || 'Failed to process payment',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayCheckout = async (checkoutData: any) => {
    return new Promise((resolve, reject) => {
      const options = {
        ...checkoutData,
        handler: async (response: any) => {
          try {
            console.log('Razorpay success:', response);
            
            // Update booking with payment success
            const { error: updateError } = await supabase
              .from('new_bookings')
              .update({
                payment_gateway: 'razorpay',
                payment_status: 'completed',
                payment_method: 'razorpay',
                payment_reference: response.razorpay_payment_id
              })
              .eq('id', bookingId);

            if (updateError) throw updateError;

            onPaymentSuccess({
              gateway: 'razorpay',
              type: 'api',
              status: 'completed',
              amount: checkoutData.amount / 100,
              transactionId: response.razorpay_payment_id
            });
            
            toast({
              title: "Payment Successful",
              description: "Payment completed via Razorpay",
            });
            
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gateways || gateways.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No payment methods available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Amount: <span className="font-semibold">AED {amount.toFixed(2)}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway}>
          {gateways.map((gateway) => (
            <div key={gateway.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={gateway.id} id={gateway.id} />
              <Label
                htmlFor={gateway.id}
                className="flex items-center space-x-3 cursor-pointer flex-1"
              >
                {getGatewayIcon(gateway.name)}
                <div className="flex-1">
                  <div className="font-medium capitalize">
                    {gateway.name.replace('_', ' ')}
                  </div>
                  {gateway.type === 'manual' && gateway.manual_instructions && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {gateway.manual_instructions.substring(0, 100)}
                      {gateway.manual_instructions.length > 100 && '...'}
                    </div>
                  )}
                </div>
                <Badge variant={gateway.type === 'api' ? 'default' : 'secondary'}>
                  {gateway.type === 'api' ? 'Instant' : 'Manual'}
                </Badge>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handlePayment}
          disabled={!selectedGateway || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay AED ${amount.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}