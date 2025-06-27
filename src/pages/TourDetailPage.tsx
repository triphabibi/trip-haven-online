
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTour } from '@/hooks/useTours';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import TourImageGallery from '@/components/tours/TourImageGallery';
import TourBookingCard from '@/components/tours/TourBookingCard';
import TourOverview from '@/components/tours/TourOverview';
import TourItinerary from '@/components/tours/TourItinerary';
import TourInclusions from '@/components/tours/TourInclusions';
import TourReviews from '@/components/tours/TourReviews';
import TourFAQ from '@/components/tours/TourFAQ';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Star, MapPin, Users, CheckCircle, XCircle, Heart, Share2, Calendar, Shield, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/common/Loading';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id!);
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.id === id && item.type === 'tour');
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: any) => !(item.id === id && item.type === 'tour'));
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
      toast({
        title: "Removed from Wishlist",
        description: "Tour removed from your wishlist",
      });
    } else {
      wishlist.push({ id, type: 'tour', title: tour?.title, image: tour?.image_urls?.[0] });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: "Tour added to your wishlist",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour?.title,
        text: tour?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Tour link copied to clipboard",
      });
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
            <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
            <Link to="/tours">
              <Button>Browse All Tours</Button>
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
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-blue-600 transition-colors">Tours</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{tour.title}</span>
        </nav>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {tour.instant_confirmation && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Instant Confirmation
                  </Badge>
                )}
                {tour.free_cancellation && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <XCircle className="h-3 w-3 mr-1" />
                    Free Cancellation
                  </Badge>
                )}
                {tour.is_featured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Award className="h-3 w-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                  <Shield className="h-3 w-3 mr-1" />
                  Trusted Partner
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {tour.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{tour.rating || 0}</span>
                  </div>
                  <span className="text-gray-600">({tour.total_reviews || 0} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{tour.duration || 'Full Day'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Dubai</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Group Tour</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {tour.description}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlist}
                className={`${isWishlisted ? 'text-red-500 border-red-200' : ''}`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-red-500' : ''}`} />
                Save
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <TourImageGallery tour={tour} />

            {/* Quick Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {tour.highlights.slice(0, 6).map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content Tabs */}
            <Card className="overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b bg-gray-50/50">
                  <TabsList className="h-auto p-1 bg-transparent w-full justify-start">
                    <TabsTrigger value="overview" className="px-6 py-3 text-base font-medium">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="itinerary" className="px-6 py-3 text-base font-medium">
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger value="inclusions" className="px-6 py-3 text-base font-medium">
                      Inclusions
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="px-6 py-3 text-base font-medium">
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="px-6 py-3 text-base font-medium">
                      FAQ
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview">
                    <TourOverview tour={tour} />
                  </TabsContent>

                  <TabsContent value="itinerary">
                    <TourItinerary tour={tour} />
                  </TabsContent>

                  <TabsContent value="inclusions">
                    <TourInclusions tour={tour} />
                  </TabsContent>

                  <TabsContent value="reviews">
                    <TourReviews tourId={tour.id} rating={tour.rating} totalReviews={tour.total_reviews} />
                  </TabsContent>

                  <TabsContent value="faq">
                    <TourFAQ />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <TourBookingCard tour={tour} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TourDetailPage;
