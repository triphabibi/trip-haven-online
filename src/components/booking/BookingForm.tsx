
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, MapPin, Clock, Globe } from 'lucide-react';
import type { Tour } from '@/types/tourism';

interface BookingFormProps {
  tour: Tour;
  onCancel: () => void;
}

const BookingForm = ({ tour, onCancel }: BookingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickupLocation: '',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    travelDate: '',
    selectedTime: '',
    selectedLanguage: 'English',
    specialRequests: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code you entered is not valid or has expired.",
          variant: "destructive",
        });
        return;
      }

      // Check if promo code is still valid
      const now = new Date();
      const validFrom = new Date(data.valid_from);
      const validUntil = data.valid_until ? new Date(data.valid_until) : null;

      if (now < validFrom || (validUntil && now > validUntil)) {
        toast({
          title: "Promo Code Expired",
          description: "This promo code is no longer valid.",
          variant: "destructive",
        });
        return;
      }

      // Check usage limits
      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast({
          title: "Promo Code Limit Reached",
          description: "This promo code has reached its usage limit.",
          variant: "destructive",
        });
        return;
      }

      setPromoDiscount(data.discount_value);
      setPromoApplied(true);
      toast({
        title: "Promo Code Applied!",
        description: `You saved ${data.discount_type === 'percentage' ? data.discount_value + '%' : '₹' + data.discount_value}!`,
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Error",
        description: "Failed to apply promo code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    const adultTotal = (tour.price_adult || 0) * formData.adultsCount;
    const childTotal = (tour.price_child || 0) * formData.childrenCount;
    const infantTotal = (tour.price_infant || 0) * formData.infantsCount;
    const subtotal = adultTotal + childTotal + infantTotal;
    
    let discountAmount = 0;
    if (promoApplied && promoDiscount > 0) {
      // Assuming percentage discount for now
      discountAmount = (subtotal * promoDiscount) / 100;
    }
    
    return {
      subtotal,
      discountAmount,
      total: subtotal - discountAmount
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { subtotal, discountAmount, total } = calculateTotal();

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          service_type: 'tour',
          service_id: tour.id,
          service_title: tour.title,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail || null,
          customer_phone: formData.customerPhone || null,
          pickup_location: formData.pickupLocation || null,
          adults_count: formData.adultsCount,
          children_count: formData.childrenCount,
          infants_count: formData.infantsCount,
          travel_date: formData.travelDate || null,
          travel_time: formData.selectedTime || null,
          selected_language: formData.selectedLanguage,
          base_amount: subtotal,
          discount_amount: discountAmount,
          total_amount: total,
          special_requests: formData.specialRequests || null,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Booking Created!",
        description: `Your booking has been created. Reference: ${booking.booking_reference}`,
      });

      // Navigate to booking confirmation page
      navigate(`/booking-confirmation/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discountAmount, total } = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Details */}
      <div>
        <Label htmlFor="customerName">Full Name *</Label>
        <Input
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone</Label>
          <Input
            id="customerPhone"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Travel Details */}
      <div>
        <Label htmlFor="travelDate">Travel Date</Label>
        <Input
          id="travelDate"
          type="date"
          value={formData.travelDate}
          onChange={(e) => handleInputChange('travelDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {tour.available_times && tour.available_times.length > 0 && (
        <div>
          <Label>Preferred Time</Label>
          <Select value={formData.selectedTime} onValueChange={(value) => handleInputChange('selectedTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {tour.available_times.map((time) => (
                <SelectItem key={time} value={time}>
                  <Clock className="h-4 w-4 mr-2 inline" />
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {tour.languages && tour.languages.length > 1 && (
        <div>
          <Label>Language</Label>
          <Select value={formData.selectedLanguage} onValueChange={(value) => handleInputChange('selectedLanguage', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tour.languages.map((language) => (
                <SelectItem key={language} value={language}>
                  <Globe className="h-4 w-4 mr-2 inline" />
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="pickupLocation">Pickup Location</Label>
        <Input
          id="pickupLocation"
          value={formData.pickupLocation}
          onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
          placeholder="Enter pickup address"
        />
      </div>

      {/* Group Size */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Adults</Label>
          <Select 
            value={formData.adultsCount.toString()} 
            onValueChange={(value) => handleInputChange('adultsCount', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Children</Label>
          <Select 
            value={formData.childrenCount.toString()} 
            onValueChange={(value) => handleInputChange('childrenCount', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Infants</Label>
          <Select 
            value={formData.infantsCount.toString()} 
            onValueChange={(value) => handleInputChange('infantsCount', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          placeholder="Any special requirements or requests..."
          rows={3}
        />
      </div>

      {/* Promo Code */}
      <div>
        <Label htmlFor="promoCode">Promo Code</Label>
        <div className="flex gap-2">
          <Input
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            disabled={promoApplied}
          />
          <Button 
            type="button" 
            onClick={applyPromoCode} 
            variant="outline"
            disabled={promoApplied || !promoCode.trim()}
          >
            {promoApplied ? 'Applied' : 'Apply'}
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-600 mt-1">
            Promo code applied! {promoDiscount}% discount
          </p>
        )}
      </div>

      {/* Price Summary */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Adults ({formData.adultsCount})</span>
              <span>₹{((tour.price_adult || 0) * formData.adultsCount).toLocaleString()}</span>
            </div>
            {formData.childrenCount > 0 && (
              <div className="flex justify-between">
                <span>Children ({formData.childrenCount})</span>
                <span>₹{((tour.price_child || 0) * formData.childrenCount).toLocaleString()}</span>
              </div>
            )}
            {formData.infantsCount > 0 && (
              <div className="flex justify-between">
                <span>Infants ({formData.infantsCount})</span>
                <span>₹{((tour.price_infant || 0) * formData.infantsCount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
