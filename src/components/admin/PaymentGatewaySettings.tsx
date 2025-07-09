
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Settings, Wallet, Building, Banknote } from 'lucide-react';

type GatewayName = 'razorpay' | 'stripe' | 'paypal' | 'ccavenue' | 'bank_transfer' | 'cash_on_arrival';

interface PaymentGateway {
  id?: string;
  gateway_name: GatewayName;
  display_name: string;
  description: string;
  is_enabled: boolean;
  test_mode: boolean;
  api_key: string;
  api_secret: string;
  priority: number;
  bank_details: any;
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
        .order('priority');

      if (error) throw error;
      setGateways(data || []);
    } catch (error) {
      console.error('Error fetching gateways:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment gateways",
        variant: "destructive",
      });
    }
  };

  const updateGateway = (gatewayName: GatewayName, field: string, value: any) => {
    setGateways(prev => prev.map(gateway => 
      gateway.gateway_name === gatewayName 
        ? { ...gateway, [field]: value }
        : gateway
    ));
  };

  const updateBankDetails = (gatewayName: GatewayName, field: string, value: string) => {
    setGateways(prev => prev.map(gateway => 
      gateway.gateway_name === gatewayName 
        ? { 
            ...gateway, 
            bank_details: { 
              ...gateway.bank_details, 
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
            description: gateway.description,
            is_enabled: gateway.is_enabled,
            test_mode: gateway.test_mode,
            api_key: gateway.api_key,
            api_secret: gateway.api_secret,
            priority: gateway.priority,
            bank_details: gateway.bank_details,
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

  const getEnabledCount = () => {
    return gateways.filter(g => g.is_enabled).length;
  };

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const renderGatewayCard = (gateway: PaymentGateway) => {
    return (
      <Card key={gateway.gateway_name} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getGatewayIcon(gateway.gateway_name)}
              <div>
                <CardTitle className="text-lg">{gateway.display_name}</CardTitle>
                <p className="text-sm text-gray-600">{gateway.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={gateway.is_enabled ? "default" : "secondary"}>
                    {gateway.is_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {gateway.test_mode && gateway.gateway_name !== 'cash_on_arrival' && gateway.gateway_name !== 'bank_transfer' && (
                    <Badge variant="outline">Test Mode</Badge>
                  )}
                </div>
              </div>
            </div>
            <Switch
              checked={gateway.is_enabled}
              onCheckedChange={(checked) => updateGateway(gateway.gateway_name, 'is_enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {gateway.gateway_name === 'bank_transfer' && (
            <div className="space-y-4">
              <h4 className="font-medium">Bank Transfer Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`bank_name_${gateway.gateway_name}`}>Bank Name</Label>
                  <Input
                    id={`bank_name_${gateway.gateway_name}`}
                    value={gateway.bank_details?.bank_name || ''}
                    onChange={(e) => updateBankDetails(gateway.gateway_name, 'bank_name', e.target.value)}
                    placeholder="Emirates NBD"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`account_number_${gateway.gateway_name}`}>Account Number</Label>
                  <Input
                    id={`account_number_${gateway.gateway_name}`}
                    value={gateway.bank_details?.account_number || ''}
                    onChange={(e) => updateBankDetails(gateway.gateway_name, 'account_number', e.target.value)}
                    placeholder="1234567890"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`iban_${gateway.gateway_name}`}>IBAN</Label>
                  <Input
                    id={`iban_${gateway.gateway_name}`}
                    value={gateway.bank_details?.iban || ''}
                    onChange={(e) => updateBankDetails(gateway.gateway_name, 'iban', e.target.value)}
                    placeholder="AE123456789012345678901"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`swift_${gateway.gateway_name}`}>SWIFT Code</Label>
                  <Input
                    id={`swift_${gateway.gateway_name}`}
                    value={gateway.bank_details?.swift || ''}
                    onChange={(e) => updateBankDetails(gateway.gateway_name, 'swift', e.target.value)}
                    placeholder="EBILAEAD"
                    className="bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`account_holder_${gateway.gateway_name}`}>Account Holder Name</Label>
                  <Input
                    id={`account_holder_${gateway.gateway_name}`}
                    value={gateway.bank_details?.account_holder || ''}
                    onChange={(e) => updateBankDetails(gateway.gateway_name, 'account_holder', e.target.value)}
                    placeholder="TripHabibi Tourism LLC"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {gateway.gateway_name !== 'cash_on_arrival' && gateway.gateway_name !== 'bank_transfer' && (
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
                    className="bg-white"
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
                    className="bg-white"
                  />
                </div>
              </div>
            </>
          )}

          {gateway.gateway_name === 'cash_on_arrival' && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                This payment method allows customers to pay later or upon arrival. No additional configuration required.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor={`priority_${gateway.gateway_name}`}>Display Priority</Label>
            <Input
              id={`priority_${gateway.gateway_name}`}
              type="number"
              value={gateway.priority}
              onChange={(e) => updateGateway(gateway.gateway_name, 'priority', parseInt(e.target.value))}
              placeholder="1"
              className="bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Lower number = higher priority</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Gateway Settings
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configure which payment methods are available to your customers
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {getEnabledCount()} Enabled
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Only enabled payment methods will be shown to customers</li>
              <li>• Test mode should be disabled for production use</li>
              <li>• At least one payment method should be enabled</li>
              <li>• Changes take effect immediately after saving</li>
              <li>• For bank transfer, customers will see the bank details during checkout</li>
            </ul>
          </div>

          <div className="space-y-4">
            {gateways.map(gateway => renderGatewayCard(gateway))}
          </div>
          
          <Button 
            onClick={saveGateways} 
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? 'Saving...' : 'Save Payment Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewaySettings;
