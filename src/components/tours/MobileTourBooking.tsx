
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import type { Tour } from '@/types/tourism';

interface MobileTourBookingProps {
  tour: Tour;
}

const MobileTourBooking = ({ tour }: MobileTourBookingProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalPrice = (adults * (tour.price_adult || 0)) + 
                    (children * (tour.price_child || 0)) + 
                    (infants * (tour.price_infant || 0));

  const timeSlots = [
    "08:00 AM",
    "09:00 AM", 
    "10:00 AM",
    "02:00 PM",
    "03:00 PM"
  ];

  const pickupLocations = [
    "Dubai Mall",
    "Burj Khalifa",
    "Marina Mall",
    "JBR Beach",
    "Gold Souk",
    "Spice Souk",
    "Custom Location"
  ];

  const handleNext = () => {
    navigate(`/booking?type=tour&id=${tour.id}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4" data-booking-form>
      {/* Date Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Calendar className="h-4 w-4" />
          Select Date *
        </Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="h-12 text-base"
        />
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base font-medium">
          <Clock className="h-4 w-4" />
          Preferred Time *
        </Label>
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time} className="text-base">
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pickup Location */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base font-medium">
          <MapPin className="h-4 w-4 text-red-500" />
          Pickup Location *
        </Label>
        <Select value={pickupLocation} onValueChange={setPickupLocation}>
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Select pickup location" />
          </SelectTrigger>
          <SelectContent>
            {pickupLocations.map((location) => (
              <SelectItem key={location} value={location} className="text-base">
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Number of Travelers */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-orange-600">
            <Users className="h-5 w-5" />
            Number of Travelers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adults */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-orange-600">Adults (12+)</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="h-8 w-8 p-0"
                  disabled={adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-8 text-center font-medium border-orange-300"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdults(adults + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-orange-600">
              {formatPrice(tour.price_adult || 0)}
            </div>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-orange-600">Children (2-11)</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="h-8 w-8 p-0"
                  disabled={children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-8 text-center font-medium border-orange-300"
                  min="0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChildren(children + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-orange-600">
              {formatPrice(tour.price_child || 0)}
            </div>
          </div>

          {/* Infants */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-orange-600">Infants (0-1)</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInfants(Math.max(0, infants - 1))}
                  className="h-8 w-8 p-0"
                  disabled={infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={infants}
                  onChange={(e) => setInfants(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 h-8 text-center font-medium border-orange-300"
                  min="0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInfants(infants + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-orange-600">
              {formatPrice(tour.price_infant || 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Button */}
      <Button
        onClick={handleNext}
        disabled={!selectedDate || !selectedTime || !pickupLocation}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        Next →
      </Button>
    </div>
  );
};

export default MobileTourBooking;
