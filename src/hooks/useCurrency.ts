
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
    const initializeCurrency = async () => {
      if (!isLoading) return; // Prevent re-running if already loaded
      
      await loadCurrencySettings();
      await loadExchangeRates();
    };
    
    initializeCurrency();
  }, []); // Remove dependency on isLoading to prevent loops

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
      
      // Get admin-configured USD to INR exchange rate
      const { data: exchangeRateData } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'usd_to_inr_rate')
        .single();
      
      const adminUsdToInrRate = exchangeRateData?.setting_value ? parseFloat(exchangeRateData.setting_value) : 86;
      
      console.log('[CURRENCY] Loading admin-configured exchange rate:', { adminUsdToInrRate });
      
      // Use admin-configured rates with fallbacks for other currencies
      const ratesList: CurrencyRate[] = [
        // Admin-configured USD-INR rate
        { from_currency: 'USD', to_currency: 'INR', rate: adminUsdToInrRate },
        { from_currency: 'INR', to_currency: 'USD', rate: 1 / adminUsdToInrRate },
        
        // Fallback rates for other currencies
        { from_currency: 'USD', to_currency: 'AED', rate: 3.67 },
        { from_currency: 'AED', to_currency: 'USD', rate: 0.27 },
        { from_currency: 'USD', to_currency: 'EUR', rate: 0.92 },
        { from_currency: 'EUR', to_currency: 'USD', rate: 1.09 },
        { from_currency: 'USD', to_currency: 'GBP', rate: 0.79 },
        { from_currency: 'GBP', to_currency: 'USD', rate: 1.27 },
        
        // Cross rates using admin INR rate
        { from_currency: 'AED', to_currency: 'INR', rate: adminUsdToInrRate / 3.67 },
        { from_currency: 'INR', to_currency: 'AED', rate: 3.67 / adminUsdToInrRate },
      ];
      
      console.log('[CURRENCY] Exchange rates loaded:', ratesList);
      setRates(ratesList);
    } catch (error) {
      console.error('[CURRENCY] Error loading admin exchange rates, using fallback:', error);
      // Fallback rates with default admin rate
      setRates([
        { from_currency: 'USD', to_currency: 'INR', rate: 86 },
        { from_currency: 'INR', to_currency: 'USD', rate: 1 / 86 },
        { from_currency: 'USD', to_currency: 'AED', rate: 3.67 },
        { from_currency: 'AED', to_currency: 'USD', rate: 0.27 },
        { from_currency: 'USD', to_currency: 'EUR', rate: 0.92 },
        { from_currency: 'EUR', to_currency: 'USD', rate: 1.09 },
        { from_currency: 'AED', to_currency: 'INR', rate: 86 / 3.67 },
        { from_currency: 'INR', to_currency: 'AED', rate: 3.67 / 86 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const convertPrice = (price: number, fromCurrency: string = baseCurrency, toCurrency: string = displayCurrency): number => {
    console.log('[CURRENCY] Converting price:', { price, fromCurrency, toCurrency });
    
    if (fromCurrency === toCurrency) {
      console.log('[CURRENCY] Same currency, no conversion needed');
      return price;
    }
    
    // Find direct conversion rate
    const directRate = rates.find(r => 
      r.from_currency === fromCurrency && r.to_currency === toCurrency
    );
    
    if (directRate) {
      const convertedPrice = price * directRate.rate;
      console.log('[CURRENCY] Direct conversion:', { rate: directRate.rate, convertedPrice });
      return convertedPrice;
    }
    
    // If direct rate not found, convert through USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const toUSDRate = rates.find(r => r.from_currency === fromCurrency && r.to_currency === 'USD');
      const fromUSDRate = rates.find(r => r.from_currency === 'USD' && r.to_currency === toCurrency);
      
      if (toUSDRate && fromUSDRate) {
        const convertedPrice = price * toUSDRate.rate * fromUSDRate.rate;
        console.log('[CURRENCY] USD bridge conversion:', { 
          toUSDRate: toUSDRate.rate, 
          fromUSDRate: fromUSDRate.rate, 
          convertedPrice 
        });
        return convertedPrice;
      }
    }
    
    console.log('[CURRENCY] No conversion rate found, returning original price');
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

  // Convert price for payment gateway (returns amount in target currency, NOT multiplied by 100)
  // This is for display and base calculations - payment gateways handle their own unit conversion
  const convertForPayment = (price: number, targetCurrency: string): number => {
    console.log('[CURRENCY] Converting for payment gateway:', { price, targetCurrency });
    
    // Convert from USD base to target currency (rupees for INR, dollars for USD)
    const convertedAmount = convertPrice(price, 'USD', targetCurrency);
    
    console.log('[CURRENCY] Payment conversion result:', { 
      originalUSD: price, 
      targetCurrency, 
      convertedAmount: convertedAmount,
      note: 'This is in base currency units (rupees/dollars), not sub-units (paise/cents)'
    });
    
    return convertedAmount;
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
