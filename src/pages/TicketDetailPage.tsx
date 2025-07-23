
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
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />

      {/* Mobile-First Container - Full Width */}
      <div className="w-full min-w-0">
        <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="w-full max-w-7xl mx-auto min-w-0">
            
            {/* Title Section - Mobile First */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 w-full min-w-0">
              <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex-wrap">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words min-w-0">{ticket.location || 'Location not specified'}</span>
              </div>
              
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 break-words min-w-0">
                {ticket.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center gap-1 min-w-0">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{ticket.rating || 4.5}</span>
                  <span className="text-gray-600 text-xs sm:text-sm">({ticket.total_reviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Media Section - Full Width Mobile */}
            <div className="mb-3 sm:mb-4 lg:mb-6 w-full min-w-0">
              <TicketMediaSection ticket={ticket} />
            </div>

            {/* Pricing Cards - Mobile Responsive Grid */}
            <div className="mb-3 sm:mb-4 lg:mb-6 w-full min-w-0">
              <Card className="overflow-hidden shadow-sm border-0 w-full">
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl">Ticket Prices</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg text-center w-full min-w-0">
                      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-blue-600 break-words">
                        {formatPrice(ticket.price_adult)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Adult (12+ years)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg text-center w-full min-w-0">
                      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-green-600 break-words">
                        {formatPrice(ticket.price_child)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Child (3-11 years)</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg text-center w-full min-w-0">
                      <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-purple-600 break-words">
                        {formatPrice(ticket.price_infant)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Infant (0-2 years)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form - Full Width Mobile */}
            <div className="mb-3 sm:mb-4 lg:mb-6 w-full min-w-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                  <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white text-center">
                    Book Your Tickets
                  </h2>
                </div>
                <div className="p-3 sm:p-4 lg:p-6 w-full min-w-0">
                  <SimpleTicketBooking ticket={ticket} />
                </div>
              </div>
            </div>

            {/* Details Tabs - Full Width Mobile */}
            <div className="mb-3 sm:mb-4 lg:mb-6 w-full min-w-0">
              <TicketDetailsTabs ticket={ticket} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default TicketDetailPage;
