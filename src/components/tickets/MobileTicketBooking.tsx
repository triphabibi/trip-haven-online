
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Users, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

interface MobileTicketBookingProps {
  ticket: {
    id: string;
    title: string;
    price_adult: number;
    price_child?: number;
    price_infant?: number;
  };
}

const MobileTicketBooking = ({ ticket }: MobileTicketBookingProps) => {
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
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-4">
        <h2 className="text-lg font-bold text-white text-center">Book Your Tickets</h2>
        <div className="text-center mt-2">
          <div className="text-2xl font-bold text-white">{formatPrice(totalPrice)}</div>
          <div className="text-orange-100 text-sm">Total for {formData.adults + formData.children + formData.infants} people</div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Date *</Label>
            <Input
              type="date"
              value={formData.selectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full ${errors.selectedDate ? 'border-red-500' : ''}`}
            />
            {errors.selectedDate && <p className="text-red-500 text-xs mt-1">{errors.selectedDate}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Time *</Label>
            <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
              <SelectTrigger className={`w-full ${errors.selectedTime ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedTime && <p className="text-red-500 text-xs mt-1">{errors.selectedTime}</p>}
          </div>
        </div>

        {/* Lead Guest Name */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Lead Guest Name *</Label>
          <Input
            value={formData.leadGuestName}
            onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
            placeholder="Enter full name"
            className={`w-full ${errors.leadGuestName ? 'border-red-500' : ''}`}
          />
          {errors.leadGuestName && <p className="text-red-500 text-xs mt-1">{errors.leadGuestName}</p>}
        </div>

        {/* Number of People */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Number of People</Label>
          
          <div className="space-y-3">
            {/* Adults */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Adults</div>
                <div className="text-xs text-gray-600">{formatPrice(ticket.price_adult)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 disabled:opacity-50"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg min-w-[2rem] text-center">{formData.adults}</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500"
                  onClick={() => updateCount('adults', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            {ticket.price_child && ticket.price_child > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Children</div>
                  <div className="text-xs text-gray-600">{formatPrice(ticket.price_child)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 disabled:opacity-50"
                    onClick={() => updateCount('children', false)}
                    disabled={formData.children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg min-w-[2rem] text-center">{formData.children}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500"
                    onClick={() => updateCount('children', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Infants */}
            {ticket.price_infant && ticket.price_infant > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">Infants</div>
                  <div className="text-xs text-gray-600">{formatPrice(ticket.price_infant)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500 disabled:opacity-50"
                    onClick={() => updateCount('infants', false)}
                    disabled={formData.infants <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg min-w-[2rem] text-center">{formData.infants}</span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-blue-500"
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
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Mobile *</Label>
            <Input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="Enter mobile"
              className={`w-full ${errors.mobile ? 'border-red-500' : ''}`}
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBookNow}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          Book Now - {formatPrice(totalPrice)}
        </Button>
      </div>
    </div>
  );
};

export default MobileTicketBooking;
