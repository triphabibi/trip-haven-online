
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Settings } from 'lucide-react';

const QuickPaymentSetup = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(false);

  const { data: gateways, isLoading } = useQuery({
    queryKey: ['payment_gateways_setup'],
    queryFn: async () => {
      console.log('🔍 Fetching payment gateways for setup...');
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('priority');
      
      if (error) {
        console.error('❌ Error fetching gateways:', error);
        throw error;
      }
      
      console.log('✅ Gateways fetched:', data);
      return data;
    },
  });

  const initializeGateways = async () => {
    console.log('🚀 Starting gateway initialization...');
    setIsInitializing(true);
    
    try {
      const defaultGateways = [
        {
          gateway_name: 'razorpay' as const,
          display_name: 'Razorpay',
          description: 'Pay with Cards, UPI, Wallets & More',
          is_enabled: true,
          priority: 1,
          api_key: '',
          api_secret: '',
          test_mode: true,
          configuration: {},
          supported_currencies: ['AED', 'USD'],
          min_amount: 0,
          country: 'UAE',
          instructions: 'Secure payment processing with multiple payment options including cards, UPI, and digital wallets.'
        },
        {
          gateway_name: 'stripe' as const,
          display_name: 'Stripe',
          description: 'Credit & Debit Cards',
          is_enabled: true,
          priority: 2,
          api_key: '',
          api_secret: '',
          test_mode: true,
          configuration: {},
          supported_currencies: ['AED', 'USD'],
          min_amount: 0,
          country: 'UAE',
          instructions: 'International payment processing for credit and debit cards worldwide.'
        },
        {
          gateway_name: 'cash_on_arrival' as const,
          display_name: 'Cash on Arrival',
          description: 'Pay cash at pickup location',
          is_enabled: true,
          priority: 3,
          api_key: '',
          api_secret: '',
          test_mode: true,
          configuration: {},
          supported_currencies: ['AED', 'USD'],
          min_amount: 0,
          country: 'UAE',
          instructions: 'You can pay in cash at the pickup location or when you meet our representative. Please ensure you have the exact amount or we will provide change. Cash payment is accepted in AED, USD, or EUR.'
        },
        {
          gateway_name: 'bank_transfer' as const,
          display_name: 'Bank Transfer',
          description: 'Direct bank transfer',
          is_enabled: true,
          priority: 4,
          api_key: '',
          api_secret: '',
          test_mode: true,
          configuration: {},
          supported_currencies: ['AED', 'USD'],
          min_amount: 0,
          country: 'UAE',
          bank_details: {
            bank_name: 'Emirates NBD',
            account_number: '1234567890',
            iban: 'AE123456789012345678901',
            swift: 'EBILAEAD',
            account_holder: 'TripHabibi Tourism LLC'
          },
          instructions: 'Please mention your booking reference number in the transfer description for quick processing. Transfer confirmation will be processed within 2-4 hours during business hours.'
        }
      ];

      console.log('📝 Upserting gateways:', defaultGateways.length);

      for (const gateway of defaultGateways) {
        console.log(`⚙️ Processing gateway: ${gateway.gateway_name}`);
        
        const { error } = await supabase
          .from('payment_gateways')
          .upsert(gateway, { 
            onConflict: 'gateway_name',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error(`❌ Error upserting gateway ${gateway.gateway_name}:`, error);
          throw error;
        }
        
        console.log(`✅ Gateway ${gateway.gateway_name} upserted successfully`);
      }

      console.log('🔄 Invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['payment_gateways_setup'] });
      queryClient.invalidateQueries({ queryKey: ['payment_gateways'] });
      
      toast({
        title: "🎉 Payment gateways initialized successfully",
        description: "All 4 payment methods are now available",
        className: "bg-green-50 border-green-200"
      });
      
      console.log('✅ Gateway initialization completed successfully');
    } catch (error: any) {
      console.error('🚨 Error initializing gateways:', error);
      toast({
        title: "❌ Error initializing gateways",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const getGatewayStatus = () => {
    if (!gateways) return { total: 0, enabled: 0 };
    return {
      total: gateways.length,
      enabled: gateways.filter(g => g.is_enabled).length
    };
  };

  const status = getGatewayStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading payment gateway status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          🚀 Quick Payment Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium">Payment Gateway Status</h3>
            <p className="text-sm text-gray-600">
              {status.enabled} of {status.total} payment methods enabled
            </p>
          </div>
          <div className="flex items-center gap-2">
            {status.enabled >= 4 ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All Set</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Needs Setup</span>
              </div>
            )}
          </div>
        </div>

        {status.total < 4 && (
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">❌ Missing Payment Methods</h4>
              <p className="text-sm text-yellow-700">
                Your payment system is missing some payment methods. Click the button below to initialize all 4 payment gateways:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                <li>💳 Razorpay (Cards, UPI, Wallets)</li>
                <li>💳 Stripe (Credit & Debit Cards)</li>
                <li>💵 Cash on Arrival</li>
                <li>🏦 Bank Transfer</li>
              </ul>
            </div>
            
            <Button 
              onClick={initializeGateways}
              disabled={isInitializing}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  🔧 Initializing Payment Gateways...
                </>
              ) : (
                '🔧 Initialize All Payment Methods'
              )}
            </Button>
          </div>
        )}

        {status.enabled >= 4 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ All Payment Methods Ready</h4>
            <p className="text-sm text-green-700">
              Your payment system is fully configured with all 4 payment methods available to customers.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {gateways?.map((gateway) => (
            <div 
              key={gateway.id}
              className={`p-2 rounded flex items-center gap-2 ${
                gateway.is_enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {gateway.is_enabled ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              <span>{gateway.display_name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPaymentSetup;
