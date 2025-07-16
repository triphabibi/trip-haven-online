-- Insert missing site settings for currency functionality
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('display_currency', 'USD', 'text', 'Default display currency'),
('usd_to_inr_rate', '83.0', 'number', 'USD to INR exchange rate')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value,
updated_at = now();