
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
      const bookingData = {
        serviceId: tour.id,
        serviceType: 'tour',
        serviceTitle: tour.title,
        ...formData,
        totalAmount: totalPrice
      };
      
      // Redirect to payment gateway with booking data
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
        title: "Booking Initiated",
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
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl font-bold text-center">Book This Tour</CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm md:text-base">
          <Clock className="h-4 w-4" />
          <span>{tour.duration || 'Full Day'}</span>
          {tour.category && (
            <>
              <span>•</span>
              <span>{tour.category}</span>
            </>
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{formatPrice(totalPrice)}</div>
          <div className="text-white/90 text-sm">per person</div>
        </div>
      </CardHeader>
        
        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Check-in Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Check-in Date *</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.selectedDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className={`h-12 pl-10 ${errors.selectedDate ? 'border-red-500' : ''}`}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.selectedDate && <p className="text-red-500 text-xs">{errors.selectedDate}</p>}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Check-out Date *</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.selectedTime ? formData.selectedDate : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedTime: e.target.value }))}
                  min={formData.selectedDate || new Date().toISOString().split('T')[0]}
                  className={`h-12 pl-10 ${errors.selectedTime ? 'border-red-500' : ''}`}
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Number of Travelers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Number of Travelers</Label>
            
            <div className="border rounded-lg p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-xs text-gray-500">Age 12+</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('adults', false)}
                    disabled={formData.adults <= 1}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('adults', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-xs text-gray-500">Age 2-11</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('children', false)}
                    disabled={formData.children <= 0}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('children', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-xs text-gray-500">Under 2</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('infants', false)}
                    disabled={formData.infants <= 0}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateCount('infants', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Address *</Label>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className={`h-12 pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Phone Number *</Label>
            <div className="relative">
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="+971 50 123 4567"
                className={`h-12 pl-10 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
          </div>

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
    </Card>
  );
};

export default UnifiedTourBooking;
