
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import TicketCard from '@/components/tickets/TicketCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Ticket } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

const TicketsPage = () => {
  const { data: tickets, isLoading } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState('all');
  const navigate = useNavigate();

  const filteredTickets = tickets?.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price_adult - b.price_adult;
      case 'price-high':
        return b.price_adult - a.price_adult;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleTicketBooking = (ticketId: string) => {
    navigate(`/booking?type=ticket&id=${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Attraction Tickets</h1>
          <p className="text-xl text-gray-600">Skip the lines with instant digital tickets</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-1000">Under ₹1,000</SelectItem>
                <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                <SelectItem value="5000+">₹5,000+</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{sortedTickets.length} tickets found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTickets.map((ticket) => (
            <div key={ticket.id}>
              <TicketCard 
                ticket={ticket} 
                onBook={() => handleTicketBooking(ticket.id)}
              />
            </div>
          ))}
        </div>

        {sortedTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TicketsPage;
