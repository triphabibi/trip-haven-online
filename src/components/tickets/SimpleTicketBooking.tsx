
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, Users, Phone, Mail, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import type { AttractionTicket } from '@/types/tourism';

interface SimpleTicketBookingProps {
  ticket: AttractionTicket;
}

const SimpleTicketBooking = ({ ticket }: SimpleTicketBookingProps) => {
  const [travelDate, setTravelDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();

  const totalPrice = (adults * ticket.price_adult) + (children * ticket.price_child) + (infants * ticket.price_infant);

  const handleBooking = async () => {
    if (!travelDate || !email || !phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      alert('Ticket booking confirmed! Redirecting to payment...');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Card className="sticky top-8 shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Book Tickets
        </CardTitle>
        {ticket.instant_delivery && (
          <div className="text-sm bg-white/20 rounded-full px-3 py-1 w-fit">
            ⚡ Instant Digital Delivery
          </div>
        )}
        <div className="text-2xl font-bold">{formatPrice(ticket.price_adult)} <span className="text-sm font-normal">per adult</span></div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Travel Date */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">Travel Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 bg-white border-gray-300",
                  !travelDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {travelDate ? format(travelDate, "PPP") : "Select travel date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
              <Calendar
                mode="single"
                selected={travelDate}
                onSelect={setTravelDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Number of Pax */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700">Number of Pax</Label>
          
          {/* Adults */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Adults</div>
                <div className="text-sm text-gray-500">{formatPrice(ticket.price_adult)} each</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-12 text-center">{adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(adults + 1)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Children (2-12 years)</div>
                <div className="text-sm text-gray-500">{formatPrice(ticket.price_child)} each</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-12 text-center">{children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(children + 1)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Infants (0-2 years)</div>
                <div className="text-sm text-gray-500">{formatPrice(ticket.price_infant)} each</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-12 text-center">{infants}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInfants(infants + 1)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700" htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700" htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-orange-50 p-4 rounded-lg border-t-4 border-orange-500">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Adults ({adults}x)</span>
              <span>{formatPrice(adults * ticket.price_adult)}</span>
            </div>
            {children > 0 && (
              <div className="flex justify-between text-sm">
                <span>Children ({children}x)</span>
                <span>{formatPrice(children * ticket.price_child)}</span>
              </div>
            )}
            {infants > 0 && (
              <div className="flex justify-between text-sm">
                <span>Infants ({infants}x)</span>
                <span>{formatPrice(infants * ticket.price_infant)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total</span>
              <span className="text-orange-600">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={isSubmitting || !travelDate || !email || !phone}
          className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold text-lg"
        >
          {isSubmitting ? 'Processing...' : `Book Now - ${formatPrice(totalPrice)}`}
        </Button>

        {ticket.instant_delivery && (
          <p className="text-xs text-gray-500 text-center">
            🎫 E-tickets delivered instantly to your email after payment
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleTicketBooking;
