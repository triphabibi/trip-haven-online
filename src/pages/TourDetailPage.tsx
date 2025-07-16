
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, CheckCircle, Shield } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const { data: tour, isLoading, error } = useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      console.log('Fetching tour with ID:', id);
      
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
      
      console.log('Tour data fetched:', data);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
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

  const handleBookNow = () => {
    navigate(`/booking?type=tour&id=${tour.id}`);
  };

  // Parse itinerary safely
  const parseItinerary = (itinerary: any) => {
    if (!itinerary) return null;
    
    if (typeof itinerary === 'string') {
      try {
        return JSON.parse(itinerary);
      } catch {
        return null;
      }
    }
    
    if (typeof itinerary === 'object' && itinerary.days) {
      return itinerary;
    }
    
    return null;
  };

  const parsedItinerary = parseItinerary(tour.itinerary);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Title and Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{tour.location || 'Location not specified'}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900">{tour.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4">
                {tour.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-gray-600">({tour.total_reviews} reviews)</span>
                  </div>
                )}
                
                {tour.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{tour.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {tour.instant_confirmation && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Instant Confirmation
                  </Badge>
                )}
                {tour.free_cancellation && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Free Cancellation
                  </Badge>
                )}
                {tour.is_featured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                )}
              </div>
            </div>

            {/* Video Section */}
            {tour.video_url && (
              <div className="w-full">
                <YouTubePlayer 
                  videoUrl={tour.video_url}
                  title={tour.title}
                  className="w-full rounded-xl overflow-hidden shadow-lg"
                />
              </div>
            )}

            {/* Image Gallery */}
            {tour.image_urls && tour.image_urls.length > 0 && (
              <div className="w-full">
                <ImageGallery 
                  images={tour.image_urls}
                  title={tour.title}
                  className="w-full rounded-xl overflow-hidden shadow-lg"
                />
              </div>
            )}

            {/* Fallback to featured image if no gallery or video */}
            {(!tour.video_url && (!tour.image_urls || tour.image_urls.length === 0)) && (
              <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                {tour.featured_image ? (
                  <img
                    src={tour.featured_image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-gray-400" />
                  </div>
                )}
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
                      From {formatPrice(tour.price_adult)}
                    </div>
                    <p className="text-sm text-gray-600">per adult</p>
                  </div>
                  
                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tour Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {tour.overview && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">{tour.overview}</p>
                </CardContent>
              </Card>
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What's Included */}
            {tour.whats_included && tour.whats_included.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                  <ul className="space-y-2">
                    {tour.whats_included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {parsedItinerary && parsedItinerary.days && parsedItinerary.days.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {parsedItinerary.days.map((day: any, index: number) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4">
                        <h3 className="font-medium text-lg">Day {index + 1}: {day.title}</h3>
                        <p className="text-gray-600 mt-1">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tour Information</h3>
                <div className="space-y-3">
                  {tour.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{tour.duration}</span>
                    </div>
                  )}
                  {tour.max_capacity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity:</span>
                      <span className="font-medium">{tour.max_capacity} people</span>
                    </div>
                  )}
                  {tour.languages && tour.languages.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Languages:</span>
                      <span className="font-medium">{tour.languages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Pricing</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adult:</span>
                    <span className="font-medium">{formatPrice(tour.price_adult)}</span>
                  </div>
                  {tour.price_child > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child:</span>
                      <span className="font-medium">{formatPrice(tour.price_child)}</span>
                    </div>
                  )}
                  {tour.price_infant > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Infant:</span>
                      <span className="font-medium">{formatPrice(tour.price_infant)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourDetailPage;
