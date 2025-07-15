import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Car, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

interface TransferBookingProps {
  transfer: {
    id: string;
    title: string;
    from: string;
    to: string;
    price: number;
    vehicle: string;
    capacity: number;
  };
}

const TransferBooking = ({ transfer }: TransferBookingProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupDate: '',
    pickupTime: '',
    pickupLocation: transfer.from,
    dropoffLocation: transfer.to,
    passengers: 1,
    flightNumber: '',
    specialRequests: ''
  });

  const timeSlots = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.customerName || !formData.customerEmail || !formData.pickupDate || !formData.pickupTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          service_id: transfer.id,
          service_type: 'transfer',
          service_title: transfer.title,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          adults_count: formData.passengers,
          children_count: 0,
          infants_count: 0,
          base_amount: transfer.price,
          total_amount: transfer.price,
          final_amount: transfer.price,
          travel_date: formData.pickupDate,
          travel_time: formData.pickupTime,
          pickup_location: formData.pickupLocation,
          special_requests: `Flight: ${formData.flightNumber} | Drop-off: ${formData.dropoffLocation} | ${formData.specialRequests}`,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "🚗 Transfer Booked!",
        description: "Redirecting to payment...",
      });

      // Redirect to payment page
      window.location.href = `/booking-payment?type=transfer&id=${transfer.id}&bookingId=${data.id}&amount=${transfer.price}&customerName=${formData.customerName}&customerEmail=${formData.customerEmail}&customerPhone=${formData.customerPhone}&serviceTitle=${transfer.title}`;
    } catch (error) {
      console.error('Transfer booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Book Transfer Service
        </CardTitle>
        <div className="text-white/90">
          <div className="text-sm">{transfer.vehicle} • Up to {transfer.capacity} passengers</div>
          <div className="text-2xl font-bold mt-2">{formatPrice(transfer.price)}</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Route Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Route Details
          </h3>
          <div className="space-y-2 text-sm">
            <div><strong>From:</strong> {transfer.from}</div>
            <div><strong>To:</strong> {transfer.to}</div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                placeholder="+971 50 123 4567"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Transfer Details */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Transfer Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupDate">Pickup Date *</Label>
              <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pickupTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pickup Time *
              </Label>
              <Select value={formData.pickupTime} onValueChange={(value) => handleInputChange('pickupTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passengers">Number of Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max={transfer.capacity}
                value={formData.passengers}
                onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div>
              <Label htmlFor="flightNumber">Flight Number (Optional)</Label>
              <Input
                id="flightNumber"
                value={formData.flightNumber}
                onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                placeholder="EK123"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special requirements or instructions..."
              rows={3}
            />
          </div>
        </div>

        {/* Book Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          {loading ? '⏳ Processing...' : `Book Transfer - ${formatPrice(transfer.price)}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransferBooking;