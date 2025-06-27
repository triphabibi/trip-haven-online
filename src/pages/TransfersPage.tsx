
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plane, MapPin, Users, Clock, ArrowRight, Search } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const TransfersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transferType, setTransferType] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Demo transfer data
  const transfers = [
    {
      id: '1',
      title: 'Dubai Airport to City Center',
      type: 'Airport Transfer',
      from: 'Dubai International Airport (DXB)',
      to: 'Downtown Dubai',
      duration: '45 minutes',
      vehicle: 'Private Car (Sedan)',
      capacity: 4,
      price_adult: 150,
      features: ['Free WiFi', 'Air Conditioning', 'Meet & Greet', 'Free Cancellation'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'
    },
    {
      id: '2',
      title: 'Abu Dhabi Airport Transfer',
      type: 'Airport Transfer',
      from: 'Abu Dhabi International Airport (AUH)',
      to: 'Abu Dhabi City Center',
      duration: '30 minutes',
      vehicle: 'Luxury SUV',
      capacity: 6,
      price_adult: 200,
      features: ['Luxury Vehicle', 'Professional Driver', 'Child Seats Available', 'Flight Monitoring'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500'
    },
    {
      id: '3',
      title: 'Dubai to Abu Dhabi City Transfer',
      type: 'City Transfer',
      from: 'Dubai',
      to: 'Abu Dhabi',
      duration: '1.5 hours',
      vehicle: 'Premium Van',
      capacity: 8,
      price_adult: 300,
      features: ['Comfortable Seating', 'Refreshments', 'Tour Guide Available', 'Multiple Stops'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    },
    {
      id: '4',
      title: 'Sharjah Airport to Dubai Hotels',
      type: 'Airport Transfer',
      from: 'Sharjah Airport (SHJ)',
      to: 'Dubai Hotels',
      duration: '1 hour',
      vehicle: 'Standard Car',
      capacity: 4,
      price_adult: 120,
      features: ['Door to Door', 'Fixed Price', '24/7 Service', 'English Speaking Driver'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'
    }
  ];

  const filteredTransfers = transfers.filter(transfer => 
    transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.to.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(transfer => 
    transferType === 'all' || transfer.type === transferType
  );

  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price_adult - b.price_adult;
      case 'price-high':
        return b.price_adult - a.price_adult;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const handleTransferBooking = (transferId: string) => {
    navigate(`/booking?type=transfer&id=${transferId}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Airport & City Transfers</h1>
          <p className="text-xl text-gray-600">Comfortable and reliable transfers to your destination</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={transferType} onValueChange={setTransferType}>
              <SelectTrigger>
                <SelectValue placeholder="Transfer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                <SelectItem value="City Transfer">City Transfer</SelectItem>
                <SelectItem value="Hotel Transfer">Hotel Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                {sortedTransfers.length} Options
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTransfers.map((transfer) => (
            <Card key={transfer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={transfer.image}
                  alt={transfer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-blue-500">{transfer.type}</Badge>
                  {transfer.instant_confirmation && (
                    <Badge className="bg-green-500">Instant Confirmation</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{transfer.title}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{transfer.from}</div>
                      <div className="text-gray-500">to {transfer.to}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{transfer.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Car className="h-4 w-4 text-orange-500" />
                    <span>{transfer.vehicle}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>Up to {transfer.capacity} passengers</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Included features:</p>
                  <div className="flex flex-wrap gap-1">
                    {transfer.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(transfer.price_adult)}</span>
                    <span className="text-gray-500 text-sm ml-1">per transfer</span>
                  </div>
                  <Button className="group" onClick={() => handleTransferBooking(transfer.id)}>
                    Book Transfer
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTransfers.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No transfers found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TransfersPage;
