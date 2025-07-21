
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
    <div className="w-full max-w-none overflow-hidden">
      {/* Mobile-First Responsive Styles */}
      <style>{`
        .mobile-responsive-form {
          width: 100% !important;
          max-width: none !important;
          overflow-x: hidden !important;
        }
        
        .form-section {
          width: 100% !important;
          margin-bottom: 1.5rem !important;
        }
        
        .form-input {
          width: 100% !important;
          min-height: 48px !important;
          font-size: 16px !important;
          padding: 12px 16px !important;
          border-radius: 8px !important;
          border: 1px solid #d1d5db !important;
          box-sizing: border-box !important;
        }
        
        .counter-container {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 16px !important;
          background: #f9fafb !important;
          border-radius: 8px !important;
          margin-bottom: 12px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .counter-controls {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          flex-shrink: 0 !important;
        }
        
        .counter-btn {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 2px solid #e5e7eb !important;
          background: white !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
        }
        
        .counter-btn:hover:not(:disabled) {
          border-color: #3b82f6 !important;
          background: #eff6ff !important;
        }
        
        .counter-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        
        .counter-value {
          font-weight: bold !important;
          font-size: 18px !important;
          min-width: 2rem !important;
          text-align: center !important;
          flex-shrink: 0 !important;
        }
        
        .price-info {
          flex: 1 !important;
          min-width: 0 !important;
        }
        
        .price-title {
          font-weight: 500 !important;
          color: #111827 !important;
          font-size: 16px !important;
          margin-bottom: 4px !important;
        }
        
        .price-amount {
          color: #6b7280 !important;
          font-size: 14px !important;
        }
        
        @media (max-width: 640px) {
          .form-input {
            font-size: 16px !important;
          }
          
          .counter-controls {
            gap: 12px !important;
          }
          
          .counter-btn {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
          }
        }
      `}</style>

      <div className="mobile-responsive-form space-y-6">
        {/* Total Price Display */}
        <div className="form-section">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 break-words">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-gray-600 text-sm">
              Total for {formData.adults + formData.children + formData.infants} people
            </div>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="form-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <Label className="flex items-center gap-2 font-medium mb-2">
                <Calendar className="h-4 w-4" />
                Select Date *
              </Label>
              <Input
                type="date"
                value={formData.selectedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.selectedDate ? 'border-red-500' : ''}`}
              />
              {errors.selectedDate && <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>}
            </div>

            {/* Time */}
            <div>
              <Label className="flex items-center gap-2 font-medium mb-2">
                <Clock className="h-4 w-4" />
                Select Time *
              </Label>
              <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
                <SelectTrigger className={`form-input ${errors.selectedTime ? 'border-red-500' : ''}`}>
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
        <div className="form-section">
          <Label className="flex items-center gap-2 font-medium mb-2">
            <User className="h-4 w-4" />
            Lead Guest Full Name *
          </Label>
          <Input
            value={formData.leadGuestName}
            onChange={(e) => setFormData(prev => ({ ...prev, leadGuestName: e.target.value }))}
            placeholder="Enter full name"
            className={`form-input ${errors.leadGuestName ? 'border-red-500' : ''}`}
          />
          {errors.leadGuestName && <p className="text-red-500 text-sm mt-1">{errors.leadGuestName}</p>}
        </div>

        {/* Number of People */}
        <div className="form-section">
          <Label className="flex items-center gap-2 font-medium mb-4">
            <Users className="h-4 w-4" />
            Number of People
          </Label>
          
          {/* Adults */}
          <div className="counter-container">
            <div className="price-info">
              <div className="price-title">Adults</div>
              <div className="price-amount">{formatPrice(ticket.price_adult)} each</div>
            </div>
            <div className="counter-controls">
              <button
                type="button"
                className="counter-btn"
                onClick={() => updateCount('adults', false)}
                disabled={formData.adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="counter-value">{formData.adults}</span>
              <button
                type="button"
                className="counter-btn"
                onClick={() => updateCount('adults', true)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          {ticket.price_child && ticket.price_child > 0 && (
            <div className="counter-container">
              <div className="price-info">
                <div className="price-title">Children</div>
                <div className="price-amount">{formatPrice(ticket.price_child)} each</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => updateCount('children', false)}
                  disabled={formData.children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="counter-value">{formData.children}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => updateCount('children', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Infants */}
          {ticket.price_infant && ticket.price_infant > 0 && (
            <div className="counter-container">
              <div className="price-info">
                <div className="price-title">Infants</div>
                <div className="price-amount">{formatPrice(ticket.price_infant)} each</div>
              </div>
              <div className="counter-controls">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => updateCount('infants', false)}
                  disabled={formData.infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="counter-value">{formData.infants}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => updateCount('infants', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <Label className="flex items-center gap-2 font-medium mb-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <Label className="flex items-center gap-2 font-medium mb-2">
                <Phone className="h-4 w-4" />
                Mobile Number *
              </Label>
              <Input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Enter mobile number"
                className={`form-input ${errors.mobile ? 'border-red-500' : ''}`}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="form-section">
          <Button
            onClick={handleBookNow}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Book Now - {formatPrice(totalPrice)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleTicketBooking;
