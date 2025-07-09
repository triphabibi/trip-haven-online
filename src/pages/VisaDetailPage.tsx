
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Shield, CheckCircle, AlertCircle, Globe } from 'lucide-react';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
import { useCurrency } from '@/hooks/useCurrency';

const VisaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const { formatPrice } = useCurrency();

  const { data: visa, isLoading, error } = useQuery({
    queryKey: ['visa', id],
    queryFn: async () => {
      if (!id) throw new Error('Visa ID is required');

      const { data, error } = await supabase
        .from('visa_services')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Service Not Found</h1>
          <p className="text-gray-600 mb-4">The visa service you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/visas')}>Back to Visa Services</Button>
        </div>
      </div>
    );
  }

  if (showBooking) {
    return (
      <SinglePageBookingFlow
        service={{
          id: visa.id,
          title: `${visa.country} ${visa.visa_type}`,
          price_adult: visa.price,
          price_child: 0,
          price_infant: 0,
          type: 'visa'
        }}
        onBack={() => setShowBooking(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {visa.featured_image && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src={visa.featured_image}
                  alt={`${visa.country} ${visa.visa_type}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                  <div className="p-6 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {visa.country} {visa.visa_type}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{visa.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{visa.processing_time || `${visa.estimated_days} days`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!visa.featured_image && (
              <div className="space-y-4 mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {visa.country} {visa.visa_type}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{visa.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{visa.processing_time || `${visa.estimated_days} days`}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(visa.price)}
                    </div>
                    <p className="text-sm text-gray-600">Processing fee included</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Processing: {visa.processing_time || `${visa.estimated_days} days`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Secure processing</span>
                    </div>
                  </div>
                  
                  {/* Desktop Apply Button */}
                  <Button 
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 hidden sm:block"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                  
                  {/* Mobile Apply Button */}
                  <Button 
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 sm:hidden"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visa Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {visa.overview && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">{visa.overview}</p>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {visa.requirements && visa.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {visa.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What's Included */}
            {visa.whats_included && visa.whats_included.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                  <ul className="space-y-2">
                    {visa.whats_included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Processing Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Time:</span>
                    <span className="font-medium">{visa.processing_time || `${visa.estimated_days} days`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visa Type:</span>
                    <span className="font-medium">{visa.visa_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{visa.country}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden">
        <Button 
          onClick={() => setShowBooking(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Apply Now - {formatPrice(visa.price)}
        </Button>
      </div>
    </div>
  );
};

export default VisaDetailPage;
