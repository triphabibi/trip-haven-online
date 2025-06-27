
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Ticket, Download } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description?: string;
    price_adult: number;
    price_child?: number;
    price_infant?: number;
    location?: string;
    image_urls?: string[];
    instant_delivery?: boolean;
    is_featured?: boolean;
    rating?: number;
    total_reviews?: number;
  };
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  const { formatPrice } = useCurrency();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={ticket.image_urls?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500'}
          alt={ticket.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {ticket.instant_delivery && (
            <Badge className="bg-green-500">
              <Ticket className="h-3 w-3 mr-1" />
              Instant Delivery
            </Badge>
          )}
          {ticket.is_featured && (
            <Badge className="bg-yellow-500">Featured</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {ticket.rating || 0} ({ticket.total_reviews || 0})
            </span>
          </div>
          {ticket.location && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{ticket.location}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{ticket.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(ticket.price_adult)}</span>
            <span className="text-gray-500 text-sm ml-1">per adult</span>
            {ticket.price_child && ticket.price_child > 0 && (
              <div className="text-sm text-gray-500">
                Child: {formatPrice(ticket.price_child)}
              </div>
            )}
          </div>
          <Link to={`/tickets/${ticket.id}`}>
            <Button size="sm" className="group">
              Buy Ticket
              <Download className="h-4 w-4 ml-1 group-hover:translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
