
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import BookingForm from '@/components/booking/BookingForm';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  MapPin, 
  CheckCircle, 
  Share2, 
  Heart,
  Download,
  Zap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticket, isLoading, error } = useTicket(id!);
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

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
            <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/tickets')}>Browse Tickets</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = ticket.image_urls || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const shareTicket = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ticket.title,
          text: ticket.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/tickets')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={images[currentImageIndex]}
                alt={ticket.title}
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
            {/* Ticket Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    {ticket.is_featured && (
                      <Badge className="bg-yellow-500">Featured</Badge>
                    )}
                    {ticket.instant_delivery && (
                      <Badge className="bg-green-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Instant Delivery
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={shareTicket}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                {ticket.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-5 w-5" />
                    <span>{ticket.location}</span>
                  </div>
                )}
                
                {ticket.rating && ticket.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{ticket.rating.toFixed(1)}</span>
                    {ticket.total_reviews && ticket.total_reviews > 0 && (
                      <span className="text-gray-500">({ticket.total_reviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Attraction</CardTitle>
              </CardHeader>
              <CardContent>
                {ticket.description ? (
                  <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
                ) : (
                  <p className="text-gray-500">No description available for this attraction.</p>
                )}
              </CardContent>
            </Card>

            {/* Ticket Features */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.instant_delivery && (
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Instant Digital Delivery</div>
                        <div className="text-sm text-gray-600">Receive your ticket immediately via email</div>
                      </div>
                    </div>
                  )}
                  
                  {ticket.ticket_pdf_urls && ticket.ticket_pdf_urls.length > 0 && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">PDF Tickets Available</div>
                        <div className="text-sm text-gray-600">Downloadable PDF format for easy access</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Mobile Friendly</div>
                      <div className="text-sm text-gray-600">Show your ticket on your smartphone</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Skip the Line</div>
                      <div className="text-sm text-gray-600">Fast track entry to the attraction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ₹{ticket.price_adult.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per adult</div>
                  
                  {ticket.price_child > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      Child: ₹{ticket.price_child.toLocaleString()}
                    </div>
                  )}
                  {ticket.price_infant > 0 && (
                    <div className="text-sm text-gray-600">
                      Infant: ₹{ticket.price_infant.toLocaleString()}
                    </div>
                  )}
                </div>

                <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
                  <DialogTrigger asChild>
                    <Button className="w-full mb-4" size="lg">
                      Buy Ticket Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Buy {ticket.title}</DialogTitle>
                    </DialogHeader>
                    <BookingForm
                      tour={ticket as any} // Type conversion for compatibility
                      onCancel={() => setShowBookingForm(false)}
                    />
                  </DialogContent>
                </Dialog>

                <div className="space-y-3 text-sm text-gray-600">
                  {ticket.instant_delivery && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Instant digital delivery</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free cancellation available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile ticket accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span>PDF download available</span>
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

export default TicketDetailPage;
