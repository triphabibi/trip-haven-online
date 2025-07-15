
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, MapPin, Clock, Users, ArrowRight, Search } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const TransfersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transferType, setTransferType] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Demo transfer data with modern structure
  const transfers = [
    {
      id: '1',
      title: 'Dubai Airport to City Center',
      type: 'Airport Transfer',
      from: 'Dubai International Airport (DXB)',
      to: 'Downtown Dubai / Business Bay',
      duration: '45 minutes',
      vehicle: 'Premium Sedan',
      capacity: 4,
      price: 150,
      features: ['Free WiFi', 'Air Conditioning', 'Meet & Greet', 'Flight Monitoring'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'
    },
    {
      id: '2',
      title: 'Dubai City to Abu Dhabi',
      type: 'City Transfer',
      from: 'Dubai Hotels',
      to: 'Abu Dhabi City Center',
      duration: '1.5 hours',
      vehicle: 'Luxury SUV',
      capacity: 6,
      price: 300,
      features: ['Luxury Vehicle', 'Professional Driver', 'Refreshments', 'Multiple Stops'],
      instant_confirmation: true,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500'
    }
  ];

  const filteredTransfers = transfers.filter(transfer => 
    transfer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransferBooking = async (transferId: string) => {
    try {
      const transfer = transfers.find(t => t.id === transferId);
      if (!transfer) return;

      // Create booking and redirect to payment
      window.location.href = `/booking-payment?type=transfer&id=${transferId}&amount=${transfer.price}&serviceTitle=${transfer.title}`;
    } catch (error) {
      console.error('Transfer booking error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Airport & City Transfers</h1>
          <p className="text-xl text-gray-600">Comfortable and reliable transfers to your destination</p>
        </div>

        {/* Modern Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <Select value={transferType} onValueChange={setTransferType}>
              <SelectTrigger className="h-12">
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
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTransfers.map((transfer) => (
            <Card key={transfer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <div className="relative">
                <img
                  src={transfer.image}
                  alt={transfer.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white">{transfer.type}</Badge>
                  {transfer.instant_confirmation && (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">Instant Booking</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{transfer.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{transfer.from}</div>
                      <div className="text-gray-500">to {transfer.to}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">{transfer.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-orange-600" />
                    <span className="text-sm text-gray-700">{transfer.vehicle}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Up to {transfer.capacity} passengers</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {transfer.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(transfer.price)}</span>
                    <span className="text-gray-500 text-sm ml-2">per transfer</span>
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 group"
                    onClick={() => handleTransferBooking(transfer.id)}
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransfers.length === 0 && (
          <div className="text-center py-16">
            <Car className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No transfers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TransfersPage;
