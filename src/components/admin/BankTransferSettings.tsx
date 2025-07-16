import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building } from 'lucide-react';

interface BankSettings {
  account_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  swift_code: string;
  upi_id: string;
  branch_name: string;
  instructions: string;
  is_active: boolean;
}

const BankTransferSettings = () => {
  const [settings, setSettings] = useState<BankSettings>({
    account_name: 'TripHabibi Tourism LLC',
    bank_name: 'ADCB Bank',
    account_number: '12345678901234',
    ifsc_code: 'ADCB0000123',
    swift_code: 'ADCBAEAA',
    upi_id: 'triphabibi@oksbi',
    branch_name: 'Dubai Main Branch',
    instructions: 'Please transfer the exact amount and upload payment proof.',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveBankSettings = async () => {
    setLoading(true);
    try {
      // Update payment gateway instructions
      await supabase
        .from('payment_gateways')
        .update({
          manual_instructions: `Account Name: ${settings.account_name}
Bank Name: ${settings.bank_name}
Account Number: ${settings.account_number}
IFSC Code: ${settings.ifsc_code}
SWIFT Code: ${settings.swift_code}
UPI ID: ${settings.upi_id}
Branch: ${settings.branch_name}

${settings.instructions}`,
          enabled: settings.is_active
        })
        .eq('type', 'manual');

      toast({
        title: "Success",
        description: "Bank transfer settings saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving bank settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save bank settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof BankSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Bank Transfer Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="bank_enabled"
            checked={settings.is_active}
            onCheckedChange={(checked) => updateSetting('is_active', checked)}
          />
          <Label htmlFor="bank_enabled">Enable Bank Transfer</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="account_name">Account Name</Label>
            <Input
              id="account_name"
              value={settings.account_name}
              onChange={(e) => updateSetting('account_name', e.target.value)}
              placeholder="TripHabibi Tourism LLC"
            />
          </div>
          <div>
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              value={settings.bank_name}
              onChange={(e) => updateSetting('bank_name', e.target.value)}
              placeholder="ADCB Bank"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="account_number">Account Number</Label>
            <Input
              id="account_number"
              value={settings.account_number}
              onChange={(e) => updateSetting('account_number', e.target.value)}
              placeholder="12345678901234"
            />
          </div>
          <div>
            <Label htmlFor="ifsc_code">IFSC Code</Label>
            <Input
              id="ifsc_code"
              value={settings.ifsc_code}
              onChange={(e) => updateSetting('ifsc_code', e.target.value)}
              placeholder="ADCB0000123"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="swift_code">SWIFT Code</Label>
            <Input
              id="swift_code"
              value={settings.swift_code}
              onChange={(e) => updateSetting('swift_code', e.target.value)}
              placeholder="ADCBAEAA"
            />
          </div>
          <div>
            <Label htmlFor="upi_id">UPI ID</Label>
            <Input
              id="upi_id"
              value={settings.upi_id}
              onChange={(e) => updateSetting('upi_id', e.target.value)}
              placeholder="triphabibi@oksbi"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="branch_name">Branch Name</Label>
          <Input
            id="branch_name"
            value={settings.branch_name}
            onChange={(e) => updateSetting('branch_name', e.target.value)}
            placeholder="Dubai Main Branch"
          />
        </div>

        <div>
          <Label htmlFor="instructions">Payment Instructions</Label>
          <Textarea
            id="instructions"
            value={settings.instructions}
            onChange={(e) => updateSetting('instructions', e.target.value)}
            placeholder="Instructions for customers making bank transfers..."
            rows={4}
          />
        </div>

        <Button onClick={saveBankSettings} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Bank Transfer Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BankTransferSettings;