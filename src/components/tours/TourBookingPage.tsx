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
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{tour.title}</h1>
            {tour.location && (
              <div className="flex items-center justify-center gap-2 text-xl text-gray-600 mb-4">
                <MapPin className="h-6 w-6" />
                <span>{tour.location}</span>
              </div>
            )}
            {tour.overview && (
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">{tour.overview}</p>
            )}
          </div>

          {/* Booking Section */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Experience</h2>
              <p className="text-gray-600">Complete your booking in just a few steps</p>
            </div>
            
            <SinglePageBookingFlow service={serviceData} onBack={() => navigate('/tours')} />
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview Your Experience</h2>
            <p className="text-gray-600 text-lg">Get a glimpse of what awaits you</p>
          </div>
          
          <div className="space-y-8">
            {/* Video Section */}
            {tour.video_url && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 text-center">Watch the Experience</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <YouTubePlayer 
                      videoUrl={tour.video_url}
                      title={tour.title}
                      className="w-full aspect-video"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {tour.gallery_images && tour.gallery_images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 text-center">Photo Gallery</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <ImageGallery 
                      images={tour.gallery_images}
                      title={tour.title}
                      enableLightbox={true}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fallback Image */}
            {(!tour.video_url && (!tour.gallery_images || tour.gallery_images.length === 0)) && tour.featured_image && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 text-center">Experience Preview</h3>
                <div className="max-w-4xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={tour.featured_image}
                      alt={tour.title}
                      className="w-full h-96 object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tour Details */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="text-xl font-semibold text-green-900 mb-4">✨ Highlights</h4>
                <ul className="space-y-2">
                  {tour.highlights.slice(0, 4).map((highlight: string, index: number) => (
                    <li key={index} className="text-green-800 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tour.whats_included && tour.whats_included.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-900 mb-4">✅ What's Included</h4>
                <ul className="space-y-2">
                  {tour.whats_included.slice(0, 4).map((item: string, index: number) => (
                    <li key={index} className="text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tour.duration && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h4 className="text-xl font-semibold text-purple-900 mb-4">⏰ Tour Info</h4>
                <div className="space-y-3">
                  <div className="text-purple-800">
                    <span className="font-medium">Duration:</span> {tour.duration}
                  </div>
                  {tour.languages && tour.languages.length > 0 && (
                    <div className="text-purple-800">
                      <span className="font-medium">Languages:</span> {tour.languages.join(', ')}
                    </div>
                  )}
                </div>
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