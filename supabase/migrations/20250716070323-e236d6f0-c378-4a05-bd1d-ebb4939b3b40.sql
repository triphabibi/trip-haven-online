-- Create admin panel settings for bank transfer details
CREATE TABLE IF NOT EXISTS bank_transfer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL DEFAULT 'TripHabibi Tourism LLC',
  bank_name TEXT NOT NULL DEFAULT 'ADCB Bank',
  account_number TEXT NOT NULL DEFAULT '12345678901234',
  ifsc_code TEXT DEFAULT 'ADCB0000123',
  swift_code TEXT DEFAULT 'ADCBAEAA',
  upi_id TEXT DEFAULT 'triphabibi@oksbi',
  branch_name TEXT DEFAULT 'Dubai Main Branch',
  instructions TEXT DEFAULT 'Please transfer the exact amount and upload payment proof.',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bank_transfer_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin full access bank transfer settings" 
ON bank_transfer_settings 
FOR ALL 
USING (true);

CREATE POLICY "Public can view active bank settings" 
ON bank_transfer_settings 
FOR SELECT 
USING (is_active = true);

-- Insert default settings
INSERT INTO bank_transfer_settings (account_name, bank_name, account_number, ifsc_code, swift_code, upi_id, branch_name, instructions)
VALUES (
  'TripHabibi Tourism LLC',
  'ADCB Bank',
  '12345678901234',
  'ADCB0000123',
  'ADCBAEAA',
  'triphabibi@oksbi',
  'Dubai Main Branch',
  'Please transfer the exact amount mentioned below to our bank account. After payment, upload your receipt/screenshot as proof of payment.'
) ON CONFLICT DO NOTHING;

-- Update payment_gateways table to include bank transfer with proper instructions
INSERT INTO payment_gateways (name, type, enabled, manual_instructions)
VALUES (
  'Bank Transfer',
  'bank_transfer', 
  true,
  'Account Name: TripHabibi Tourism LLC
Bank Name: ADCB Bank
Account Number: 12345678901234
IFSC Code: ADCB0000123
SWIFT Code: ADCBAEAA
UPI ID: triphabibi@oksbi
Branch: Dubai Main Branch

Please transfer the exact amount and upload payment proof.'
) 
ON CONFLICT (type) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  manual_instructions = EXCLUDED.manual_instructions;

-- Ensure SMTP settings table has a single row with default configuration
INSERT INTO email_settings (smtp_host, smtp_port, smtp_user, smtp_password, from_name, from_email, is_enabled)
VALUES ('smtp.hostinger.com', 465, 'info@triphabibi.in', 'Larroad%%@1', 'TripHabibi', 'info@triphabibi.in', true)
ON CONFLICT DO NOTHING;