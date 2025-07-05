
import { useParams, Link } from 'react-router-dom';
import { useTour } from '@/hooks/useTours';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TourDetailHeader from '@/components/tours/TourDetailHeader';
import TourHighlights from '@/components/tours/TourHighlights';
import TourImageGallery from '@/components/tours/TourImageGallery';
import ResponsiveTourBooking from '@/components/tours/ResponsiveTourBooking';
import TourOverview from '@/components/tours/TourOverview';
import ModernTourItinerary from '@/components/tours/ModernTourItinerary';
import TourInclusions from '@/components/tours/TourInclusions';
import TourReviews from '@/components/tours/TourReviews';
import TourFAQ from '@/components/tours/TourFAQ';
import AIAssistant from '@/components/common/AIAssistant';
import StickyMobileBookingButton from '@/components/common/StickyMobileBookingButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from '@/components/common/Loading';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading message="Loading tour details..." />
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🏖️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg">The tour you're looking for doesn't exist or has been removed.</p>
            <Link to="/tours">
              <Button size="lg" className="px-8">Browse All Tours</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-blue-600 transition-colors font-medium">Tours</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{tour.title}</span>
        </nav>

        {/* Header Section */}
        <TourDetailHeader tour={tour} />

        <div className="grid lg:grid-cols-3 gap-8 mb-20 lg:mb-0">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <TourImageGallery tour={tour} />

            {/* Highlights */}
            <TourHighlights tour={tour} />

            {/* Mobile Booking Section */}
            <div className="lg:hidden">
              <ResponsiveTourBooking tour={tour} />
            </div>

            {/* Main Content Tabs */}
            <Card className="overflow-hidden shadow-sm border-gray-100">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b bg-gray-50/50">
                  <TabsList className="h-auto p-0 bg-transparent w-full justify-start rounded-none">
                    <TabsTrigger 
                      value="overview" 
                      className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="itinerary" 
                      className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inclusions" 
                      className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Inclusions
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reviews" 
                      className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger 
                      value="faq" 
                      className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                    >
                      FAQ
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-4 lg:p-8">
                  <TabsContent value="overview" className="mt-0">
                    <TourOverview tour={tour} />
                  </TabsContent>

                  <TabsContent value="itinerary" className="mt-0">
                    <ModernTourItinerary tour={tour} />
                  </TabsContent>

                  <TabsContent value="inclusions" className="mt-0">
                    <TourInclusions tour={tour} />
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-0">
                    <TourReviews tourId={tour.id} rating={tour.rating} totalReviews={tour.total_reviews} />
                  </TabsContent>

                  <TabsContent value="faq" className="mt-0">
                    <TourFAQ />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Desktop Booking Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-6">
              <ResponsiveTourBooking tour={tour} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
      <StickyMobileBookingButton />
    </div>
  );
};

export default TourDetailPage;
