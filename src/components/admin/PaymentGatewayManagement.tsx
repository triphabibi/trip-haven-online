
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Settings } from 'lucide-react';

const PaymentGatewayManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingGateway, setEditingGateway] = useState<string | null>(null);

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
      setEditingGateway(null);
    },
    onError: (error: any) => {
      toast({ title: "Error updating gateway", description: error.message, variant: "destructive" });
    }
  });

  const toggleGateway = (id: string, enabled: boolean) => {
    updateGatewayMutation.mutate({ 
      id, 
      updates: { is_enabled: enabled } 
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading payment gateways...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways?.map((gateway) => (
              <Card key={gateway.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{gateway.display_name}</h3>
                  <Switch
                    checked={gateway.is_enabled}
                    onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                  />
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{gateway.description}</p>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Priority:</span> {gateway.priority}
                  </div>
                  <div>
                    <span className="font-medium">Currencies:</span> {gateway.supported_currencies?.join(', ')}
                  </div>
                  {gateway.min_amount && (
                    <div>
                      <span className="font-medium">Min Amount:</span> {gateway.min_amount}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setEditingGateway(gateway.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingGateway && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Gateway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Enter API Key" />
                </div>
                <div>
                  <Label>API Secret</Label>
                  <Input type="password" placeholder="Enter API Secret" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setEditingGateway(null)}>
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => setEditingGateway(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentGatewayManagement;
