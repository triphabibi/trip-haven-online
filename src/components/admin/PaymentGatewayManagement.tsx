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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Settings, 
  Wallet, 
  Building2, 
  Banknote,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const PaymentGatewayManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [localGateways, setLocalGateways] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: gateways, isLoading, error } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: async () => {
      console.log('🔍 Fetching payment gateways...');
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('priority');
      
      if (error) {
        console.error('❌ Error fetching gateways:', error);
        throw error;
      }
      
      console.log('✅ Gateways fetched:', data);
      return data;
    },
  });

  // Initialize local state when data is loaded
  useEffect(() => {
    if (gateways && gateways.length > 0) {
      console.log('🔄 Initializing local gateways state with:', gateways);
      setLocalGateways([...gateways]);
      setHasChanges(false);
    }
  }, [gateways]);

  const getGatewayIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'paypal':
        return <Wallet className="h-5 w-5 text-yellow-600" />;
      case 'ccavenue':
        return <CreditCard className="h-5 w-5 text-red-600" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getGatewayCardClass = (gateway: any) => {
    if (gateway.is_enabled) {
      return "border-2 border-green-200 bg-green-50/30 shadow-lg";
    }
    return "border-2 border-gray-200 bg-gray-50/30";
  };

  const updateLocalGateway = (id: string, field: string, value: any) => {
    console.log(`🔄 Updating gateway ${id}, field: ${field}, value:`, value);
    setLocalGateways(prev => {
      const updated = prev.map(gateway => 
        gateway.id === id ? { ...gateway, [field]: value } : gateway
      );
      console.log('📝 Updated local gateways:', updated);
      return updated;
    });
    setHasChanges(true);
  };

  const toggleGateway = (id: string, enabled: boolean) => {
    console.log(`🔄 Toggling gateway ${id} to ${enabled}`);
    updateLocalGateway(id, 'is_enabled', enabled);
  };

  const updateGatewayConfig = (id: string, field: string, value: any) => {
    updateLocalGateway(id, field, value);
  };

  const saveAllChanges = async () => {
    if (!hasChanges || localGateways.length === 0) {
      console.log('⚠️ No changes to save');
      return;
    }

    setIsSaving(true);
    console.log('💾 Starting to save all gateways:', localGateways);

    try {
      // Update each gateway individually with proper error handling
      const updatePromises = localGateways.map(async (gateway) => {
        console.log(`💾 Updating gateway ${gateway.gateway_name} (${gateway.id}):`, {
          is_enabled: gateway.is_enabled,
          priority: gateway.priority
        });

        const { data, error } = await supabase
          .from('payment_gateways')
          .update({
            is_enabled: gateway.is_enabled,
            priority: gateway.priority,
            api_key: gateway.api_key || '',
            api_secret: gateway.api_secret || '',
            min_amount: gateway.min_amount || 0,
            max_amount: gateway.max_amount,
            bank_details: gateway.bank_details,
            ifsc_code: gateway.ifsc_code,
            country: gateway.country,
            instructions: gateway.instructions
          })
          .eq('id', gateway.id)
          .select()
          .single();

        if (error) {
          console.error(`❌ Error updating ${gateway.gateway_name}:`, error);
          throw new Error(`Failed to update ${gateway.display_name}: ${error.message}`);
        }

        console.log(`✅ Successfully updated ${gateway.gateway_name}:`, data);
        return data;
      });

      await Promise.all(updatePromises);

      // Refresh the data from the server
      await queryClient.invalidateQueries({ queryKey: ['payment_gateways'] });
      
      setHasChanges(false);
      
      const enabledCount = localGateways.filter(g => g.is_enabled).length;
      
      toast({ 
        title: "✅ Payment Settings Saved Successfully!",
        description: `${enabledCount} payment gateways are now enabled and active.`,
        className: "bg-green-50 border-green-200"
      });

      console.log('🎉 All gateways saved successfully!');

    } catch (error: any) {
      console.error('❌ Error saving gateways:', error);
      toast({ 
        title: "❌ Error Saving Payment Settings", 
        description: error.message || "Failed to save payment gateway settings. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    if (gateways) {
      setLocalGateways([...gateways]);
      setHasChanges(false);
      toast({
        title: "🔄 Changes Reset",
        description: "All unsaved changes have been discarded.",
      });
    }
  };

  const toggleSecretVisibility = (gatewayId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading payment gateways...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg text-red-600">Error loading payment gateways</p>
          <p className="text-sm text-gray-500">Please refresh the page to try again</p>
        </div>
      </div>
    );
  }

  const enabledCount = localGateways.filter(g => g.is_enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💳 Payment Gateway Management
          </h2>
          <p className="text-gray-600">Configure and manage payment methods</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800">
              {enabledCount} of {localGateways.length} Enabled
            </Badge>
            {hasChanges && (
              <Badge className="bg-orange-100 text-orange-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex gap-2">
            <Button 
              onClick={resetChanges}
              variant="outline"
              disabled={isSaving}
            >
              Reset Changes
            </Button>
            <Button 
              onClick={saveAllChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Gateway Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {localGateways?.map((gateway) => (
          <Card key={gateway.id} className={getGatewayCardClass(gateway)}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getGatewayIcon(gateway.gateway_name)}
                  <div>
                    <h3 className="font-semibold">{gateway.display_name}</h3>
                    <p className="text-sm text-gray-500 font-normal">{gateway.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {gateway.is_enabled ? (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      <XCircle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                  <Switch
                    checked={gateway.is_enabled}
                    onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Priority */}
              <div>
                <Label htmlFor={`priority-${gateway.id}`} className="text-sm font-medium text-gray-700">
                  Display Priority
                </Label>
                <Input
                  id={`priority-${gateway.id}`}
                  type="number"
                  value={gateway.priority || 0}
                  onChange={(e) => updateGatewayConfig(gateway.id, 'priority', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>

              {/* API Configuration for Razorpay/Stripe */}
              {(gateway.gateway_name === 'razorpay' || gateway.gateway_name === 'stripe' || gateway.gateway_name === 'ccavenue' || gateway.gateway_name === 'paypal') && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800">API Configuration</h4>
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

              {/* Cash on Arrival Configuration */}
              {gateway.gateway_name === 'cash_on_arrival' && (
                <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800">💰 Cash Payment Instructions</h4>
                  <div>
                    <Label>Instructions for Customers</Label>
                    <Textarea
                      value={gateway.instructions || ''}
                      onChange={(e) => updateGatewayConfig(gateway.id, 'instructions', e.target.value)}
                      placeholder="Instructions for cash payment..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Amount Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`min-amount-${gateway.id}`}>Min Amount (AED)</Label>
                  <Input
                    id={`min-amount-${gateway.id}`}
                    type="number"
                    value={gateway.min_amount || 0}
                    onChange={(e) => updateGatewayConfig(gateway.id, 'min_amount', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor={`max-amount-${gateway.id}`}>Max Amount (AED)</Label>
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
                <div className="flex gap-1 mt-1 flex-wrap">
                  {gateway.supported_currencies?.map((currency: string) => (
                    <Badge key={currency} variant="secondary" className="bg-blue-100 text-blue-800">
                      {currency}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button at Bottom */}
      {hasChanges && (
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">💾 You have unsaved changes</h3>
                <p className="text-green-700">
                  {enabledCount} payment gateways will be enabled after saving.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={resetChanges}
                  variant="outline"
                  disabled={isSaving}
                >
                  Reset
                </Button>
                <Button 
                  onClick={saveAllChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving Changes...' : `Save ${enabledCount} Payment Methods`}
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