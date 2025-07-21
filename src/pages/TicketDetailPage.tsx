
import { useParams } from 'react-router-dom';
import { useTicket } from '@/hooks/useTickets';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import Loading from '@/components/common/Loading';
import NotFound from '@/pages/NotFound';
import SimpleTicketBooking from '@/components/tickets/SimpleTicketBooking';
import AIAssistant from '@/components/common/AIAssistant';
import { TicketMediaSection } from '@/components/tickets/TicketMediaSection';
import { TicketDetailsTabs } from '@/components/tickets/TicketDetailsTabs';

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
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{ticket.location || 'Location not specified'}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {ticket.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{ticket.rating || 4.5}</span>
              <span className="text-gray-600 text-sm">({ticket.total_reviews || 0} reviews)</span>
            </div>
          </div>
        </div>

        {/* Media Section - Full Width */}
        <div className="mb-6">
          <TicketMediaSection ticket={ticket} />
        </div>

        {/* Booking Form - Full Width */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 md:px-6 py-4">
              <h2 className="text-xl md:text-2xl font-bold text-white text-center">
                Book Your Tickets
              </h2>
            </div>
            <div className="p-4 md:p-6">
              <SimpleTicketBooking ticket={ticket} />
            </div>
          </div>
        </div>

        {/* Pricing Display - Mobile Responsive */}
        <div className="mb-6">
          <Card className="overflow-hidden shadow-sm border-0">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">Ticket Prices</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">{formatPrice(ticket.price_adult)}</div>
                  <div className="text-xs md:text-sm text-gray-600">Adult (12+ years)</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-600">{formatPrice(ticket.price_child)}</div>
                  <div className="text-xs md:text-sm text-gray-600">Child (3-11 years)</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center sm:col-span-2 lg:col-span-1">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">{formatPrice(ticket.price_infant)}</div>
                  <div className="text-xs md:text-sm text-gray-600">Infant (0-2 years)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section - Full Width */}
        <div className="mb-6">
          <TicketDetailsTabs ticket={ticket} />
        </div>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default TicketDetailPage;
