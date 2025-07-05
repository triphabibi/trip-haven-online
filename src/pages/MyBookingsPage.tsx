
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const MyBookingsPage = () => {
  const { formatPrice } = useCurrency();
  
  // Mock data - in real app this would come from API
  const [bookings] = useState([
    {
      id: '1',
      reference: 'TH123456789',
      service: 'Dubai City Tour',
      type: 'tour',
      date: '2024-01-15',
      travelers: 2,
      amount: 299,
      status: 'confirmed',
      location: 'Dubai, UAE'
    },
    {
      id: '2',
      reference: 'TH987654321',
      service: 'UAE Tourist Visa',
      type: 'visa',
      date: '2024-01-20',
      travelers: 1,
      amount: 199,
      status: 'processing',
      location: 'UAE'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your travel bookings</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{booking.service}</CardTitle>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Reference: {booking.reference}</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{booking.travelers} travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(booking.amount)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {booking.status === 'confirmed' && (
                    <Button variant="outline" size="sm">Download Voucher</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Start planning your next adventure!</p>
            <Button className="mt-4">Browse Services</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
