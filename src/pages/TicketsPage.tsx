
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '@/hooks/useTickets';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Star, Download, MapPin, Search, Zap } from 'lucide-react';

const TicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const { data: tickets, isLoading, error } = useTickets();

  const filteredTickets = tickets?.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price_adult - b.price_adult;
      case 'price_high':
        return b.price_adult - a.price_adult;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.total_reviews || 0) - (a.total_reviews || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tickets</h1>
            <p className="text-gray-600">Unable to load attraction tickets. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Attraction Tickets</h1>
            <p className="text-xl md:text-2xl mb-8">Skip the line with instant digital tickets</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search attractions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-gray-600">
            {isLoading ? 'Loading...' : `${sortedTickets.length} tickets found`}
          </div>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedTickets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {ticket.image_urls && ticket.image_urls[0] ? (
                    <img
                      src={ticket.image_urls[0]}
                      alt={ticket.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {ticket.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      Featured
                    </Badge>
                  )}
                  {ticket.instant_delivery && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      <Zap className="h-3 w-3 mr-1" />
                      Instant
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ticket.title}</h3>
                  {ticket.location && (
                    <div className="flex items-center gap-1 mb-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{ticket.location}</span>
                    </div>
                  )}
                  {ticket.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    {ticket.rating && ticket.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{ticket.rating.toFixed(1)}</span>
                        {ticket.total_reviews && ticket.total_reviews > 0 && (
                          <span className="text-gray-500">({ticket.total_reviews})</span>
                        )}
                      </div>
                    )}
                    
                    {ticket.instant_delivery && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Download className="h-4 w-4" />
                        <span>Instant PDF</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{ticket.price_adult.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per adult</div>
                  </div>
                  
                  <Button asChild>
                    <Link to={`/tickets/${ticket.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TicketsPage;
