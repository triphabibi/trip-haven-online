
import React, { createContext, useContext, useState } from 'react';

interface PaymentContextType {
  selectedGateway: string;
  setSelectedGateway: (gateway: string) => void;
  processPayment: (amount: number, bookingId: string) => Promise<{ success: boolean; paymentId?: string }>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGateway, setSelectedGateway] = useState('stripe');

  const processPayment = async (amount: number, bookingId: string) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, randomly succeed or fail
    const success = Math.random() > 0.1; // 90% success rate
    
    return {
      success,
      paymentId: success ? `pay_${Date.now()}` : undefined,
    };
  };

  return (
    <PaymentContext.Provider value={{
      selectedGateway,
      setSelectedGateway,
      processPayment,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
