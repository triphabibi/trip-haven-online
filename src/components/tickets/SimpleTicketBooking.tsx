
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
    <div className="w-full max-w-none overflow-x-hidden min-w-0">
      <div className="w-full space-y-4 sm:space-y-6 min-w-0">
        {/* Total Price Display */}
        <div className="w-full min-w-0">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg text-center w-full">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 break-words">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              Total for {formData.adults + formData.children + formData.infants} people
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="w-full min-w-0">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Date */}
            <div className="w-full min-w-0">
              <Label className="flex items-center gap-2 font-medium mb-2 text-sm sm:text-base">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                Select Date *
              </Label>
              <Input
                type="date"
                value={formData.selectedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full min-h-[48px] text-sm sm:text-base px-3 sm:px-4 ${errors.selectedDate ? 'border-red-500' : ''}`}
              />
              {errors.selectedDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.selectedDate}</p>}
            </div>

            {/* Time */}
            <div className="w-full min-w-0">
              <Label className="flex items-center gap-2 font-medium mb-2 text-sm sm:text-base">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                Select Time *
              </Label>
              <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
                <SelectTrigger className={`w-full min-h-[48px] text-sm sm:text-base ${errors.selectedTime ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedTime && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.selectedTime}</p>}
            </div>
          </div>
        </div>

        {/* Lead Guest Name */}
        <div className="w-full min-w-0">
          <Label className="flex items-center gap-2 font-medium mb-2 text-sm sm:text-base">
            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            Lead Guest Full Name *
          </Label>
          <Input
            value={formData.leadGuestName}
            onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
            placeholder="Enter full name"
            className={`w-full min-h-[48px] text-sm sm:text-base px-3 sm:px-4 ${errors.leadGuestName ? 'border-red-500' : ''}`}
          />
          {errors.leadGuestName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.leadGuestName}</p>}
        </div>

        {/* Number of People */}
        <div className="w-full min-w-0">
          <Label className="flex items-center gap-2 font-medium mb-3 sm:mb-4 text-sm sm:text-base">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            Number of People
          </Label>
          
          <div className="space-y-2 sm:space-y-3 w-full">
            {/* Adults */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg w-full min-w-0">
              <div className="flex-1 min-w-0 mr-3">
                <div className="font-medium text-sm sm:text-base text-gray-900">Adults</div>
                <div className="text-xs sm:text-sm text-gray-600">{formatPrice(ticket.price_adult)} each</div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  type="button"
                  className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <span className="font-bold text-base sm:text-lg min-w-[2rem] text-center">{formData.adults}</span>
                <button
                  type="button"
                  className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  onClick={() => updateCount('adults', true)}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            {ticket.price_child && ticket.price_child > 0 && (
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg w-full min-w-0">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-sm sm:text-base text-gray-900">Children</div>
                  <div className="text-xs sm:text-sm text-gray-600">{formatPrice(ticket.price_child)} each</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => updateCount('children', false)}
                    disabled={formData.children <= 0}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <span className="font-bold text-base sm:text-lg min-w-[2rem] text-center">{formData.children}</span>
                  <button
                    type="button"
                    className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => updateCount('children', true)}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Infants */}
            {ticket.price_infant && ticket.price_infant > 0 && (
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg w-full min-w-0">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-sm sm:text-base text-gray-900">Infants</div>
                  <div className="text-xs sm:text-sm text-gray-600">{formatPrice(ticket.price_infant)} each</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => updateCount('infants', false)}
                    disabled={formData.infants <= 0}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <span className="font-bold text-base sm:text-lg min-w-[2rem] text-center">{formData.infants}</span>
                  <button
                    type="button"
                    className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={() => updateCount('infants', true)}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full min-w-0">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {/* Email */}
            <div className="w-full min-w-0">
              <Label className="flex items-center gap-2 font-medium mb-2 text-sm sm:text-base">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                Email Address *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className={`w-full min-h-[48px] text-sm sm:text-base px-3 sm:px-4 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="w-full min-w-0">
              <Label className="flex items-center gap-2 font-medium mb-2 text-sm sm:text-base">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                Mobile Number *
              </Label>
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Enter mobile number"
                className={`w-full min-h-[48px] text-sm sm:text-base px-3 sm:px-4 ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="w-full min-w-0">
          <Button
            onClick={handleBookNow}
            className="w-full min-h-[48px] sm:min-h-[56px] text-sm sm:text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTicketBooking;
