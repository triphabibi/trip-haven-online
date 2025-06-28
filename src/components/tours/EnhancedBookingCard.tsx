
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, CalendarIcon, Clock, MapPin, Users, Shield, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';

interface EnhancedBookingCardProps {
  tour: any;
}

const EnhancedBookingCard = ({ tour }: EnhancedBookingCardProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  const totalPrice = (adults * (tour.price_adult || 0)) + 
                    (children * (tour.price_child || 0)) + 
                    (infants * (tour.price_infant || 0));

  const handleBookNow = () => {
    navigate(`/booking?type=tour&id=${tour.id}`);
  };

  const timeSlots = [
    "08:00 AM - Morning Departure",
    "09:00 AM - Standard Departure", 
    "10:00 AM - Late Morning",
    "02:00 PM - Afternoon Departure",
    "03:00 PM - Late Afternoon"
  ];

  return (
    <div className="sticky top-6">
      <Card className="shadow-lg border-gray-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-900">{tour.rating || 4.8}</span>
                <span className="text-sm text-gray-600">({tour.total_reviews || 2847} reviews)</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                From {formatPrice(tour.price_adult || 0)}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">per adult</p>
            </div>
            <Badge className="bg-green-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 text-base",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  {selectedDate ? (
                    <span>
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </span>
                  ) : (
                    <span>Choose your date</span>
                  )}
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

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Preferred Time
            </Label>
            <Select value={pickupTime} onValueChange={setPickupTime}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select pickup time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot} className="text-base">
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Pickup Location
            </Label>
            <Textarea
              placeholder="Enter your hotel name or pickup address..."
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="min-h-[80px] text-base resize-none"
            />
          </div>

          {/* Travelers */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Travelers
            </Label>
            
            {/* Adults */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-600">Age 13+</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">{adults}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setAdults(Math.min(10, adults + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Children</div>
                <div className="text-sm text-gray-600">Age 3-12</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">{children}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setChildren(Math.min(10, children + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Infants</div>
                <div className="text-sm text-gray-600">Age 0-2</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setInfants(Math.max(0, infants - 1))}
                  disabled={infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg w-8 text-center">{infants}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setInfants(Math.min(5, infants + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Adults ({adults})</span>
              <span>{formatPrice(adults * (tour.price_adult || 0))}</span>
            </div>
            {children > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Children ({children})</span>
                <span>{formatPrice(children * (tour.price_child || 0))}</span>
              </div>
            )}
            {infants > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Infants ({infants})</span>
                <span>{formatPrice(infants * (tour.price_infant || 0))}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Book Button */}
          <Button 
            onClick={handleBookNow} 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={!selectedDate}
          >
            {selectedDate ? 'Book Now' : 'Select Date to Continue'}
          </Button>

          {/* Trust Elements */}
          <div className="text-center space-y-2 text-sm text-gray-600">
            <p className="flex items-center justify-center gap-1">
              <Shield className="h-4 w-4 text-green-500" />
              Free cancellation up to 24 hours before
            </p>
            <p>Reserve now & pay later available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBookingCard;
