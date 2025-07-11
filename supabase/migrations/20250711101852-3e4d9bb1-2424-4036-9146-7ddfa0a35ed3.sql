-- Add additional fields for bank transfer details
ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'UAE';
ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS instructions TEXT;

-- Update bank transfer with IFSC and instructions
UPDATE payment_gateways 
SET 
  bank_details = jsonb_build_object(
    'bank_name', 'Emirates NBD',
    'account_number', '1012345678901',
    'iban', 'AE070260001012345678901',
    'swift', 'EBILAEAD',
    'account_holder', 'TripHabibi Tourism LLC',
    'branch', 'Dubai Main Branch',
    'address', 'Sheikh Zayed Road, Dubai, UAE'
  ),
  ifsc_code = 'EBILAEAD',
  country = 'UAE',
  instructions = 'Please mention your booking reference number in the transfer description for quick processing. Transfer confirmation will be processed within 2-4 hours during business hours.'
WHERE gateway_name = 'bank_transfer';

-- Update cash on arrival with instructions
UPDATE payment_gateways 
SET 
  instructions = 'You can pay in cash at the pickup location or when you meet our representative. Please ensure you have the exact amount or we will provide change. Cash payment is accepted in AED, USD, or EUR.'
WHERE gateway_name = 'cash_on_arrival';