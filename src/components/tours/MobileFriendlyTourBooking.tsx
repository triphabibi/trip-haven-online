
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Users, Mail, Phone, Plus, Minus, MapPin } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PaymentGatewaySelector from '@/components/common/PaymentGatewaySelector';
import type { Tour } from '@/types/tourism';

interface MobileFriendlyTourBookingProps {
  tour: Tour;
}

const MobileFriendlyTourBooking = ({ tour }: MobileFriendlyTourBookingProps) => {
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    selectedDate: '',
    selectedTime: '',
    pickupLocation: '',
    leadGuestName: '',
    email: '',
    mobile: '',
    adults: 1,
    children: 0,
    infants: 0,
    specialRequests: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const pickupLocations = [
    "Dubai Mall", "Burj Khalifa", "Marina Mall", "JBR Beach",
    "Gold Souk", "Spice Souk", "Atlantis The Palm", "Custom Location"
  ];

  const totalPrice = (formData.adults * (tour.price_adult || 0)) + 
                    (formData.children * (tour.price_child || 0)) + 
                    (formData.infants * (tour.price_infant || 0));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.selectedDate) newErrors.selectedDate = 'Date is required';
    if (!formData.selectedTime) newErrors.selectedTime = 'Time is required';
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.leadGuestName.trim()) newErrors.leadGuestName = 'Lead guest name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    try {
      // Generate booking reference
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const reference = `TH${timestamp.slice(-8)}${random}`;
      
      // Create booking record
      const { error } = await supabase
        .from('bookings')
        .insert({
          booking_reference: reference,
          service_type: 'tour',
          service_id: tour.id,
          service_title: tour.title,
          customer_name: formData.leadGuestName,
          customer_email: formData.email,
          customer_phone: formData.mobile,
          travel_date: formData.selectedDate,
          travel_time: formData.selectedTime,
          adults_count: formData.adults,
          children_count: formData.children,
          infants_count: formData.infants,
          base_amount: totalPrice,
          total_amount: totalPrice,
          pickup_location: formData.pickupLocation,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
          payment_status: 'pending'
        });

      if (error) throw error;

      setBookingReference(reference);
      setShowPayment(true);
      
      toast({
        title: "Booking Created!",
        description: `Booking reference: ${reference}. Please proceed with payment.`,
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          payment_reference: paymentId,
          booking_status: 'confirmed',
          payment_date: new Date().toISOString()
        })
        .eq('booking_reference', bookingReference);

      toast({
        title: "Booking Confirmed!",
        description: "Your tour has been successfully booked. Check your email for confirmation.",
      });

      // Reset form
      setFormData({
        selectedDate: '',
        selectedTime: '',
        pickupLocation: '',
        leadGuestName: '',
        email: '',
        mobile: '',
        adults: 1,
        children: 0,
        infants: 0,
        specialRequests: ''
      });
      setShowPayment(false);
    } catch (error) {
      console.error('Payment update error:', error);
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

  if (showPayment) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <PaymentGatewaySelector
          paymentData={{
            customerName: formData.leadGuestName,
            customerEmail: formData.email,
            customerPhone: formData.mobile,
            amount: totalPrice,
            bookingReference: bookingReference,
            serviceTitle: tour.title
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={(error) => {
            toast({
              title: "Payment Error",
              description: error,
              variant: "destructive",
            });
          }}
        />
        
        <Button
          onClick={() => setShowPayment(false)}
          variant="outline"
          className="w-full mt-4"
        >
          Back to Booking Form
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{tour.title}</CardTitle>
          <div className="text-2xl font-bold text-blue-600">
            {formatPrice(totalPrice)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Tour Date *
            </Label>
            <Input
              type="date"
              value={formData.selectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`h-12 ${errors.selectedDate ? 'border-red-500' : ''}`}
            />
            {errors.selectedDate && <p className="text-red-500 text-sm">{errors.selectedDate}</p>}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" />
              Pickup Time *
            </Label>
            <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
              <SelectTrigger className={`h-12 ${errors.selectedTime ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedTime && <p className="text-red-500 text-sm">{errors.selectedTime}</p>}
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4" />
              Pickup Location *
            </Label>
            <Select value={formData.pickupLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, pickupLocation: value }))}>
              <SelectTrigger className={`h-12 ${errors.pickupLocation ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                {pickupLocations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pickupLocation && <p className="text-red-500 text-sm">{errors.pickupLocation}</p>}
          </div>

          {/* Lead Guest Details */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              Lead Guest Details
            </Label>
            
            <div>
              <Input
                placeholder="Full Name *"
                value={formData.leadGuestName}
                onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
                className={`h-12 ${errors.leadGuestName ? 'border-red-500' : ''}`}
              />
              {errors.leadGuestName && <p className="text-red-500 text-sm">{errors.leadGuestName}</p>}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Input
                type="tel"
                placeholder="Mobile Number *"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className={`h-12 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>
          </div>

          {/* Travelers Count */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Number of Travelers
            </Label>

            {/* Adults */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Adults (12+)</div>
                <div className="text-sm text-gray-600">{formatPrice(tour.price_adult || 0)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Children (2-11)</div>
                <div className="text-sm text-gray-600">{formatPrice(tour.price_child || 0)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', false)}
                  disabled={formData.children <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Infants (0-1)</div>
                <div className="text-sm text-gray-600">{formatPrice(tour.price_infant || 0)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', false)}
                  disabled={formData.infants <= 0}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label>Special Requests (Optional)</Label>
            <Textarea
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          {/* Book Button */}
          <Button
            onClick={handleProceedToPayment}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Proceed to Payment - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileFriendlyTourBooking;
