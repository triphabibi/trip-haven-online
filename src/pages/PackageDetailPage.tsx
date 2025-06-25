
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackage } from '@/hooks/usePackages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  Calendar, 
  Users, 
  CheckCircle, 
  Share2, 
  Heart,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: packageData, isLoading, error } = usePackage(id!);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-32 w-full mb-4" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
            <p className="text-gray-600 mb-4">The package you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/packages')}>Browse Packages</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = packageData.image_urls || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const sharePackage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData.title,
          text: packageData.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/packages')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Packages
        </Button>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={images[currentImageIndex]}
                alt={packageData.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Package Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{packageData.title}</h1>
                  {packageData.is_featured && (
                    <Badge className="bg-yellow-500 mb-2">Featured Package</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={sharePackage}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  <span>{packageData.nights} Nights / {packageData.days} Days</span>
                </div>
                
                {packageData.rating && packageData.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{packageData.rating.toFixed(1)}</span>
                    {packageData.total_reviews && packageData.total_reviews > 0 && (
                      <span className="text-gray-500">({packageData.total_reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Package Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Package Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {packageData.description ? (
                      <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                    ) : (
                      <p className="text-gray-500">No description available for this package.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Day-by-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {packageData.itinerary ? (
                      <div className="space-y-4">
                        {Object.entries(packageData.itinerary).map(([day, activities]) => (
                          <div key={day} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-lg mb-2">Day {day}</h4>
                            <p className="text-gray-700">{String(activities)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Detailed itinerary will be provided after booking.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="included" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {packageData.whats_included && packageData.whats_included.length > 0 ? (
                      <ul className="space-y-2">
                        {packageData.whats_included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Package inclusions will be detailed after booking.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="highlights" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Package Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {packageData.highlights && packageData.highlights.length > 0 ? (
                      <ul className="space-y-2">
                        {packageData.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Package highlights will be detailed after booking.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ₹{packageData.price_adult.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per adult</div>
                  
                  {packageData.price_child > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      Child: ₹{packageData.price_child.toLocaleString()}
                    </div>
                  )}
                  {packageData.price_infant > 0 && (
                    <div className="text-sm text-gray-600">
                      Infant: ₹{packageData.price_infant.toLocaleString()}
                    </div>
                  )}
                </div>

                <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4" size="lg">
                      Book This Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Book {packageData.title}</DialogTitle>
                    </DialogHeader>
                    <BookingForm
                      tour={packageData as any} // Type conversion for compatibility
                      onCancel={() => setShowBookingForm(false)}
                    />
                  </DialogContent>
                </Dialog>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free cancellation available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Group bookings available</span>
                  </div>
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

export default PackageDetailPage;
