
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, CreditCard, Eye, EyeOff, Save } from 'lucide-react';

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  priority: number;
  api_key: string;
  api_secret: string;
  test_mode: boolean;
  min_amount: number;
  max_amount: number;
  supported_currencies: string[];
}

const PaymentGatewayManagement = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['payment_gateways_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('priority');
      
      if (error) throw error;
      return data as PaymentGateway[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PaymentGateway> & { id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['payment_gateways_admin'] });
      toast({ title: "Payment gateway updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating payment gateway", description: error.message, variant: "destructive" });
    }
  });

  const handleUpdate = (gateway: PaymentGateway, field: string, value: any) => {
    updateMutation.mutate({ id: gateway.id, [field]: value });
  };

  const toggleSecretVisibility = (gatewayId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return '💳';
      case 'stripe':
        return '🔵';
      case 'paypal':
        return '🟡';
      case 'bank_transfer':
        return '🏦';
      case 'cash_on_arrival':
        return '💰';
      default:
        return '💳';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payment gateways...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Payment Gateway Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure and manage payment methods for your booking system
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {gateways?.map((gateway) => (
          <Card key={gateway.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getGatewayIcon(gateway.gateway_name)}</span>
                  <div>
                    <h3 className="font-semibold">{gateway.display_name}</h3>
                    <p className="text-sm text-gray-600 font-normal">{gateway.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={gateway.is_enabled}
                    onCheckedChange={(checked) => handleUpdate(gateway, 'is_enabled', checked)}
                  />
                  <span className="text-sm">
                    {gateway.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`display_name_${gateway.id}`}>Display Name</Label>
                  <Input
                    id={`display_name_${gateway.id}`}
                    value={gateway.display_name}
                    onChange={(e) => handleUpdate(gateway, 'display_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`priority_${gateway.id}`}>Priority</Label>
                  <Input
                    id={`priority_${gateway.id}`}
                    type="number"
                    value={gateway.priority}
                    onChange={(e) => handleUpdate(gateway, 'priority', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description_${gateway.id}`}>Description</Label>
                <Textarea
                  id={`description_${gateway.id}`}
                  value={gateway.description || ''}
                  onChange={(e) => handleUpdate(gateway, 'description', e.target.value)}
                  rows={2}
                />
              </div>

              {(gateway.gateway_name === 'razorpay' || gateway.gateway_name === 'stripe') && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`api_key_${gateway.id}`}>API Key</Label>
                    <div className="relative">
                      <Input
                        id={`api_key_${gateway.id}`}
                        type={showSecrets[gateway.id] ? 'text' : 'password'}
                        value={gateway.api_key || ''}
                        onChange={(e) => handleUpdate(gateway, 'api_key', e.target.value)}
                        placeholder="Enter API key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleSecretVisibility(gateway.id)}
                      >
                        {showSecrets[gateway.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`api_secret_${gateway.id}`}>API Secret</Label>
                    <div className="relative">
                      <Input
                        id={`api_secret_${gateway.id}`}
                        type={showSecrets[gateway.id] ? 'text' : 'password'}
                        value={gateway.api_secret || ''}
                        onChange={(e) => handleUpdate(gateway, 'api_secret', e.target.value)}
                        placeholder="Enter API secret"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => toggleSecretVisibility(gateway.id)}
                      >
                        {showSecrets[gateway.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`min_amount_${gateway.id}`}>Minimum Amount</Label>
                  <Input
                    id={`min_amount_${gateway.id}`}
                    type="number"
                    step="0.01"
                    value={gateway.min_amount || 0}
                    onChange={(e) => handleUpdate(gateway, 'min_amount', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor={`max_amount_${gateway.id}`}>Maximum Amount</Label>
                  <Input
                    id={`max_amount_${gateway.id}`}
                    type="number"
                    step="0.01"
                    value={gateway.max_amount || ''}
                    onChange={(e) => handleUpdate(gateway, 'max_amount', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="No limit"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={gateway.test_mode}
                    onCheckedChange={(checked) => handleUpdate(gateway, 'test_mode', checked)}
                  />
                  <Label>Test Mode</Label>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Supported Currencies:</span>
                <span className="text-gray-600">
                  {gateway.supported_currencies?.join(', ') || 'AED, USD, EUR'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewayManagement;
