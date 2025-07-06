
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
import IntegratedBookingFlow from '@/components/booking/IntegratedBookingFlow';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id || '');

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
              <TourReviews tourId={tour.id} rating={tour.rating} totalReviews={tour.total_reviews} />
              <TourFAQ />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <IntegratedBookingFlow
                  serviceId={tour.id}
                  serviceType="tour"
                  serviceTitle={tour.title}
                  priceAdult={tour.price_adult}
                  priceChild={tour.price_child}
                  priceInfant={tour.price_infant}
                  serviceImage={tour.featured_image || tour.image_urls?.[0]}
                />
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
