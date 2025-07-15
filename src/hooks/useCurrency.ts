
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRate {
  from_currency: string;
  to_currency: string;
  rate: number;
}

export const useCurrency = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [baseCurrency] = useState('USD'); // Base currency for all prices in database
  const [displayCurrency, setDisplayCurrency] = useState('USD'); // Admin configurable display currency
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrencySettings();
    loadExchangeRates();
  }, []);

  const loadCurrencySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'display_currency')
        .single();

      if (!error && data) {
        setDisplayCurrency(data.setting_value);
      }
    } catch (error) {
      console.error('Error loading currency settings:', error);
    }
  };

  const loadExchangeRates = async () => {
    try {
      setIsLoading(true);
      
      // Get live rates from a free API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates) {
        const ratesList: CurrencyRate[] = [];
        
        // Convert rates to our format
        Object.entries(data.rates).forEach(([currency, rate]) => {
          ratesList.push({ from_currency: 'USD', to_currency: currency, rate: rate as number });
          ratesList.push({ from_currency: currency, to_currency: 'USD', rate: 1 / (rate as number) });
        });
        
        // Add AED rates (commonly used in UAE)
        const aedRate = data.rates.AED || 3.67;
        ratesList.push({ from_currency: 'USD', to_currency: 'AED', rate: aedRate });
        ratesList.push({ from_currency: 'AED', to_currency: 'USD', rate: 1 / aedRate });
        
        setRates(ratesList);
      }
    } catch (error) {
      console.error('Error loading exchange rates, using fallback rates:', error);
      // Fallback rates
      setRates([
        { from_currency: 'USD', to_currency: 'INR', rate: 83.50 },
        { from_currency: 'INR', to_currency: 'USD', rate: 0.012 },
        { from_currency: 'USD', to_currency: 'AED', rate: 3.67 },
        { from_currency: 'AED', to_currency: 'USD', rate: 0.27 },
        { from_currency: 'USD', to_currency: 'EUR', rate: 0.92 },
        { from_currency: 'EUR', to_currency: 'USD', rate: 1.09 },
        { from_currency: 'AED', to_currency: 'INR', rate: 22.75 },
        { from_currency: 'INR', to_currency: 'AED', rate: 0.044 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const convertPrice = (price: number, fromCurrency: string = baseCurrency, toCurrency: string = displayCurrency): number => {
    if (fromCurrency === toCurrency) return price;
    
    // Find direct conversion rate
    const directRate = rates.find(r => 
      r.from_currency === fromCurrency && r.to_currency === toCurrency
    );
    
    if (directRate) {
      return price * directRate.rate;
    }
    
    // If direct rate not found, convert through USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const toUSDRate = rates.find(r => r.from_currency === fromCurrency && r.to_currency === 'USD');
      const fromUSDRate = rates.find(r => r.from_currency === 'USD' && r.to_currency === toCurrency);
      
      if (toUSDRate && fromUSDRate) {
        return price * toUSDRate.rate * fromUSDRate.rate;
      }
    }
    
    return price; // Return original price if no conversion found
  };

  const formatPrice = (price: number, currency: string = displayCurrency, showSymbol: boolean = true): string => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AED': 'د.إ'
    };
    
    const formattedNumber = Math.round(price).toLocaleString();
    
    if (!showSymbol) return formattedNumber;
    
    const symbol = symbols[currency] || currency + ' ';
    return `${symbol}${formattedNumber}`;
  };

  // Convert price for payment gateway (based on gateway requirements)
  const convertForPayment = (price: number, paymentMethod: string): { amount: number; currency: string } => {
    switch (paymentMethod) {
      case 'razorpay':
      case 'ccavenue':
        // Convert to INR for Indian payment gateways
        const inrAmount = convertPrice(price, displayCurrency, 'INR');
        return { amount: Math.round(inrAmount * 100), currency: 'INR' }; // Amount in paise
      
      case 'stripe':
      case 'paypal':
        // Convert to USD for international gateways
        const usdAmount = convertPrice(price, displayCurrency, 'USD');
        return { amount: Math.round(usdAmount * 100), currency: 'USD' }; // Amount in cents
      
      case 'bank_transfer':
      case 'cash_on_arrival':
      default:
        // Keep in display currency
        return { amount: Math.round(price * 100), currency: displayCurrency };
    }
  };

  return {
    rates,
    baseCurrency,
    displayCurrency,
    setDisplayCurrency,
    convertPrice,
    formatPrice,
    convertForPayment,
    isLoading,
    loadExchangeRates
  };
};
