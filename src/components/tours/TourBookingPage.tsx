import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
import { Button } from '@/components/ui/button';
import Loading from '@/components/common/Loading';

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
        <Loading />
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SinglePageBookingFlow service={serviceData} onBack={() => navigate(`/tours/${tour.id}`)} />
      </div>
      <Footer />
    </div>
  );
};

export default TourBookingPage;