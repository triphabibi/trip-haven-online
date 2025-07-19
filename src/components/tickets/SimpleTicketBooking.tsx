import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Users, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    <>
      <Card className="shadow-xl border-0 mobile-full-width">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardTitle className="text-xl text-center">Book Tickets</CardTitle>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatPrice(totalPrice)}</div>
            <div className="text-white/80">Total for {formData.adults + formData.children + formData.infants} people</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6 space-y-4 mobile-padding">
          {/* Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Calendar className="h-4 w-4" />
              Select Date *
            </Label>
            <Input
              type="date"
              value={formData.selectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`mobile-input ${errors.selectedDate ? 'border-red-500' : ''}`}
            />
            {errors.selectedDate && <p className="text-red-500 text-sm">{errors.selectedDate}</p>}
          </div>

          {/* Lead Guest Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <User className="h-4 w-4" />
              Lead Guest Full Name *
            </Label>
            <Input
              value={formData.leadGuestName}
              onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
              placeholder="Enter full name"
              className={`mobile-input ${errors.leadGuestName ? 'border-red-500' : ''}`}
            />
            {errors.leadGuestName && <p className="text-red-500 text-sm">{errors.leadGuestName}</p>}
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" />
              Select Time *
            </Label>
            <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
              <SelectTrigger className={`mobile-input ${errors.selectedTime ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedTime && <p className="text-red-500 text-sm">{errors.selectedTime}</p>}
          </div>

          {/* Number of People */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Number of People
            </Label>
            
            {/* Adults */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 mobile-counter">
              <div className="flex-1">
                <div className="font-medium">Adults</div>
                <div className="text-sm text-gray-600">{formatPrice(ticket.price_adult)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', false)}
                  disabled={formData.adults <= 1}
                  className="mobile-counter-btn"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.adults}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('adults', true)}
                  className="mobile-counter-btn"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 mobile-counter">
              <div className="flex-1">
                <div className="font-medium">Children</div>
                <div className="text-sm text-gray-600">{formatPrice(ticket.price_child || 0)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', false)}
                  disabled={formData.children <= 0}
                  className="mobile-counter-btn"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.children}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('children', true)}
                  className="mobile-counter-btn"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 mobile-counter">
              <div className="flex-1">
                <div className="font-medium">Infants</div>
                <div className="text-sm text-gray-600">{formatPrice(ticket.price_infant || 0)} each</div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', false)}
                  disabled={formData.infants <= 0}
                  className="mobile-counter-btn"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{formData.infants}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateCount('infants', true)}
                  className="mobile-counter-btn"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className={`mobile-input ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-medium">
              <Phone className="h-4 w-4" />
              Mobile Number *
            </Label>
            <Input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="Enter mobile number"
              className={`mobile-input ${errors.mobile ? 'border-red-500' : ''}`}
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          {/* Book Now Button */}
          <Button
            onClick={handleBookNow}
            className="w-full mobile-button bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
      </Card>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-full-width {
            width: 100% !important;
            margin: 0 !important;
          }
          
          .mobile-padding {
            padding: 1rem !important;
          }
          
          .mobile-input {
            height: 48px !important;
            font-size: 16px !important;
          }
          
          .mobile-button {
            height: 52px !important;
            font-size: 18px !important;
            border-radius: 12px !important;
          }
          
          .mobile-counter {
            padding: 16px !important;
            border-radius: 12px !important;
          }
          
          .mobile-counter-btn {
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
          }
        }
      `}</style>
    </>
  );
};

export default SimpleTicketBooking;