
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Minus, Users, Phone, Mail, Hotel, Plane, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import type { TourPackage } from '@/types/tourism';

interface ModernPackageBookingProps {
  pkg: TourPackage;
}

const ModernPackageBooking = ({ pkg }: ModernPackageBookingProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : pkg.nights;
  const totalPrice = (adults * pkg.price_adult) + (children * pkg.price_child) + (infants * pkg.price_infant);

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !email || !phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      alert('Package booking confirmed! Redirecting to payment...');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <Card className="sticky top-8 shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl">Book This Package</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Hotel className="h-4 w-4" />
            <span>{pkg.nights} Nights</span>
          </div>
          <div className="flex items-center gap-1">
            <Plane className="h-4 w-4" />
            <span>Transfers</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Tours</span>
          </div>
        </div>
        <div className="text-2xl font-bold">{formatPrice(pkg.price_adult)} <span className="text-sm font-normal">per person</span></div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Check-in Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Check-out Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date < new Date() || (checkIn && date <= checkIn)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Traveler Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700">Number of Travelers</Label>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Adults</div>
                <div className="text-xs text-gray-500">Age 12+</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold w-8 text-center">{adults}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdults(adults + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Children</div>
                <div className="text-xs text-gray-500">Age 2-11</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold w-8 text-center">{children}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChildren(children + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Infants</div>
                <div className="text-xs text-gray-500">Under 2</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold w-8 text-center">{infants}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInfants(infants + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
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
            <Label className="text-sm font-semibold text-gray-700">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
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

        {/* Package Inclusions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Package Includes:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Hotel className="h-3 w-3" />
              <span>{nights} nights accommodation</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="h-3 w-3" />
              <span>Airport transfers</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>Daily sightseeing tours</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Adults ({adults}x)</span>
            <span>{formatPrice(adults * pkg.price_adult)}</span>
          </div>
          {children > 0 && (
            <div className="flex justify-between text-sm">
              <span>Children ({children}x)</span>
              <span>{formatPrice(children * pkg.price_child)}</span>
            </div>
          )}
          {infants > 0 && (
            <div className="flex justify-between text-sm">
              <span>Infants ({infants}x)</span>
              <span>{formatPrice(infants * pkg.price_infant)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-emerald-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={isSubmitting || !checkIn || !checkOut || !email || !phone}
          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
        >
          {isSubmitting ? 'Processing...' : 'Book Package & Pay'}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Free cancellation up to 48 hours before check-in
        </p>
      </CardContent>
    </Card>
  );
};

export default ModernPackageBooking;
