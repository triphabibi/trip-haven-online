
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, Users, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import type { Tour } from '@/types/tourism';

interface StreamlinedTourBookingProps {
  tour: Tour;
}

const StreamlinedTourBooking = ({ tour }: StreamlinedTourBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();

  const totalPrice = (adults * tour.price_adult) + (children * tour.price_child);

  const handleBooking = async () => {
    if (!selectedDate || !email || !phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking process
    setTimeout(() => {
      alert('Booking confirmed! Redirecting to payment...');
      setIsSubmitting(false);
      // Here you would redirect to payment gateway
    }, 2000);
  };

  return (
    <Card className="sticky top-8 shadow-xl border-0" data-booking-form>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl">Book This Tour</CardTitle>
        <div className="text-2xl font-bold">{formatPrice(tour.price_adult)} <span className="text-sm font-normal">per adult</span></div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Select Tour Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Choose date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passenger Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700">Number of Travelers</Label>
          
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Adults</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold w-6 text-center flex-shrink-0">{adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(adults + 1)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Children</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold w-6 text-center flex-shrink-0">{children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(children + 1)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">📍 Pickup Point *</Label>
            <Input
              type="text"
              placeholder="Hotel name or location for pickup"
              className="h-12 bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">🕐 Preferred Pickup Time *</Label>
            <Input
              type="time"
              className="h-12 bg-white"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">📧 Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">📞 Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12 bg-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Adults ({adults}x)</span>
            <span>{formatPrice(adults * tour.price_adult)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-sm">
              <span>Children ({children}x)</span>
              <span>{formatPrice(children * tour.price_child)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-blue-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={isSubmitting || !selectedDate || !email || !phone}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
        >
          {isSubmitting ? 'Processing...' : 'Book Now & Pay'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Free cancellation up to 24 hours before the tour
        </p>
      </CardContent>
    </Card>
  );
};

export default StreamlinedTourBooking;
