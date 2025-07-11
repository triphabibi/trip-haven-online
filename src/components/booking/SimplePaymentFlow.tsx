
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Wallet, Building2, Banknote } from 'lucide-react';

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  api_key?: string;
  api_secret?: string;
  bank_details?: any;
}

interface SimplePaymentFlowProps {
  amount: number;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: () => void;
}

const SimplePaymentFlow = ({
  amount,
  bookingId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess
}: SimplePaymentFlowProps) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  console.log('SimplePaymentFlow rendered with:', { amount, bookingId, customerName, customerEmail });

  const { data: gateways, isLoading, error } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: async () => {
      console.log('Fetching payment gateways...');
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('is_enabled', true)
        .order('priority');
      
      if (error) {
        console.error('Error fetching gateways:', error);
        throw error;
      }
      console.log('Payment gateways fetched:', data);
      return data as PaymentGateway[];
    }
  });

  const getPaymentIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting payment process with:', { selectedPayment, bookingId, amount });
    setProcessing(true);

    try {
      console.log('Calling create-payment function...');
      const { data: result, error } = await supabase.functions.invoke('create-payment', {
        body: {
          bookingId,
          paymentMethod: selectedPayment,
          amount,
          customerName,
          customerEmail,
          customerPhone
        }
      });

      console.log('Create-payment response:', { result, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (result?.success) {
        console.log('Payment creation successful:', result);
        
        if (result.requiresAction) {
          if (result.paymentMethod === 'razorpay') {
            console.log('Processing Razorpay payment...');
            await handleRazorpayPayment(result.checkoutData);
          } else if (result.paymentMethod === 'stripe') {
            console.log('Redirecting to Stripe checkout...');
            window.location.href = result.checkoutUrl;
          }
        } else {
          console.log('Payment completed without action required');
          toast({
            title: "Success!",
            description: result.message,
          });
          onSuccess();
        }
      } else {
        throw new Error(result?.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = (checkoutData: any) => {
    return new Promise((resolve, reject) => {
      console.log('Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded, opening checkout...');
        const options = {
          ...checkoutData,
          handler: async function (response: any) {
            console.log('Razorpay payment response:', response);
            try {
              console.log('Confirming payment...');
              const { data: confirmResult, error } = await supabase.functions.invoke('confirm-payment', {
                body: {
                  paymentId: response.razorpay_payment_id,
                  paymentMethod: 'razorpay',
                  bookingId: bookingId
                }
              });

              console.log('Payment confirmation result:', { confirmResult, error });

              if (error || !confirmResult?.success) {
                throw new Error('Payment confirmation failed');
              }

              toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}`,
              });

              onSuccess();
              resolve(response);
            } catch (error) {
              console.error('Payment confirmation error:', error);
              toast({
                title: "Payment Failed",
                description: "Payment could not be confirmed",
                variant: "destructive",
              });
              reject(error);
            }
          },
          modal: {
            ondismiss: function() {
              console.log('Razorpay modal dismissed');
              reject(new Error('Payment cancelled'));
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        reject(new Error('Failed to load Razorpay'));
      };
      
      document.body.appendChild(script);
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading payment options...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Payment gateways error:', error);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading payment options. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">AED {amount.toFixed(2)}</div>
          <p className="text-gray-600">Total Amount</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Select Payment Method</h3>
          
          {gateways && gateways.length > 0 ? (
            gateways.map((gateway) => (
              <div
                key={gateway.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPayment === gateway.gateway_name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  console.log('Selected payment method:', gateway.gateway_name);
                  setSelectedPayment(gateway.gateway_name);
                }}
              >
                <div className="flex items-center gap-3">
                  {getPaymentIcon(gateway.gateway_name)}
                  <div>
                    <div className="font-medium">{gateway.display_name}</div>
                    <div className="text-sm text-gray-600">{gateway.description}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No payment methods available. Please contact support.
            </div>
          )}
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing || !selectedPayment}
          className="w-full"
          size="lg"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay AED ${amount.toFixed(2)}`
          )}
        </Button>

        {/* Debug info */}
        <div className="text-xs text-gray-500 mt-4">
          <div>Booking ID: {bookingId}</div>
          <div>Selected: {selectedPayment || 'None'}</div>
          <div>Available gateways: {gateways?.length || 0}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplePaymentFlow;
