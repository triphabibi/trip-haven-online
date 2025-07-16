
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import TicketCard from '@/components/tickets/TicketCard';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Ticket } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BeautifulLoading 
          type="search" 
          message="Finding amazing attraction tickets for you..." 
          fullScreen 
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Attraction Tickets</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Skip the lines with instant digital tickets to top attractions worldwide
          </p>
        </div>

        {/* Search & Sort */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex items-center justify-center">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-3 rounded-lg">
                {sortedTickets.length} tickets available
              </div>
            </div>
          </div>
        </div>

        {sortedTickets && sortedTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id}
                ticket={ticket} 
                onBook={() => handleTicketBooking(ticket.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets found matching your criteria.</p>
            <Link to="/">
              <Button className="mt-4">Return to Home</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TicketsPage;
