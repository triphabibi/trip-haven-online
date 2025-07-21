
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
import { Button } from '@/components/ui/button';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import TourMediaSection from '@/components/tours/TourMediaSection';
import TourDetailsTabs from '@/components/tours/TourDetailsTabs';
import { MapPin, ArrowLeft } from 'lucide-react';

const TourBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Tour ID is required');
      }

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();
      
      if (error) {
        console.error('Error fetching tour:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BeautifulLoading type="page" message="Loading your amazing tour experience..." fullScreen />
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-4">The tour you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/tours')}>Back to Tours</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceData = {
    id: tour.id,
    title: tour.title,
    price_adult: tour.price_adult,
    price_child: tour.price_child,
    price_infant: tour.price_infant,
    type: 'tour' as const,
    overview: tour.overview,
    highlights: tour.highlights,
    whats_included: tour.whats_included,
    exclusions: tour.exclusions,
    itinerary: tour.itinerary,
    duration: tour.duration,
    location: tour.location,
    cancellation_policy: tour.cancellation_policy,
    terms_conditions: tour.terms_conditions
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Mobile-First Container */}
      <div className="w-full">
        {/* Back Button - Mobile Optimized */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tours')} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Tours</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        {/* Main Content - Full Width Stack */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          
          {/* Tour Title - Prominent */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {tour.title}
            </h1>
            {tour.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="text-base sm:text-lg">{tour.location}</span>
              </div>
            )}
          </div>

          {/* Media Section - Full Width */}
          <div className="mb-8">
            <TourMediaSection tour={tour} />
          </div>

          {/* Booking Form - Full Width */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
                  Book Your Experience
                </h2>
                <p className="text-blue-100 text-center mt-1">
                  Secure your spot with easy booking
                </p>
              </div>
              
              <div className="p-4 sm:p-6">
                <SinglePageBookingFlow 
                  service={serviceData} 
                  onBack={() => navigate('/tours')} 
                />
              </div>
            </div>
          </div>

          {/* Tour Details Tabs - Full Width */}
          <div className="mb-8">
            <TourDetailsTabs tour={tour} />
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TourBookingPage;
