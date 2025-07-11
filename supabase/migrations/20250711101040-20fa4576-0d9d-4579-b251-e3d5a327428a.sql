-- Update bank transfer gateway with proper bank details
UPDATE payment_gateways 
SET bank_details = '{"bank_name": "Emirates NBD", "account_number": "1234567890", "iban": "AE123456789012345678901", "swift": "EBILAEAD", "account_holder": "TripHabibi Tourism LLC"}'::jsonb
WHERE gateway_name = 'bank_transfer';

-- Update payment gateway descriptions and priorities for better ordering
UPDATE payment_gateways 
SET 
  description = 'Pay securely with credit/debit cards, UPI, wallets',
  priority = 1
WHERE gateway_name = 'razorpay';

UPDATE payment_gateways 
SET 
  description = 'International payment processing with credit/debit cards',
  priority = 2
WHERE gateway_name = 'stripe';

UPDATE payment_gateways 
SET 
  description = 'Direct bank transfer to our account',
  priority = 3
WHERE gateway_name = 'bank_transfer';

UPDATE payment_gateways 
SET 
  description = 'Pay when you arrive or meet our representative',
  priority = 4
WHERE gateway_name = 'cash_on_arrival';