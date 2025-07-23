
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
import AIAssistant from '@/components/common/AIAssistant';
import { TicketMediaSection } from '@/components/tickets/TicketMediaSection';
import { TicketBookingTabs } from '@/components/tickets/TicketBookingTabs';
import MobileTicketBooking from '@/components/tickets/MobileTicketBooking';

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

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Title Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{ticket.location || 'Location not specified'}</span>
            </div>
            
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {ticket.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{ticket.rating || 4.5}</span>
                <span className="text-gray-600 text-sm">({ticket.total_reviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left Column - Media and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Section */}
              <TicketMediaSection ticket={ticket} />

              {/* Pricing Cards */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Ticket Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
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

              {/* Details Tabs */}
              <TicketBookingTabs ticket={ticket} />
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <MobileTicketBooking ticket={ticket} />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Media Section */}
            <TicketMediaSection ticket={ticket} />

            {/* Pricing Cards */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ticket Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">{formatPrice(ticket.price_adult)}</div>
                    <div className="text-sm text-gray-600">Adult (12+ years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-green-600">{formatPrice(ticket.price_child)}</div>
                    <div className="text-sm text-gray-600">Child (3-11 years)</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-purple-600">{formatPrice(ticket.price_infant)}</div>
                    <div className="text-sm text-gray-600">Infant (0-2 years)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <MobileTicketBooking ticket={ticket} />

            {/* Details Tabs */}
            <TicketBookingTabs ticket={ticket} />
          </div>
        </div>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default TicketDetailPage;
