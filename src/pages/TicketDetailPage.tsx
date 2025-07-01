
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
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link to="/tickets" className="hover:text-blue-600 transition-colors font-medium">Tickets</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{ticket.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={ticket.image_urls?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500'}
                  alt={ticket.title}
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{ticket.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {ticket.is_featured && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
                    )}
                    {ticket.instant_delivery && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <Download className="h-3 w-3 mr-1" />
                        Instant Delivery
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{ticket.rating || 4.5} ({ticket.total_reviews || 0} reviews)</span>
                    </div>
                    {ticket.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{ticket.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <Card className="overflow-hidden shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl">About This Attraction</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {ticket.description || 'Experience this amazing attraction with skip-the-line access and instant digital tickets delivered to your email.'}
                </p>
                
                <div className="mt-6 grid md:grid-cols-2 gap-6">
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

            {/* Pricing Display */}
            <Card className="overflow-hidden shadow-sm border-gray-100">
              <CardHeader>
                <CardTitle className="text-2xl">Ticket Prices</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatPrice(ticket.price_adult)}</div>
                    <div className="text-sm text-gray-600">Adult (12+ years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{formatPrice(ticket.price_child)}</div>
                    <div className="text-sm text-gray-600">Child (3-11 years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatPrice(ticket.price_infant)}</div>
                    <div className="text-sm text-gray-600">Infant (0-2 years)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <SimpleTicketBooking ticket={ticket} />
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default TicketDetailPage;
