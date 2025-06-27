
import { useState, useEffect } from 'react';

interface CurrencyRate {
  from_currency: string;
  to_currency: string;
  rate: number;
}

export const useCurrency = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [userCurrency, setUserCurrency] = useState('INR');

  useEffect(() => {
    detectUserCurrency();
    // Set default rates for common conversions
    setRates([
      { from_currency: 'INR', to_currency: 'USD', rate: 0.012 },
      { from_currency: 'USD', to_currency: 'INR', rate: 83.50 },
      { from_currency: 'INR', to_currency: 'EUR', rate: 0.011 },
      { from_currency: 'EUR', to_currency: 'INR', rate: 91.00 },
    ]);
  }, []);

  const detectUserCurrency = async () => {
    try {
      // Try to detect user's country/currency based on IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Map country codes to currencies
      const currencyMap: Record<string, string> = {
        'US': 'USD',
        'IN': 'INR',
        'GB': 'GBP',
        'DE': 'EUR',
        'FR': 'EUR',
        'AE': 'USD', // UAE often uses USD for tourism
      };
      
      const detectedCurrency = currencyMap[data.country_code] || 'INR';
      setUserCurrency(detectedCurrency);
    } catch (error) {
      console.error('Error detecting user currency:', error);
      setUserCurrency('INR'); // Fallback to INR
    }
  };

  const convertPrice = (price: number, fromCurrency: string = 'INR', toCurrency: string = userCurrency): number => {
    if (fromCurrency === toCurrency) return price;
    
    // Find conversion rate
    const rate = rates.find(r => 
      r.from_currency === fromCurrency && r.to_currency === toCurrency
    );
    
    if (rate) {
      return price * rate.rate;
    }
    
    // If direct rate not found, try reverse
    const reverseRate = rates.find(r => 
      r.from_currency === toCurrency && r.to_currency === fromCurrency
    );
    
    if (reverseRate) {
      return price / reverseRate.rate;
    }
    
    return price; // Return original price if no conversion found
  };

  const formatPrice = (price: number, currency: string = userCurrency): string => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    
    const symbol = symbols[currency] || currency;
    return `${symbol}${price.toLocaleString()}`;
  };

  return {
    rates,
    defaultCurrency,
    userCurrency,
    setUserCurrency,
    convertPrice,
    formatPrice
  };
};
