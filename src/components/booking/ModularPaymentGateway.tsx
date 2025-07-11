import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Wallet, Building2, Banknote, Clock } from 'lucide-react';

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  priority: number;
  supported_currencies: string[];
  min_amount: number;
  max_amount: number;
  api_key: string;
  api_secret: string;
  test_mode: boolean;
}

interface ModularPaymentGatewayProps {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string, gateway: string) => void;
  onError: (error: string) => void;
}

const ModularPaymentGateway = ({
  bookingId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError
}: ModularPaymentGatewayProps) => {
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const { data: paymentGateways, isLoading } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('is_enabled', true)
        .order('priority');
      
      if (error) throw error;
      return data as PaymentGateway[];
    }
  });

  // Auto-select first available gateway
  useEffect(() => {
    if (paymentGateways && paymentGateways.length > 0 && !selectedGateway) {
      setSelectedGateway(paymentGateways[0].gateway_name);
    }
  }, [paymentGateways, selectedGateway]);

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'paypal':
        return <Wallet className="h-5 w-5 text-yellow-600" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const handleRazorpayPayment = async (gateway: PaymentGateway) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: gateway.api_key || 'rzp_test_9wuOSlATpSiUGq',
          amount: Math.round(amount * 100),
          currency: 'AED',
          name: 'Trip Habibi',
          description: 'Travel Booking Payment',
          order_id: bookingId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          theme: {
            color: '#3B82F6'
          },
          handler: function (response: any) {
            resolve(response.razorpay_payment_id);
          },
          modal: {
            ondismiss: function() {
              reject('Payment cancelled by user');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      
      script.onerror = () => {
        reject('Failed to load Razorpay');
      };
      
      document.body.appendChild(script);
    });
  };

  const handleStripePayment = async (gateway: PaymentGateway) => {
    // Simulate Stripe payment for demo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          resolve(`stripe_${Date.now()}`);
        } else {
          reject('Payment failed');
        }
      }, 2000);
    });
  };

  const handlePayPalPayment = async (gateway: PaymentGateway) => {
    // Simulate PayPal payment for demo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.2;
        if (success) {
          resolve(`paypal_${Date.now()}`);
        } else {
          reject('Payment failed');
        }
      }, 2000);
    });
  };

  const handleBankTransferPayment = async (gateway: PaymentGateway) => {
    // For bank transfer, we just mark as pending
    toast({
      title: "Bank Transfer Instructions",
      description: "Please transfer the amount to our bank account. Payment confirmation will be processed within 24 hours.",
    });
    
    return Promise.resolve(`bank_transfer_${Date.now()}`);
  };

  const handleCashPayment = async (gateway: PaymentGateway) => {
    toast({
      title: "Cash Payment Selected",
      description: "Please pay in cash at the pickup location.",
    });
    
    return Promise.resolve(`cash_${Date.now()}`);
  };

  const processPayment = async () => {
    if (!selectedGateway) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    const gateway = paymentGateways?.find(g => g.gateway_name === selectedGateway);
    if (!gateway) {
      onError('Selected payment gateway not found');
      return;
    }

    setProcessing(true);

    try {
      // Use the new payment processing function
      const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('process-payment', {
        body: {
          bookingId: bookingId,
          gatewayName: gateway.gateway_name,
          amount: amount,
          currency: 'AED',
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          returnUrl: `${window.location.origin}/booking-confirmation`
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment processing failed');
      }

      if (paymentResult.success) {
        if (paymentResult.requiresAction) {
          // Handle different payment methods
          if (paymentResult.paymentMethod === 'razorpay') {
            await handleRazorpayCheckout(paymentResult.checkoutData, bookingId);
          } else if (paymentResult.paymentMethod === 'stripe') {
            window.open(paymentResult.checkoutUrl, '_blank');
          }
        } else {
          // Direct success (cash or bank transfer)
          toast({
            title: "Success!",
            description: paymentResult.message,
            duration: 6000,
          });
          onSuccess(`${gateway.gateway_name}_${Date.now()}`, gateway.gateway_name);
        }
      } else {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError(typeof error === 'string' ? error : (error as Error).message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayCheckout = async (checkoutData: any, bookingId: string) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          ...checkoutData,
          handler: async function (response: any) {
            try {
              // Verify payment
              const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-payment', {
                body: {
                  paymentId: response.razorpay_payment_id,
                  paymentMethod: 'razorpay',
                  bookingId: bookingId
                }
              });

              if (verificationError || !verificationResult.success) {
                throw new Error(verificationResult?.error || 'Payment verification failed');
              }

              toast({
                title: "Payment Successful!",
                description: `Payment ID: ${response.razorpay_payment_id}`,
              });

              onSuccess(response.razorpay_payment_id, 'razorpay');
              resolve(response);
            } catch (error) {
              console.error('Payment verification error:', error);
              onError('Payment verification failed');
              reject(error);
            }
          },
          modal: {
            ondismiss: function() {
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      
      script.onerror = () => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Select Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">AED {amount.toFixed(2)}</div>
          <p className="text-gray-600">Total Amount</p>
        </div>

        <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway}>
          <div className="space-y-3">
            {paymentGateways?.map((gateway) => (
              <div key={gateway.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={gateway.gateway_name} id={gateway.gateway_name} />
                <Label htmlFor={gateway.gateway_name} className="flex items-center gap-3 cursor-pointer flex-1">
                  {getGatewayIcon(gateway.gateway_name)}
                  <div className="flex-1">
                    <div className="font-medium">{gateway.display_name}</div>
                    <div className="text-sm text-gray-500">{gateway.description}</div>
                  </div>
                  {gateway.gateway_name === 'bank_transfer' && (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button 
          onClick={processPayment}
          disabled={processing || !selectedGateway}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay AED ${amount.toFixed(2)}`
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModularPaymentGateway;
