
import { useParams } from 'react-router-dom';
import { useTour } from '@/hooks/useTours';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';
import TourDetailHeader from '@/components/tours/TourDetailHeader';
import TourImageGallery from '@/components/tours/TourImageGallery';
import TourOverview from '@/components/tours/TourOverview';
import TourHighlights from '@/components/tours/TourHighlights';
import TourItinerary from '@/components/tours/TourItinerary';
import TourInclusions from '@/components/tours/TourInclusions';
import TourReviews from '@/components/tours/TourReviews';
import TourFAQ from '@/components/tours/TourFAQ';
import ProfessionalBookingFlow from '@/components/booking/ProfessionalBookingFlow';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id || '');
  const [showBooking, setShowBooking] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loading message="Loading tour details..." />
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600">The tour you're looking for could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showBooking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ProfessionalBookingFlow
            bookingData={{
              serviceId: tour.id,
              serviceType: 'tour',
              serviceTitle: tour.title,
              priceAdult: tour.price_adult,
              priceChild: tour.price_child,
              priceInfant: tour.price_infant
            }}
            onComplete={() => setShowBooking(false)}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <TourDetailHeader tour={tour} />
          
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <TourImageGallery tour={tour} />
              <TourOverview tour={tour} />
              <TourHighlights tour={tour} />
              <TourItinerary tour={tour} />
              <TourInclusions tour={tour} />
              <TourReviews tour={tour} />
              <TourFAQ tour={tour} />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      AED {tour.price_adult.toLocaleString()}
                    </div>
                    <p className="text-gray-600">per adult</p>
                  </div>
                  
                  <Button 
                    onClick={() => setShowBooking(true)}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Group size:</span>
                      <span>Up to {tour.max_capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <span>{tour.languages?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TourDetailPage;
