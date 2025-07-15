import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Settings, Banknote, DollarSign, Globe, Shield } from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'api' | 'manual';
  api_key?: string;
  api_secret?: string;
  manual_instructions?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function PaymentGatewayManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localGateways, setLocalGateways] = useState<PaymentGateway[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['payment-gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PaymentGateway[];
    }
  });

  useEffect(() => {
    if (gateways) {
      setLocalGateways(gateways);
      setHasChanges(false);
    }
  }, [gateways]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = localGateways.map(gateway => {
        const { created_at, updated_at, ...updateData } = gateway;
        return updateData;
      });

      const { error } = await supabase
        .from('payment_gateways')
        .upsert(updates);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment gateway settings saved successfully!"
      });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['payment-gateways'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save payment gateway settings",
        variant: "destructive"
      });
    }
  });

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'paypal':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'bank_transfer':
        return <Banknote className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <DollarSign className="h-5 w-5 text-orange-600" />;
      case 'ccavenue':
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const updateGateway = (id: string, field: string, value: any) => {
    setLocalGateways(prev => prev.map(gateway => 
      gateway.id === id ? { ...gateway, [field]: value } : gateway
    ));
    setHasChanges(true);
  };

  const renderGatewayCard = (gateway: PaymentGateway) => {
    const isAPI = gateway.type === 'api';
    
    return (
      <Card key={gateway.id} className={`transition-all duration-200 ${gateway.enabled ? 'ring-2 ring-primary/20' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getGatewayIcon(gateway.name)}
              <span className="capitalize">{gateway.name.replace('_', ' ')}</span>
              <Badge variant={gateway.type === 'api' ? 'default' : 'secondary'}>
                {gateway.type.toUpperCase()}
              </Badge>
            </div>
            <Switch
              checked={gateway.enabled}
              onCheckedChange={(checked) => updateGateway(gateway.id, 'enabled', checked)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAPI ? (
            <>
              <div className="space-y-2">
                <Label htmlFor={`api_key_${gateway.id}`}>API Key</Label>
                <Input
                  id={`api_key_${gateway.id}`}
                  type="password"
                  placeholder="Enter API Key"
                  value={gateway.api_key || ''}
                  onChange={(e) => updateGateway(gateway.id, 'api_key', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`api_secret_${gateway.id}`}>API Secret</Label>
                <Input
                  id={`api_secret_${gateway.id}`}
                  type="password"
                  placeholder="Enter API Secret"
                  value={gateway.api_secret || ''}
                  onChange={(e) => updateGateway(gateway.id, 'api_secret', e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`instructions_${gateway.id}`}>Payment Instructions</Label>
              <Textarea
                id={`instructions_${gateway.id}`}
                placeholder={`Enter ${gateway.name === 'bank_transfer' ? 'bank account details, IFSC code, UPI ID' : 'cash payment instructions'}`}
                value={gateway.manual_instructions || ''}
                onChange={(e) => updateGateway(gateway.id, 'manual_instructions', e.target.value)}
                rows={4}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const enabledCount = localGateways.filter(g => g.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Gateway Management</h2>
          <p className="text-muted-foreground">
            Configure payment methods for your booking system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {enabledCount} of {localGateways.length} enabled
          </Badge>
          {hasChanges && (
            <Badge variant="secondary">
              Unsaved Changes
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {localGateways.map(renderGatewayCard)}
      </div>

      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            size="lg"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}

