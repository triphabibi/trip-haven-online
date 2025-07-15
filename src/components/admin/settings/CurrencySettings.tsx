
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DollarSign } from 'lucide-react';

interface CurrencySettingsProps {
  settings: Record<string, any>;
  onSettingChange: (key: string, value: string) => void;
  onSettingUpdate: (key: string, value: string) => void;
}

const CurrencySettings = ({ settings, onSettingChange, onSettingUpdate }: CurrencySettingsProps) => {
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
        
        <div>
          <Label htmlFor="usd_to_inr_rate">USD to INR Exchange Rate</Label>
          <Input
            id="usd_to_inr_rate"
            type="number"
            step="0.01"
            value={settings.usd_to_inr_rate || '86'}
            onChange={(e) => onSettingChange('usd_to_inr_rate', e.target.value)}
            placeholder="86.00"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Current rate: 1 USD = {settings.usd_to_inr_rate || '86'} INR
          </p>
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
