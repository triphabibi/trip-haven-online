
import { useParams, Link } from 'react-router-dom';
import { useTicket } from '@/hooks/useTickets';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Download, Clock, Users } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import Loading from '@/components/common/Loading';
import NotFound from '@/pages/NotFound';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import AIAssistant from '@/components/common/AIAssistant';
import { YouTubePlayer } from '@/components/common/YouTubePlayer';
import { ImageGallery } from '@/components/common/ImageGallery';

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading, error } = useTicket(id!);
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading message="Loading ticket details..." />
        <Footer />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb - Mobile Friendly */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium whitespace-nowrap">Home</Link>
          <span>/</span>
          <Link to="/tickets" className="hover:text-blue-600 transition-colors font-medium whitespace-nowrap">Tickets</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{ticket.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section - Mobile First */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{ticket.location || 'Location not specified'}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{ticket.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{ticket.rating || 4.5}</span>
                  <span className="text-gray-600 text-sm">({ticket.total_reviews || 0} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {ticket.is_featured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">Featured</Badge>
                )}
                {ticket.instant_delivery && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Instant Delivery
                  </Badge>
                )}
                {ticket.instant_confirmation && (
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Instant Confirmation
                  </Badge>
                )}
              </div>
            </div>

            {/* Hero Media Section - Mobile Optimized */}
            <div className="space-y-4">
              {/* Video Section */}
              {ticket.video_url && (
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-0">
                    <YouTubePlayer 
                      videoUrl={ticket.video_url}
                      title={ticket.title}
                      className="w-full aspect-video rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Image Gallery */}
              {ticket.image_urls && ticket.image_urls.length > 0 && (
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-0">
                    <ImageGallery 
                      images={ticket.image_urls}
                      title={ticket.title}
                      enableLightbox={true}
                      className="w-full rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Fallback single image if no gallery or video */}
              {(!ticket.video_url && (!ticket.image_urls || ticket.image_urls.length === 0)) && (
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="relative h-64 md:h-80">
                      <img
                        src={ticket.featured_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'}
                        alt={ticket.title}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                      {ticket.is_featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* About Section - Mobile Responsive */}
            <Card className="overflow-hidden shadow-sm border-0">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl">About This Attraction</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  {ticket.description || 'Experience this amazing attraction with skip-the-line access and instant digital tickets delivered to your email.'}
                </p>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Instant Access</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Get your tickets immediately after booking</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Skip the Line</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Bypass the queue with priority access</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Display - Mobile Responsive */}
            <Card className="overflow-hidden shadow-sm border-0">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl">Ticket Prices</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">{formatPrice(ticket.price_adult)}</div>
                    <div className="text-xs md:text-sm text-gray-600">Adult (12+ years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                    <div className="text-xl md:text-2xl font-bold text-green-600">{formatPrice(ticket.price_child)}</div>
                    <div className="text-xs md:text-sm text-gray-600">Child (3-11 years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">{formatPrice(ticket.price_infant)}</div>
                    <div className="text-xs md:text-sm text-gray-600">Infant (0-2 years)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar - Mobile Responsive */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-6">
              <SimpleTicketBooking ticket={ticket} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default TicketDetailPage;
