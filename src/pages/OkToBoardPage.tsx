import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import EnhancedFooter from '@/components/layout/EnhancedFooter';
import EnhancedMobileTabBar from '@/components/layout/EnhancedMobileTabBar';
import OkToBoardBooking from '@/components/oktoboard/OkToBoardBooking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plane, CheckCircle, AlertTriangle, Upload, Shield, Clock3, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/common/Loading';

const OkToBoardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOkToBoardService();
  }, []);

  const loadOkToBoardService = async () => {
    try {
      const { data, error } = await supabase
        .from('ok_to_board_services')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      setService(data);
    } catch (error) {
      console.error('Error loading OK to Board service:', error);
      toast({
        title: "Error",
        description: "Failed to load service details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loading message="Loading OK to Board service..." />
        <EnhancedFooter />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Available</h1>
          <p className="text-gray-600">OK to Board service is currently not available.</p>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Verified Service Provider
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            OK to Board Clearance
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Get your OK to Board clearance approved quickly and hassle-free. 
            Required for international flights from India.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">99% Approval Rate</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clock3 className="h-5 w-5" />
              <span className="font-medium">{service.processing_time} Processing</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Users className="h-5 w-5" />
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Service Features */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Processing</h3>
                <p className="text-gray-600 text-sm">Get your clearance within {service.processing_time}</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Guaranteed Approval</h3>
                <p className="text-gray-600 text-sm">99% success rate with expert handling</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Process</h3>
                <p className="text-gray-600 text-sm">Safe and secure document handling</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <OkToBoardBooking service={service} />
        </div>

        {/* Why Choose Us */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-900">
                Why Choose Our OK to Board Service?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Expert Handling</h4>
                      <p className="text-sm text-gray-600">Our experienced team ensures your application is processed correctly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Round-the-clock assistance until you board your flight</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Money Back Guarantee</h4>
                      <p className="text-sm text-gray-600">Full refund if we can't process your clearance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Real-time Updates</h4>
                      <p className="text-sm text-gray-600">SMS and email updates on your application status</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <EnhancedFooter />
      <EnhancedMobileTabBar />
    </div>
  );
};

export default OkToBoardPage;