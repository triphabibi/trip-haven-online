
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTour } from '@/hooks/useTours';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, MapPin, Users, CheckCircle, XCircle, Heart, Share2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tour, isLoading, error } = useTour(id!);
  const { toast } = useToast();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.id === id && item.type === 'tour');
    
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item: any) => !(item.id === id && item.type === 'tour'));
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      toast({
        title: "Removed from Wishlist",
        description: "Tour removed from your wishlist",
      });
    } else {
      wishlist.push({ id, type: 'tour', title: tour?.title, image: tour?.image_urls?.[0] });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-blue-600">Tours</Link>
          <span>/</span>
          <span className="text-gray-900">{tour.title}</span>
        </nav>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-4 md:col-span-3">
            <img
              src={tour.image_urls?.[selectedImageIndex] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="col-span-4 md:col-span-1 grid grid-cols-4 md:grid-cols-1 gap-2">
            {tour.image_urls?.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${tour.title} ${index + 1}`}
                className={`w-full h-20 md:h-24 object-cover rounded cursor-pointer ${
                  index === selectedImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{tour.rating || 0}</span>
                    <span className="text-gray-500">({tour.total_reviews || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration || 'Full Day'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Dubai</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {tour.instant_confirmation && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Instant Confirmation
                    </Badge>
                  )}
                  {tour.free_cancellation && (
                    <Badge className="bg-blue-500">
                      <XCircle className="h-3 w-3 mr-1" />
                      Free Cancellation
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleWishlist}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-3">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Highlights</h2>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What's Included */}
            {tour.whats_included && tour.whats_included.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">What's Included</h2>
                  <ul className="space-y-2">
                    {tour.whats_included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Available Times */}
            {tour.available_times && tour.available_times.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Available Times</h2>
                  <div className="flex flex-wrap gap-2">
                    {tour.available_times.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {tour.languages && tour.languages.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {tour.languages.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      ₹{tour.price_adult.toLocaleString()}
                    </div>
                    <div className="text-gray-500">per adult</div>
                    {tour.price_child > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Child (2-11): ₹{tour.price_child.toLocaleString()}
                      </div>
                    )}
                    {tour.price_infant > 0 && (
                      <div className="text-sm text-gray-500">
                        Infant (0-2): ₹{tour.price_infant.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {!showBookingForm ? (
                    <Button 
                      className="w-full"
                      onClick={() => setShowBookingForm(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  ) : (
                    <BookingForm 
                      tour={tour} 
                      onCancel={() => setShowBookingForm(false)}
                    />
                  )}

                  <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-sm text-gray-500 mb-2">Need help?</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
