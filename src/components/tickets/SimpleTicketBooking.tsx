
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Users, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

interface SimpleTicketBookingProps {
  ticket: {
    id: string;
    title: string;
    price_adult: number;
    price_child?: number;
    price_infant?: number;
  };
}

const SimpleTicketBooking = ({ ticket }: SimpleTicketBookingProps) => {
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
    "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
  ];

  const totalPrice = (formData.adults * ticket.price_adult) + 
                    (formData.children * (ticket.price_child || 0)) + 
                    (formData.infants * (ticket.price_infant || 0));

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

  const handleBookNow = async () => {
    if (validateForm()) {
      try {
        const { data, error } = await supabase
          .from('new_bookings')
          .insert({
            service_id: ticket.id,
            service_type: 'ticket',
            service_title: ticket.title,
            customer_name: formData.leadGuestName,
            customer_email: formData.email,
            customer_phone: formData.mobile,
            adults_count: formData.adults,
            children_count: formData.children,
            infants_count: formData.infants,
            base_amount: totalPrice,
            total_amount: totalPrice,
            final_amount: totalPrice,
            travel_date: formData.selectedDate,
            travel_time: formData.selectedTime,
            booking_status: 'pending',
            payment_status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "🎉 Booking Created!",
          description: "Redirecting to payment...",
        });

        // Redirect to payment page
        window.location.href = `/booking-payment?type=ticket&id=${ticket.id}&bookingId=${data.id}&amount=${totalPrice}&customerName=${formData.leadGuestName}&customerEmail=${formData.email}&customerPhone=${formData.mobile}&serviceTitle=${ticket.title}`;
      } catch (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      }
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
    <div className="w-full overflow-x-hidden">
      <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Total Price Display */}
        <div className="w-full">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl text-center border border-blue-100">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Total for {formData.adults + formData.children + formData.infants} people
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Date */}
            <div className="w-full">
              <Label className="flex items-center gap-2 font-medium mb-3 text-sm sm:text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Select Date *
              </Label>
              <Input
                type="date"
                value={formData.selectedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full h-12 text-base ${errors.selectedDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.selectedDate && <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>}
            </div>

            {/* Time */}
            <div className="w-full">
              <Label className="flex items-center gap-2 font-medium mb-3 text-sm sm:text-base">
                <Clock className="h-4 w-4 text-primary" />
                Select Time *
              </Label>
              <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
                <SelectTrigger className={`w-full h-12 text-base ${errors.selectedTime ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedTime && <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>}
            </div>
          </div>
        </div>

        {/* Lead Guest Name */}
        <div className="w-full">
          <Label className="flex items-center gap-2 font-medium mb-3 text-sm sm:text-base">
            <User className="h-4 w-4 text-primary" />
            Lead Guest Full Name *
          </Label>
          <Input
            value={formData.leadGuestName}
            onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
            placeholder="Enter full name"
            className={`w-full h-12 text-base ${errors.leadGuestName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.leadGuestName && <p className="text-red-500 text-sm mt-1">{errors.leadGuestName}</p>}
        </div>

        {/* Number of People */}
        <div className="w-full">
          <Label className="flex items-center gap-2 font-medium mb-4 text-sm sm:text-base">
            <Users className="h-4 w-4 text-primary" />
            Number of People
          </Label>
          
          <div className="space-y-3 w-full">
            {/* Adults */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-200">
              <div className="flex-1 mr-4">
                <div className="font-semibold text-base text-gray-900">Adults</div>
                <div className="text-sm text-gray-600">{formatPrice(ticket.price_adult)} each</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg min-w-[2.5rem] text-center">{formData.adults}</span>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  onClick={() => updateCount('adults', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            {ticket.price_child && ticket.price_child > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-200">
                <div className="flex-1 mr-4">
                  <div className="font-semibold text-base text-gray-900">Children</div>
                  <div className="text-sm text-gray-600">{formatPrice(ticket.price_child)} each</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => updateCount('children', false)}
                    disabled={formData.children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg min-w-[2.5rem] text-center">{formData.children}</span>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => updateCount('children', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Infants */}
            {ticket.price_infant && ticket.price_infant > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl w-full border border-gray-200">
                <div className="flex-1 mr-4">
                  <div className="font-semibold text-base text-gray-900">Infants</div>
                  <div className="text-sm text-gray-600">{formatPrice(ticket.price_infant)} each</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => updateCount('infants', false)}
                    disabled={formData.infants <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg min-w-[2.5rem] text-center">{formData.infants}</span>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => updateCount('infants', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Email */}
            <div className="w-full">
              <Label className="flex items-center gap-2 font-medium mb-3 text-sm sm:text-base">
                <Mail className="h-4 w-4 text-primary" />
                Email Address *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className={`w-full h-12 text-base ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="w-full">
              <Label className="flex items-center gap-2 font-medium mb-3 text-sm sm:text-base">
                <Phone className="h-4 w-4 text-primary" />
                Mobile Number *
              </Label>
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Enter mobile number"
                className={`w-full h-12 text-base ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="w-full">
          <Button
            onClick={handleBookNow}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTicketBooking;
