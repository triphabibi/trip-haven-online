
import { useParams } from 'react-router-dom';
import { useTour } from '@/hooks/useTours';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/common/Loading';
import TourDetailHeader from '@/components/tours/TourDetailHeader';
import TourImageGallery from '@/components/tours/TourImageGallery';
import SinglePageBookingFlow from '@/components/booking/SinglePageBookingFlow';
import TabbedTourDetails from '@/components/tours/TabbedTourDetails';
import StickyMobileCTA from '@/components/common/StickyMobileCTA';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id || '');

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Tour Header */}
          <TourDetailHeader tour={tour} />
          
          {/* Tour Images */}
          <div className="mt-6">
            <TourImageGallery tour={tour} />
          </div>

          {/* Main Content */}
          <div className="mt-8 space-y-8">
            
            {/* Tabbed Details */}
            <TabbedTourDetails tour={tour} />
            
            {/* Booking Section */}
            <div id="booking-section" className="scroll-mt-4">
              <SinglePageBookingFlow
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
      
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA 
        tour={tour} 
        showBooking={true} 
        onBookNow={scrollToBooking}
      />
      
      <Footer />
    </div>
  );
};

export default TourDetailPage;
