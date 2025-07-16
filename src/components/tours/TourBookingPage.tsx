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
        {/* Top Section - Tour Title and Booking Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Info */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{tour.title}</h1>
                {tour.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{tour.location}</span>
                  </div>
                )}
                {tour.duration && (
                  <div className="text-lg text-gray-600">
                    <span className="font-medium">Duration:</span> {tour.duration}
                  </div>
                )}
                {tour.overview && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">About This Experience</h3>
                    <p className="text-gray-700 leading-relaxed">{tour.overview}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <SinglePageBookingFlow service={serviceData} onBack={() => navigate('/tours')} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Media Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Tour Gallery & Preview</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Section */}
            {tour.video_url && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Watch Tour Preview</h3>
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <YouTubePlayer 
                      videoUrl={tour.video_url}
                      title={tour.title}
                      className="w-full aspect-video"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Image Gallery */}
            {tour.gallery_images && tour.gallery_images.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Tour Gallery</h3>
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <ImageGallery 
                      images={tour.gallery_images}
                      title={tour.title}
                      enableLightbox={true}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Fallback to featured image if no gallery or video */}
            {(!tour.video_url && (!tour.gallery_images || tour.gallery_images.length === 0)) && tour.featured_image && (
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">Tour Image</h3>
                <Card className="overflow-hidden shadow-lg">
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
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourBookingPage;