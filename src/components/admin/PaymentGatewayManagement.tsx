
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Settings, 
  Wallet, 
  Building2, 
  Banknote,
  Eye,
  EyeOff,
  TestTube
} from 'lucide-react';

const PaymentGatewayManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('priority');
      
      if (error) throw error;
      return data;
    },
  });

  const updateGatewayMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_gateways'] });
      toast({ title: "Payment gateway updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating gateway", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

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

  const toggleGateway = (id: string, enabled: boolean) => {
    updateGatewayMutation.mutate({ 
      id, 
      updates: { is_enabled: enabled } 
    });
  };

  const updateGatewayConfig = (id: string, field: string, value: any) => {
    updateGatewayMutation.mutate({
      id,
      updates: { [field]: value }
    });
  };

  const toggleSecretVisibility = (gatewayId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payment gateways...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payment Gateway Management</h2>
          <p className="text-gray-600">Configure and manage payment methods</p>
        </div>
      </div>

      {/* Gateway Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gateways?.map((gateway) => (
          <Card key={gateway.id} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getGatewayIcon(gateway.gateway_name)}
                  <div>
                    <h3 className="font-semibold">{gateway.display_name}</h3>
                    <p className="text-sm text-gray-500 font-normal">{gateway.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {gateway.test_mode && (
                    <Badge variant="outline" className="text-orange-600">
                      <TestTube className="h-3 w-3 mr-1" />
                      Test Mode
                    </Badge>
                  )}
                  <Switch
                    checked={gateway.is_enabled}
                    onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Priority */}
              <div>
                <Label htmlFor={`priority-${gateway.id}`}>Display Priority</Label>
                <Input
                  id={`priority-${gateway.id}`}
                  type="number"
                  value={gateway.priority || 0}
                  onChange={(e) => updateGatewayConfig(gateway.id, 'priority', parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>

              {/* API Configuration */}
              {(gateway.gateway_name === 'razorpay' || gateway.gateway_name === 'stripe') && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`api-key-${gateway.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`api-key-${gateway.id}`}
                        type={showSecrets[gateway.id] ? 'text' : 'password'}
                        value={gateway.api_key || ''}
                        onChange={(e) => updateGatewayConfig(gateway.id, 'api_key', e.target.value)}
                        placeholder="Enter API Key"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility(gateway.id)}
                      >
                        {showSecrets[gateway.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`api-secret-${gateway.id}`}>API Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`api-secret-${gateway.id}`}
                        type={showSecrets[gateway.id] ? 'text' : 'password'}
                        value={gateway.api_secret || ''}
                        onChange={(e) => updateGatewayConfig(gateway.id, 'api_secret', e.target.value)}
                        placeholder="Enter API Secret"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility(gateway.id)}
                      >
                        {showSecrets[gateway.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Mode</Label>
                  <p className="text-sm text-gray-500">Use sandbox/test environment</p>
                </div>
                <Switch
                  checked={gateway.test_mode}
                  onCheckedChange={(checked) => updateGatewayConfig(gateway.id, 'test_mode', checked)}
                />
              </div>

              {/* Amount Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`min-amount-${gateway.id}`}>Min Amount</Label>
                  <Input
                    id={`min-amount-${gateway.id}`}
                    type="number"
                    value={gateway.min_amount || 0}
                    onChange={(e) => updateGatewayConfig(gateway.id, 'min_amount', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor={`max-amount-${gateway.id}`}>Max Amount</Label>
                  <Input
                    id={`max-amount-${gateway.id}`}
                    type="number"
                    value={gateway.max_amount || ''}
                    onChange={(e) => updateGatewayConfig(gateway.id, 'max_amount', e.target.value ? parseFloat(e.target.value) : null)}
                    min="0"
                    step="0.01"
                    placeholder="No limit"
                  />
                </div>
              </div>

              {/* Supported Currencies */}
              <div>
                <Label>Supported Currencies</Label>
                <div className="flex gap-1 mt-1">
                  {gateway.supported_currencies?.map((currency) => (
                    <Badge key={currency} variant="secondary">{currency}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="default-currency">Default Currency</Label>
              <Select defaultValue="AED">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="payment-timeout">Payment Timeout (minutes)</Label>
              <Input
                id="payment-timeout"
                type="number"
                defaultValue="15"
                min="5"
                max="60"
              />
            </div>
            
            <div>
              <Label htmlFor="auto-capture">Auto Capture Payments</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="auto-capture" defaultChecked />
                <Label htmlFor="auto-capture" className="text-sm">Enable</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentGatewayManagement;
