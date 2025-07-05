
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Users, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';
import type { Tour } from '@/types/tourism';

interface UnifiedTourBookingProps {
  tour: Tour;
}

const UnifiedTourBooking = ({ tour }: UnifiedTourBookingProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    selectedDate: '',
    leadGuestName: '',
    selectedTime: '',
    adults: 1,
    children: 0,
    infants: 0,
    email: '',
    mobile: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
    "09:00 PM", "10:00 PM", "11:00 PM"
  ];

  const totalPrice = (formData.adults * (tour.price_adult || 0)) + 
                    (formData.children * (tour.price_child || 0)) + 
                    (formData.infants * (tour.price_infant || 0));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.selectedDate) newErrors.selectedDate = 'Date is required';
    if (!formData.leadGuestName.trim()) newErrors.leadGuestName = 'Lead guest name is required';
    if (!formData.selectedTime) newErrors.selectedTime = 'Time is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookNow = () => {
    if (validateForm()) {
      const queryParams = new URLSearchParams({
        type: 'tour',
        id: tour.id,
        date: formData.selectedDate,
        time: formData.selectedTime,
        adults: formData.adults.toString(),
        children: formData.children.toString(),
        infants: formData.infants.toString(),
        name: formData.leadGuestName,
        email: formData.email,
        mobile: formData.mobile,
        amount: totalPrice.toString()
      });
      
      navigate(`/booking?${queryParams.toString()}`);
      
      toast({
        title: "Processing Booking",
        description: "Redirecting to payment gateway...",
      });
    }
  };

  const updateCount = (field: 'adults' | 'children' | 'infants', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: increment 
        ? prev[field] + 1 
        : Math.max(field === 'adults' ? 1 : 0, prev[field] - 1)
    }));
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2 sm:p-4" data-booking-form>
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4">
          <CardTitle className="text-base sm:text-lg md:text-xl text-center font-bold">Book This Tour</CardTitle>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{formatPrice(totalPrice)}</div>
            <div className="text-white/80 text-xs sm:text-sm">Total for {formData.adults + formData.children + formData.infants} travelers</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-white">
          {/* Tour Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Select Tour Date *
            </Label>
            <Input
              type="date"
              value={formData.selectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`h-10 sm:h-12 bg-white border-gray-300 text-sm sm:text-base ${errors.selectedDate ? 'border-red-500' : ''}`}
            />
            {errors.selectedDate && <p className="text-red-500 text-xs sm:text-sm">{errors.selectedDate}</p>}
          </div>

          {/* Lead Guest Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              Lead Guest Full Name *
            </Label>
            <Input
              value={formData.leadGuestName}
              onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
              placeholder="Enter full name"
              className={`h-10 sm:h-12 bg-white border-gray-300 text-sm sm:text-base ${errors.leadGuestName ? 'border-red-500' : ''}`}
            />
            {errors.leadGuestName && <p className="text-red-500 text-xs sm:text-sm">{errors.leadGuestName}</p>}
          </div>

          {/* Pickup Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              Select Pickup Time *
            </Label>
            <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
              <SelectTrigger className={`h-10 sm:h-12 bg-white border-gray-300 text-sm sm:text-base ${errors.selectedTime ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Choose pickup time" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto z-50">
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time} className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-2 px-3 text-sm sm:text-base">
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedTime && <p className="text-red-500 text-xs sm:text-sm">{errors.selectedTime}</p>}
          </div>

          {/* Number of Travelers */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              Number of Travelers
            </Label>
            
            {/* Adults */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Adults (12+)</div>
                <div className="text-xs sm:text-sm text-gray-600">{formatPrice(tour.price_adult || 0)} each</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base">{formData.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', true)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Children (2-11)</div>
                <div className="text-xs sm:text-sm text-gray-600">{formatPrice(tour.price_child || 0)} each</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', false)}
                  disabled={formData.children <= 0}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base">{formData.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', true)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 text-sm sm:text-base">Infants (0-1)</div>
                <div className="text-xs sm:text-sm text-gray-600">{formatPrice(tour.price_infant || 0)} each</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', false)}
                  disabled={formData.infants <= 0}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base">{formData.infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', true)}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              Email Address *
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className={`h-10 sm:h-12 bg-white border-gray-300 text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              Mobile Number *
            </Label>
            <Input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="Enter mobile number"
              className={`h-10 sm:h-12 bg-white border-gray-300 text-sm sm:text-base ${errors.mobile ? 'border-red-500' : ''}`}
            />
            {errors.mobile && <p className="text-red-500 text-xs sm:text-sm">{errors.mobile}</p>}
          </div>

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            className="w-full h-10 sm:h-12 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedTourBooking;
