
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Settings, Wallet } from 'lucide-react';

type GatewayName = 'razorpay' | 'stripe' | 'paypal' | 'ccavenue' | 'bank_transfer' | 'cash_on_arrival';

interface PaymentGateway {
  id?: string;
  gateway_name: GatewayName;
  display_name: string;
  is_enabled: boolean;
  test_mode: boolean;
  api_key: string;
  api_secret: string;
  configuration: any;
}

const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('gateway_name');

      if (error) throw error;
      
      if (data && data.length > 0) {
        setGateways(data);
      } else {
        initializeDefaultGateways();
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      initializeDefaultGateways();
    }
  };

  const initializeDefaultGateways = () => {
    const defaultGateways: PaymentGateway[] = [
      {
        gateway_name: 'razorpay',
        display_name: 'Razorpay',
        is_enabled: false,
        test_mode: true,
        api_key: '',
        api_secret: '',
        configuration: {}
      },
      {
        gateway_name: 'stripe',
        display_name: 'Stripe',
        is_enabled: false,
        test_mode: true,
        api_key: '',
        api_secret: '',
        configuration: {}
      },
      {
        gateway_name: 'paypal',
        display_name: 'PayPal',
        is_enabled: false,
        test_mode: true,
        api_key: '',
        api_secret: '',
        configuration: {}
      },
      {
        gateway_name: 'ccavenue',
        display_name: 'CCAvenue',
        is_enabled: false,
        test_mode: true,
        api_key: '',
        api_secret: '',
        configuration: {}
      },
      {
        gateway_name: 'bank_transfer',
        display_name: 'Bank Transfer',
        is_enabled: false,
        test_mode: false,
        api_key: '',
        api_secret: '',
        configuration: {
          account_name: '',
          account_number: '',
          ifsc_code: '',
          bank_name: ''
        }
      },
      {
        gateway_name: 'cash_on_arrival',
        display_name: 'Pay Later / Cash',
        is_enabled: false,
        test_mode: false,
        api_key: '',
        api_secret: '',
        configuration: {}
      }
    ];
    setGateways(defaultGateways);
  };

  const updateGateway = (gatewayName: GatewayName, field: string, value: any) => {
    setGateways(prev => prev.map(gateway => 
      gateway.gateway_name === gatewayName 
        ? { ...gateway, [field]: value }
        : gateway
    ));
  };

  const updateConfiguration = (gatewayName: GatewayName, field: string, value: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.gateway_name === gatewayName 
        ? { 
            ...gateway, 
            configuration: { 
              ...gateway.configuration, 
              [field]: value 
            }
          }
        : gateway
    ));
  };

  const saveGateways = async () => {
    setLoading(true);
    try {
      for (const gateway of gateways) {
        const { error } = await supabase
          .from('payment_gateways')
          .upsert({
            gateway_name: gateway.gateway_name,
            display_name: gateway.display_name,
            is_enabled: gateway.is_enabled,
            test_mode: gateway.test_mode,
            api_key: gateway.api_key,
            api_secret: gateway.api_secret,
            configuration: gateway.configuration
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Payment gateway settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving gateways:', error);
      toast({
        title: "Error",
        description: "Failed to save payment gateway settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderGatewayCard = (gateway: PaymentGateway) => {
    return (
      <Card key={gateway.gateway_name} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {gateway.display_name}
            </CardTitle>
            <Switch
              checked={gateway.is_enabled}
              onCheckedChange={(checked) => updateGateway(gateway.gateway_name, 'is_enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {gateway.gateway_name !== 'bank_transfer' && gateway.gateway_name !== 'cash_on_arrival' && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`test_mode_${gateway.gateway_name}`}
                  checked={gateway.test_mode}
                  onCheckedChange={(checked) => updateGateway(gateway.gateway_name, 'test_mode', checked)}
                />
                <Label htmlFor={`test_mode_${gateway.gateway_name}`}>Test Mode</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`api_key_${gateway.gateway_name}`}>API Key</Label>
                  <Input
                    id={`api_key_${gateway.gateway_name}`}
                    type="password"
                    value={gateway.api_key}
                    onChange={(e) => updateGateway(gateway.gateway_name, 'api_key', e.target.value)}
                    placeholder="Enter API Key"
                  />
                </div>
                <div>
                  <Label htmlFor={`api_secret_${gateway.gateway_name}`}>API Secret</Label>
                  <Input
                    id={`api_secret_${gateway.gateway_name}`}
                    type="password"
                    value={gateway.api_secret}
                    onChange={(e) => updateGateway(gateway.gateway_name, 'api_secret', e.target.value)}
                    placeholder="Enter API Secret"
                  />
                </div>
              </div>
            </>
          )}

          {gateway.gateway_name === 'bank_transfer' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Name</Label>
                <Input
                  value={gateway.configuration?.account_name || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'account_name', e.target.value)}
                  placeholder="Account Holder Name"
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  value={gateway.configuration?.account_number || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'account_number', e.target.value)}
                  placeholder="Bank Account Number"
                />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input
                  value={gateway.configuration?.ifsc_code || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'ifsc_code', e.target.value)}
                  placeholder="Bank IFSC Code"
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={gateway.configuration?.bank_name || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'bank_name', e.target.value)}
                  placeholder="Bank Name"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Payment Gateway Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gateways.map(gateway => renderGatewayCard(gateway))}
          </div>
          
          <Button 
            onClick={saveGateways} 
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Saving...' : 'Save All Payment Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySettings;
