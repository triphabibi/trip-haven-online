
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('gateway_name');

      if (error) {
        console.error('Error fetching gateways:', error);
        initializeDefaultGateways();
        return;
      }
      
      if (data && data.length > 0) {
        setGateways(data);
      } else {
        initializeDefaultGateways();
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      initializeDefaultGateways();
    } finally {
      setLoading(false);
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
        is_enabled: true,
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
    setSaving(true);
    try {
      // Delete existing gateways first
      const { error: deleteError } = await supabase
        .from('payment_gateways')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        console.error('Error deleting existing gateways:', deleteError);
      }

      // Insert all gateways
      const gatewaysToInsert = gateways.map(gateway => ({
        gateway_name: gateway.gateway_name,
        display_name: gateway.display_name,
        is_enabled: gateway.is_enabled,
        test_mode: gateway.test_mode,
        api_key: gateway.api_key || '',
        api_secret: gateway.api_secret || '',
        configuration: gateway.configuration || {}
      }));

      const { error: insertError } = await supabase
        .from('payment_gateways')
        .insert(gatewaysToInsert);

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Payment gateway settings saved successfully",
      });

      // Refresh the data
      await fetchGateways();
    } catch (error) {
      console.error('Error saving gateways:', error);
      toast({
        title: "Error",
        description: "Failed to save payment gateway settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderGatewayCard = (gateway: PaymentGateway) => {
    return (
      <Card key={gateway.gateway_name} className="mb-6 bg-white border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
              {gateway.display_name}
            </CardTitle>
            <Switch
              checked={gateway.is_enabled}
              onCheckedChange={(checked) => updateGateway(gateway.gateway_name, 'is_enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white">
          {gateway.gateway_name !== 'bank_transfer' && gateway.gateway_name !== 'cash_on_arrival' && (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`test_mode_${gateway.gateway_name}`}
                  checked={gateway.test_mode}
                  onCheckedChange={(checked) => updateGateway(gateway.gateway_name, 'test_mode', checked)}
                />
                <Label htmlFor={`test_mode_${gateway.gateway_name}`} className="font-medium">Test Mode</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`api_key_${gateway.gateway_name}`} className="font-medium">API Key</Label>
                  <Input
                    id={`api_key_${gateway.gateway_name}`}
                    type="text"
                    value={gateway.api_key}
                    onChange={(e) => updateGateway(gateway.gateway_name, 'api_key', e.target.value)}
                    placeholder="Enter API Key"
                    className="mt-1 bg-white border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor={`api_secret_${gateway.gateway_name}`} className="font-medium">API Secret</Label>
                  <Input
                    id={`api_secret_${gateway.gateway_name}`}
                    type="password"
                    value={gateway.api_secret}
                    onChange={(e) => updateGateway(gateway.gateway_name, 'api_secret', e.target.value)}
                    placeholder="Enter API Secret"
                    className="mt-1 bg-white border-gray-300"
                  />
                </div>
              </div>
            </>
          )}

          {gateway.gateway_name === 'bank_transfer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Account Name</Label>
                <Input
                  value={gateway.configuration?.account_name || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'account_name', e.target.value)}
                  placeholder="Account Holder Name"
                  className="mt-1 bg-white border-gray-300"
                />
              </div>
              <div>
                <Label className="font-medium">Account Number</Label>
                <Input
                  value={gateway.configuration?.account_number || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'account_number', e.target.value)}
                  placeholder="Bank Account Number"
                  className="mt-1 bg-white border-gray-300"
                />
              </div>
              <div>
                <Label className="font-medium">IFSC Code</Label>
                <Input
                  value={gateway.configuration?.ifsc_code || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'ifsc_code', e.target.value)}
                  placeholder="Bank IFSC Code"
                  className="mt-1 bg-white border-gray-300"
                />
              </div>
              <div>
                <Label className="font-medium">Bank Name</Label>
                <Input
                  value={gateway.configuration?.bank_name || ''}
                  onChange={(e) => updateConfiguration(gateway.gateway_name, 'bank_name', e.target.value)}
                  placeholder="Bank Name"
                  className="mt-1 bg-white border-gray-300"
                />
              </div>
            </div>
          )}

          {gateway.gateway_name === 'cash_on_arrival' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                This option allows customers to pay later or with cash. No API configuration required.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wallet className="h-6 w-6" />
              Payment Gateway Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="text-lg">Loading payment gateway settings...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wallet className="h-6 w-6" />
            Payment Gateway Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {gateways.map(gateway => renderGatewayCard(gateway))}
          </div>
          
          <Button 
            onClick={saveGateways} 
            disabled={saving}
            className="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {saving ? 'Saving...' : 'Save All Payment Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySettings;
