import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/common/Loading';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';
import { MapPin } from 'lucide-react';

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
              {tour.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.location}</span>
                </div>
              )}
            </div>

            {/* Video Section */}
            {tour.video_url && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <YouTubePlayer 
                    videoUrl={tour.video_url}
                    title={tour.title}
                    className="w-full aspect-video"
                  />
                </CardContent>
              </Card>
            )}

            {/* Image Gallery */}
            {tour.gallery_images && tour.gallery_images.length > 0 && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <ImageGallery 
                    images={tour.gallery_images}
                    title={tour.title}
                    enableLightbox={true}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            )}

            {/* Fallback to featured image if no gallery or video */}
            {(!tour.video_url && (!tour.gallery_images || tour.gallery_images.length === 0)) && tour.featured_image && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-96">
                    <img
                      src={tour.featured_image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SinglePageBookingFlow service={serviceData} onBack={() => navigate('/tours')} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourBookingPage;