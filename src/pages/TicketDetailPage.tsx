import { useParams, Link } from 'react-router-dom';
import { useTickets } from '@/hooks/useTickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Star, MapPin, Download, Share2, Heart, Zap, Clock, CheckCircle } from 'lucide-react';

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading, error } = useTickets({ id });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-64 mb-2" /></CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Ticket</h1>
            <p className="text-gray-600">Unable to load ticket details. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
            <p className="text-gray-600">The requested ticket could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <div className="relative">
            {ticket.image_urls && ticket.image_urls[0] ? (
              <img
                src={ticket.image_urls[0]}
                alt={ticket.title}
                className="w-full h-64 object-cover rounded-t-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-t-md">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {ticket.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500">
                Featured
              </Badge>
            )}
          </div>
          
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{ticket.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{ticket.location}</span>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-4">
            {ticket.description && (
              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-gray-700">{ticket.description}</p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Price</h4>
                <div className="text-xl font-bold text-green-600">
                  ₹{ticket.price_adult.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">per adult</div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Rating</h4>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{ticket.rating?.toFixed(1) || 'N/A'}</span>
                  {ticket.total_reviews && ticket.total_reviews > 0 && (
                    <span className="text-gray-500">({ticket.total_reviews} reviews)</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Instant Delivery</h4>
                <div className="flex items-center gap-2">
                  {ticket.instant_delivery ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Available</span>
                    </>
                  ) : (
                    <span>Not Available</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">E-Ticket</h4>
                {ticket.ticket_pdf_urls && ticket.ticket_pdf_urls.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-500" />
                    <a href={ticket.ticket_pdf_urls[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Download Ticket
                    </a>
                  </div>
                ) : (
                  <span>Not Available</span>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-gray-900">Share</h4>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-500" />
                <span>Share this ticket</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default TicketDetailPage;
