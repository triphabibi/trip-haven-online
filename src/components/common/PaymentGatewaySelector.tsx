
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Building, Banknote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  is_enabled: boolean;
  test_mode: boolean;
}

interface PaymentGatewaySelectorProps {
  onGatewaySelect: (gateway: string) => void;
  onProceedToPayment: () => void;
  selectedGateway?: string;
  amount: number;
}

const PaymentGatewaySelector = ({ 
  onGatewaySelect, 
  onProceedToPayment, 
  selectedGateway = '',
  amount 
}: PaymentGatewaySelectorProps) => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('is_enabled', true)
        .order('gateway_name');

      if (error) {
        console.error('Error fetching payment gateways:', error);
        // Fallback to default gateways
        setGateways([
          {
            id: 'razorpay',
            gateway_name: 'razorpay',
            display_name: 'Razorpay',
            is_enabled: true,
            test_mode: true
          },
          {
            id: 'cash_on_arrival',
            gateway_name: 'cash_on_arrival',
            display_name: 'Pay Later / Cash',
            is_enabled: true,
            test_mode: false
          }
        ]);
      } else {
        setGateways(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load payment options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
      case 'stripe':
      case 'paypal':
        return <CreditCard className="h-6 w-6" />;
      case 'ccavenue':
        return <Wallet className="h-6 w-6" />;
      case 'bank_transfer':
        return <Building className="h-6 w-6" />;
      case 'cash_on_arrival':
        return <Banknote className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const handleProceed = () => {
    if (!selectedGateway) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue",
        variant: "destructive",
      });
      return;
    }
    onProceedToPayment();
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading payment options...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="text-center text-xl">
          Choose Payment Method
        </CardTitle>
        <div className="text-center text-lg font-semibold">
          Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED' }).format(amount)}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup value={selectedGateway} onValueChange={onGatewaySelect} className="space-y-4">
          {gateways.map((gateway) => (
            <div key={gateway.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value={gateway.gateway_name} id={gateway.gateway_name} />
              <Label 
                htmlFor={gateway.gateway_name} 
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className="text-blue-600">
                  {getGatewayIcon(gateway.gateway_name)}
                </div>
                <div>
                  <div className="font-medium">{gateway.display_name}</div>
                  {gateway.test_mode && (
                    <div className="text-xs text-orange-600">Test Mode</div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button 
          onClick={handleProceed}
          className="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          disabled={!selectedGateway}
        >
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentGatewaySelector;
