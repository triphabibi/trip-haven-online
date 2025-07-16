
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Save, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CurrencySettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: string) => void;
  onSettingUpdate: (key: string, value: string) => void;
}

const CurrencySettings = ({ settings, onSettingChange, onSettingUpdate }: CurrencySettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSaveExchangeRate = async () => {
    setIsUpdating(true);
    try {
      const rate = parseFloat(settings.usd_to_inr_rate || '86');
      if (isNaN(rate) || rate <= 0) {
        throw new Error('Please enter a valid exchange rate greater than 0');
      }
      
      await onSettingUpdate('usd_to_inr_rate', rate.toString());
      
      toast({
        title: "Success",
        description: `Exchange rate updated to ₹${rate} per USD! This will be used for all future payments.`,
      });
      
      // Refresh the page after a short delay to reload exchange rates
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to update exchange rate",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Currency Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="default_currency">Default Currency</Label>
          <Select 
            value={settings.default_currency || 'INR'} 
            onValueChange={(value) => onSettingUpdate('default_currency', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
              <SelectItem value="USD">USD (US Dollar)</SelectItem>
              <SelectItem value="EUR">EUR (Euro)</SelectItem>
              <SelectItem value="GBP">GBP (British Pound)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="auto_currency_conversion"
            checked={settings.auto_currency_conversion === 'true'}
            onCheckedChange={(checked) => onSettingUpdate('auto_currency_conversion', checked.toString())}
          />
          <Label htmlFor="auto_currency_conversion">Enable Auto Currency Conversion</Label>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="usd_to_inr_rate">USD to INR Exchange Rate</Label>
          <div className="flex gap-2">
            <Input
              id="usd_to_inr_rate"
              type="number"
              step="0.01"
              value={settings.usd_to_inr_rate || '86'}
              onChange={(e) => onSettingChange('usd_to_inr_rate', e.target.value)}
              placeholder="86.00"
              className="flex-1"
            />
            <Button 
              onClick={handleSaveExchangeRate}
              disabled={isUpdating}
              size="sm"
              className="px-4"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium">
              Current Rate: <span className="text-primary">1 USD = ₹{settings.usd_to_inr_rate || '86'}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This rate is used for Razorpay payments. Update this manually when exchange rates change.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stripe_currency">Stripe Currency</Label>
            <Input
              id="stripe_currency"
              value={settings.stripe_currency || 'USD'}
              onChange={(e) => onSettingChange('stripe_currency', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paypal_currency">PayPal Currency</Label>
            <Input
              id="paypal_currency"
              value={settings.paypal_currency || 'USD'}
              onChange={(e) => onSettingChange('paypal_currency', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
