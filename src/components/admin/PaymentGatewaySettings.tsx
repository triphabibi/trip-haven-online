
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Save, Settings } from 'lucide-react';

const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const defaultGateways = [
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
      gateway_name: 'pay_later',
      display_name: 'Pay Later / Cash',
      is_enabled: false,
      test_mode: false,
      api_key: '',
      api_secret: '',
      configuration: {}
    }
  ];

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*');

      if (error) throw error;

      // Initialize with default gateways if none exist
      if (!data || data.length === 0) {
        await initializeDefaultGateways();
      } else {
        setGateways(data);
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      toast({
        title: "Error",
        description: "Failed to load payment gateways",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultGateways = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_gateways')
        .insert(defaultGateways)
        .select();

      if (error) throw error;
      setGateways(data || []);
    } catch (error) {
      console.error('Error initializing gateways:', error);
      setGateways(defaultGateways);
    }
  };

  const updateGateway = async (gateway: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_gateways')
        .upsert(gateway)
        .eq('gateway_name', gateway.gateway_name);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment gateway updated successfully",
      });

      fetchGateways();
    } catch (error) {
      console.error('Error updating gateway:', error);
      toast({
        title: "Error",
        description: "Failed to update payment gateway",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGatewayChange = (index: number, field: string, value: any) => {
    const updatedGateways = [...gateways];
    if (field.includes('configuration.')) {
      const configField = field.split('.')[1];
      updatedGateways[index].configuration = {
        ...updatedGateways[index].configuration,
        [configField]: value
      };
    } else {
      updatedGateways[index][field] = value;
    }
    setGateways(updatedGateways);
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment gateways...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {gateways.map((gateway, index) => (
              <Card key={gateway.gateway_name} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{gateway.display_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={gateway.is_enabled ? 'default' : 'secondary'}>
                        {gateway.is_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {gateway.test_mode && (
                        <Badge variant="outline">Test Mode</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={gateway.is_enabled}
                      onCheckedChange={(checked) => handleGatewayChange(index, 'is_enabled', checked)}
                    />
                    <Label>Enable Gateway</Label>
                  </div>

                  {gateway.gateway_name !== 'bank_transfer' && gateway.gateway_name !== 'pay_later' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={gateway.test_mode}
                        onCheckedChange={(checked) => handleGatewayChange(index, 'test_mode', checked)}
                      />
                      <Label>Test Mode</Label>
                    </div>
                  )}

                  {gateway.gateway_name !== 'bank_transfer' && gateway.gateway_name !== 'pay_later' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>API Key</Label>
                        <Input
                          type="password"
                          value={gateway.api_key || ''}
                          onChange={(e) => handleGatewayChange(index, 'api_key', e.target.value)}
                          placeholder="Enter API Key"
                        />
                      </div>
                      <div>
                        <Label>API Secret</Label>
                        <Input
                          type="password"
                          value={gateway.api_secret || ''}
                          onChange={(e) => handleGatewayChange(index, 'api_secret', e.target.value)}
                          placeholder="Enter API Secret"
                        />
                      </div>
                    </div>
                  )}

                  {gateway.gateway_name === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Account Name</Label>
                        <Input
                          value={gateway.configuration?.account_name || ''}
                          onChange={(e) => handleGatewayChange(index, 'configuration.account_name', e.target.value)}
                          placeholder="Account Holder Name"
                        />
                      </div>
                      <div>
                        <Label>Account Number</Label>
                        <Input
                          value={gateway.configuration?.account_number || ''}
                          onChange={(e) => handleGatewayChange(index, 'configuration.account_number', e.target.value)}
                          placeholder="Bank Account Number"
                        />
                      </div>
                      <div>
                        <Label>IFSC Code</Label>
                        <Input
                          value={gateway.configuration?.ifsc_code || ''}
                          onChange={(e) => handleGatewayChange(index, 'configuration.ifsc_code', e.target.value)}
                          placeholder="IFSC Code"
                        />
                      </div>
                      <div>
                        <Label>Bank Name</Label>
                        <Input
                          value={gateway.configuration?.bank_name || ''}
                          onChange={(e) => handleGatewayChange(index, 'configuration.bank_name', e.target.value)}
                          placeholder="Bank Name"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => updateGateway(gateway)} 
                    disabled={saving}
                    className="w-full md:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Gateway'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySettings;
