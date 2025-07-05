
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  bookingReference: string;
  serviceTitle: string;
}

interface PaymentGatewaySelectorProps {
  paymentData: PaymentData;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

const PaymentGatewaySelector = ({ 
  paymentData, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentGatewaySelectorProps) => {
  const [selectedGateway, setSelectedGateway] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleRazorpayPayment = () => {
    setProcessing(true);
    
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: 'rzp_test_9wuOSlATpSiUGq', // Replace with your Razorpay key
        amount: Math.round(paymentData.amount * 100), // Amount in paise
        currency: 'AED',
        name: 'Trip Habibi',
        description: paymentData.serviceTitle,
        order_id: paymentData.bookingReference,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function (response: any) {
          console.log('Razorpay Success:', response);
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          onPaymentSuccess?.(response.razorpay_payment_id);
          setProcessing(false);
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            onPaymentError?.('Payment cancelled by user');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    
    script.onerror = () => {
      setProcessing(false);
      toast({
        title: "Error",
        description: "Failed to load Razorpay. Please try again.",
        variant: "destructive",
      });
    };
    
    document.body.appendChild(script);
  };

  const handleStripePayment = () => {
    setProcessing(true);
    
    // Simulate Stripe payment with prefilled data
    const stripeData = {
      customer_email: paymentData.customerEmail,
      line_items: [{
        price_data: {
          currency: 'aed',
          product_data: {
            name: paymentData.serviceTitle,
          },
          unit_amount: Math.round(paymentData.amount * 100),
        },
        quantity: 1,
      }],
      prefill_customer: {
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        phone: paymentData.customerPhone,
      }
    };
    
    console.log('Stripe payment initiated with data:', stripeData);
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        const paymentId = `stripe_${Date.now()}`;
        toast({
          title: "Payment Successful!",
          description: `Payment ID: ${paymentId}`,
        });
        onPaymentSuccess?.(paymentId);
      } else {
        toast({
          title: "Payment Failed",
          description: "Please try again or use a different payment method.",
          variant: "destructive",
        });
        onPaymentError?.('Payment failed');
      }
      setProcessing(false);
    }, 2000);
  };

  const handleCashPayment = () => {
    toast({
      title: "Cash Payment Selected",
      description: "Please pay in cash at the pickup location or office.",
    });
    onPaymentSuccess?.('cash_payment');
  };

  const handlePayment = () => {
    switch (selectedGateway) {
      case 'razorpay':
        handleRazorpayPayment();
        break;
      case 'stripe':
        handleStripePayment();
        break;
      case 'cash':
        handleCashPayment();
        break;
      default:
        toast({
          title: "Error",
          description: "Please select a payment method.",
          variant: "destructive",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Select Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway}>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="razorpay" id="razorpay" />
            <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
              <Wallet className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">Razorpay</div>
                <div className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">Stripe</div>
                <div className="text-sm text-gray-500">International Cards</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
              <Banknote className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">Cash Payment</div>
                <div className="text-sm text-gray-500">Pay at pickup location</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">
              AED {paymentData.amount.toFixed(2)}
            </span>
          </div>
          
          <Button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full h-12 text-lg font-semibold"
          >
            {processing ? 'Processing...' : `Pay AED ${paymentData.amount.toFixed(2)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGatewaySelector;
