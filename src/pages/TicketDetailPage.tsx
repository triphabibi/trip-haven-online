import { useParams, Link } from 'react-router-dom';
import { useTicket } from '@/hooks/useTickets';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Ticket as TicketIcon, MapPin, Star, Download } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import Loading from '@/components/common/Loading';
import NotFound from '@/pages/NotFound';
import TicketBookingForm from '@/components/tickets/TicketBookingForm';

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

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={ticket.image_urls?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500'}
              alt={ticket.title}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{ticket.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {ticket.is_featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
                {ticket.instant_delivery && (
                  <Badge className="bg-green-500">Instant Delivery</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{ticket.rating || 0} ({ticket.total_reviews || 0} reviews)</span>
            </div>
            {ticket.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{ticket.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-sm border-gray-100">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About This Ticket</h2>
                <p className="text-gray-700 leading-relaxed">
                  {ticket.description || 'No description provided for this ticket.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border-gray-200">
                <CardHeader>
                  <CardTitle>Book Your Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketBookingForm
                    ticketId={ticket.id}
                    ticketTitle={ticket.title}
                    priceAdult={ticket.price_adult}
                    priceChild={ticket.price_child}
                    priceInfant={ticket.price_infant}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicketDetailPage;
