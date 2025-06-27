
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Clock, Shield, Phone, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TourBookingCardProps {
  tour: any;
}

const TourBookingCard = ({ tour }: TourBookingCardProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalPrice = (adults * tour.price_adult) + (children * tour.price_child) + (infants * tour.price_infant);

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Price Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              ₹{tour.price_adult.toLocaleString()}
            </div>
            <div className="text-blue-100">per adult</div>
            {tour.price_child > 0 && (
              <div className="text-sm text-blue-100 mt-2">
                Child (2-11): ₹{tour.price_child.toLocaleString()} • 
                {tour.price_infant > 0 && ` Infant (0-2): ₹${tour.price_infant.toLocaleString()}`}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Calendar className="h-4 w-4" />
              Select Date
            </Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full"
            />
          </div>

          {/* Time Selection */}
          {tour.available_times && tour.available_times.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-4 w-4" />
                Select Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {tour.available_times.map((time: string, index: number) => (
                    <SelectItem key={index} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Guest Selection */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Users className="h-4 w-4" />
              Guests
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-gray-500">Age 18+</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="h-8 w-8"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(adults + 1)}
                    className="h-8 w-8"
                  >
                    +
                  </Button>
                </div>
              </div>

              {tour.price_child > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">Age 2-17</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="h-8 w-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(children + 1)}
                      className="h-8 w-8"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              {tour.price_infant > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-gray-500">Age 0-2</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="h-8 w-8"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{infants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setInfants(infants + 1)}
                      className="h-8 w-8"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{adults} Adults × ₹{tour.price_adult.toLocaleString()}</span>
              <span>₹{(adults * tour.price_adult).toLocaleString()}</span>
            </div>
            {children > 0 && (
              <div className="flex justify-between text-sm">
                <span>{children} Children × ₹{tour.price_child.toLocaleString()}</span>
                <span>₹{(children * tour.price_child).toLocaleString()}</span>
              </div>
            )}
            {infants > 0 && (
              <div className="flex justify-between text-sm">
                <span>{infants} Infants × ₹{tour.price_infant.toLocaleString()}</span>
                <span>₹{(infants * tour.price_infant).toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Book Now Button */}
          <Link
            to={`/booking?type=tour&id=${tour.id}`}
            className="block"
          >
            <Button size="lg" className="w-full text-lg font-semibold py-6">
              Book Now
            </Button>
          </Link>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Contact Options */}
          <div className="space-y-3 pt-4 border-t">
            <div className="text-center text-sm text-gray-600 mb-3">Need help?</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourBookingCard;
