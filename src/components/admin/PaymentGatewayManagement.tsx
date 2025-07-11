import { useState } from 'react';
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
  XCircle
} from 'lucide-react';

const PaymentGatewayManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [bankDetails, setBankDetails] = useState<Record<string, any>>({});

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
      toast({ 
        title: "✅ Payment gateway updated successfully",
        className: "bg-green-50 border-green-200"
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "❌ Error updating gateway", 
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

  const getGatewayCardClass = (gateway: any) => {
    if (gateway.is_enabled) {
      return "border-2 border-green-200 bg-green-50/30 shadow-lg";
    }
    return "border-2 border-gray-200 bg-gray-50/30";
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

  const updateBankDetails = (gatewayId: string, field: string, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [gatewayId]: {
        ...prev[gatewayId],
        [field]: value
      }
    }));
  };

  const saveBankDetails = (gateway: any) => {
    const details = bankDetails[gateway.id] || {};
    const existingBankDetails = gateway.bank_details as any || {};
    const bankDetailsObj = {
      bank_name: details.bank_name || existingBankDetails.bank_name || '',
      account_number: details.account_number || existingBankDetails.account_number || '',
      iban: details.iban || existingBankDetails.iban || '',
      swift: details.swift || existingBankDetails.swift || '',
      account_holder: details.account_holder || existingBankDetails.account_holder || '',
      branch: details.branch || existingBankDetails.branch || '',
      address: details.address || existingBankDetails.address || ''
    };

    updateGatewayMutation.mutate({
      id: gateway.id,
      updates: {
        bank_details: bankDetailsObj,
        ifsc_code: details.ifsc_code || gateway.ifsc_code || '',
        country: details.country || gateway.country || 'UAE',
        instructions: details.instructions || gateway.instructions || ''
      }
    });
  };

  const toggleSecretVisibility = (gatewayId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  if (isLoading) {
    return <div className="text-center py-8 text-lg">🔄 Loading payment gateways...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💳 Payment Gateway Management
          </h2>
          <p className="text-gray-600">Configure and manage payment methods</p>
        </div>
      </div>

      {/* Gateway Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gateways?.map((gateway) => (
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
                  onChange={(e) => updateGatewayConfig(gateway.id, 'priority', parseInt(e.target.value))}
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>

              {/* API Configuration for Razorpay/Stripe */}
              {(gateway.gateway_name === 'razorpay' || gateway.gateway_name === 'stripe') && (
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

              {/* Bank Transfer Configuration */}
              {gateway.gateway_name === 'bank_transfer' && (
                <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800">🏦 Bank Account Details</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Country</Label>
                      <Select 
                        value={bankDetails[gateway.id]?.country || gateway.country || 'UAE'}
                        onValueChange={(value) => updateBankDetails(gateway.id, 'country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                          <SelectItem value="USA">🇺🇸 USA</SelectItem>
                          <SelectItem value="IND">🇮🇳 India</SelectItem>
                          <SelectItem value="UK">🇬🇧 UK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        value={bankDetails[gateway.id]?.bank_name || (gateway.bank_details as any)?.bank_name || ''}
                        onChange={(e) => updateBankDetails(gateway.id, 'bank_name', e.target.value)}
                        placeholder="Emirates NBD"
                      />
                    </div>
                    
                    <div>
                      <Label>Account Holder</Label>
                      <Input
                        value={bankDetails[gateway.id]?.account_holder || (gateway.bank_details as any)?.account_holder || ''}
                        onChange={(e) => updateBankDetails(gateway.id, 'account_holder', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    
                    <div>
                      <Label>Account Number</Label>
                      <Input
                        value={bankDetails[gateway.id]?.account_number || (gateway.bank_details as any)?.account_number || ''}
                        onChange={(e) => updateBankDetails(gateway.id, 'account_number', e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                    
                    <div>
                      <Label>IBAN</Label>
                      <Input
                        value={bankDetails[gateway.id]?.iban || (gateway.bank_details as any)?.iban || ''}
                        onChange={(e) => updateBankDetails(gateway.id, 'iban', e.target.value)}
                        placeholder="AE070260001234567890"
                      />
                    </div>
                    
                    <div>
                      <Label>SWIFT/IFSC Code</Label>
                      <Input
                        value={bankDetails[gateway.id]?.ifsc_code || gateway.ifsc_code || ''}
                        onChange={(e) => updateBankDetails(gateway.id, 'ifsc_code', e.target.value)}
                        placeholder="EBILAEAD"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Branch Address</Label>
                    <Input
                      value={bankDetails[gateway.id]?.address || (gateway.bank_details as any)?.address || ''}
                      onChange={(e) => updateBankDetails(gateway.id, 'address', e.target.value)}
                      placeholder="Branch address"
                    />
                  </div>
                  
                  <div>
                    <Label>Instructions for Customers</Label>
                    <Textarea
                      value={bankDetails[gateway.id]?.instructions || gateway.instructions || ''}
                      onChange={(e) => updateBankDetails(gateway.id, 'instructions', e.target.value)}
                      placeholder="Instructions for bank transfer..."
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => saveBankDetails(gateway)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Bank Details
                  </Button>
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
                    onChange={(e) => updateGatewayConfig(gateway.id, 'min_amount', parseFloat(e.target.value))}
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
                  {gateway.supported_currencies?.map((currency) => (
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

      {/* Global Payment Settings */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Settings className="h-5 w-5" />
            🌐 Global Payment Settings
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
                  <SelectItem value="AED">🇦🇪 AED - UAE Dirham</SelectItem>
                  <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                  <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
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