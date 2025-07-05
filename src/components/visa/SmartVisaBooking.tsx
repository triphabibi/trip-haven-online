
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Upload, Users, User, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

interface SmartVisaBookingProps {
  visa: {
    id: string;
    country: string;
    visa_type: string;
    price: number;
  };
}

const SmartVisaBooking = ({ visa }: SmartVisaBookingProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    passportExpiry: ''
  });

  const totalTravelers = travelers.adults + travelers.children;
  const totalPrice = totalTravelers * visa.price;

  const nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali', 'Afghan',
    'American', 'British', 'Canadian', 'Australian', 'German', 'French',
    'Italian', 'Spanish', 'Russian', 'Chinese', 'Japanese', 'Korean',
    'Filipino', 'Indonesian', 'Malaysian', 'Thai', 'Vietnamese', 'Other'
  ];

  const handleBooking = () => {
    if (!bookingData.fullName || !bookingData.email || !bookingData.mobile) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Direct booking with payment gateway
    const queryParams = new URLSearchParams({
      type: 'visa',
      id: visa.id,
      adults: travelers.adults.toString(),
      children: travelers.children.toString(),
      name: bookingData.fullName,
      email: bookingData.email,
      mobile: bookingData.mobile,
      nationality: bookingData.nationality,
      passport: bookingData.passportNumber,
      dob: bookingData.dateOfBirth,
      expiry: bookingData.passportExpiry,
      amount: totalPrice.toString()
    });

    navigate(`/booking?${queryParams.toString()}`);
    
    toast({
      title: "Redirecting to Payment",
      description: "Processing your booking...",
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-center font-bold">
            {visa.country} - {visa.visa_type}
          </CardTitle>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold">{formatPrice(totalPrice)}</div>
            <div className="text-white/80 text-sm">Total for {totalTravelers} travelers</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 space-y-4 bg-white">
          {/* Travelers Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium text-gray-700">
              <Users className="h-4 w-4" />
              Number of Travelers
            </Label>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTravelers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                  disabled={travelers.adults <= 1}
                  className="h-8 w-8 p-0 bg-white border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium text-gray-900">{travelers.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTravelers(prev => ({ ...prev, adults: prev.adults + 1 }))}
                  className="h-8 w-8 p-0 bg-white border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Children</div>
                <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTravelers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                  disabled={travelers.children <= 0}
                  className="h-8 w-8 p-0 bg-white border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium text-gray-900">{travelers.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTravelers(prev => ({ ...prev, children: prev.children + 1 }))}
                  className="h-8 w-8 p-0 bg-white border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Details Form */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 text-center">Booking Details</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  value={bookingData.fullName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name as per passport"
                  className="h-12 bg-white border-gray-300 text-base"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="h-12 bg-white border-gray-300 text-base"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4" />
                  Mobile Number *
                </Label>
                <Input
                  type="tel"
                  value={bookingData.mobile}
                  onChange={(e) => setBookingData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter mobile number"
                  className="h-12 bg-white border-gray-300 text-base"
                />
              </div>

              <div>
                <Label className="font-medium text-gray-700 mb-2 block">Nationality *</Label>
                <Select 
                  value={bookingData.nationality} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, nationality: value }))}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-300 text-base">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto z-50">
                    {nationalities.map((nat) => (
                      <SelectItem 
                        key={nat} 
                        value={nat} 
                        className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-3 px-4 focus:bg-blue-100"
                      >
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-medium text-gray-700 mb-2 block">Passport Number</Label>
                <Input
                  value={bookingData.passportNumber}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="Enter passport number"
                  className="h-12 bg-white border-gray-300 text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="font-medium text-gray-700 mb-2 block">Date of Birth</Label>
                  <Input
                    type="date"
                    value={bookingData.dateOfBirth}
                    onChange={(e) => setBookingData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="h-12 bg-white border-gray-300 text-base"
                  />
                </div>
                <div>
                  <Label className="font-medium text-gray-700 mb-2 block">Passport Expiry</Label>
                  <Input
                    type="date"
                    value={bookingData.passportExpiry}
                    onChange={(e) => setBookingData(prev => ({ ...prev, passportExpiry: e.target.value }))}
                    className="h-12 bg-white border-gray-300 text-base"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                📧 Documents can be emailed or sent via WhatsApp after booking completion.
              </p>
            </div>

            <Button
              onClick={handleBooking}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
            >
              Book Now - {formatPrice(totalPrice)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartVisaBooking;
