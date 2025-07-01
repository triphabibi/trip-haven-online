import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, Clock, MapPin, CreditCard, Shield, CheckCircle } from 'lucide-react';

interface BookingFlowProps {
  service: {
    id: string;
    title: string;
    price_adult: number;
    price_child: number;
    price_infant: number;
    duration?: string;
    available_times?: string[];
    languages?: string[];
  };
  serviceType: 'tour' | 'ticket' | 'visa' | 'package';
}

const generateBookingReference = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${timestamp.slice(-8)}${random}`;
};

const EnhancedBookingFlow = ({ service, serviceType }: BookingFlowProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState({
    adults_count: 1,
    children_count: 0,
    infants_count: 0,
    travel_date: '',
    selected_time: '',
    selected_language: 'English',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pickup_location: '',
    special_requests: '',
    payment_method: 'razorpay'
  });

  const calculateTotal = () => {
    const adultTotal = bookingData.adults_count * service.price_adult;
    const childTotal = bookingData.children_count * service.price_child;
    const infantTotal = bookingData.infants_count * service.price_infant;
    return adultTotal + childTotal + infantTotal;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      const totalAmount = calculateTotal();
      const bookingReference = generateBookingReference();
      
      const { data: booking, error } = await supabase
        .from('new_bookings')
        .insert({
          booking_reference: bookingReference,
          service_id: service.id,
          booking_type: serviceType,
          customer_name: bookingData.customer_name,
          customer_email: bookingData.customer_email,
          customer_phone: bookingData.customer_phone,
          adults_count: bookingData.adults_count,
          children_count: bookingData.children_count,
          infants_count: bookingData.infants_count,
          travel_date: bookingData.travel_date || null,
          selected_time: bookingData.selected_time || null,
          selected_language: bookingData.selected_language,
          pickup_location: bookingData.pickup_location || null,
          special_requests: bookingData.special_requests || null,
          total_amount: totalAmount,
          final_amount: totalAmount,
          discount_amount: 0,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: `Your booking reference is ${bookingReference}. We'll contact you shortly to confirm.`,
      });

      setStep(4);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="adults">Adults (12+ years)</Label>
          <Select value={bookingData.adults_count.toString()} onValueChange={(value) => handleInputChange('adults_count', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="children">Children (2-11 years)</Label>
          <Select value={bookingData.children_count.toString()} onValueChange={(value) => handleInputChange('children_count', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0,1,2,3,4,5,6].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="infants">Infants (0-2 years)</Label>
          <Select value={bookingData.infants_count.toString()} onValueChange={(value) => handleInputChange('infants_count', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0,1,2,3,4].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Only show date/time/pickup for tours and packages */}
      {(serviceType === 'tour' || serviceType === 'package') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="travel_date">Travel Date</Label>
            <Input
              id="travel_date"
              type="date"
              value={bookingData.travel_date}
              onChange={(e) => handleInputChange('travel_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {service.available_times && service.available_times.length > 0 && (
            <div>
              <Label htmlFor="selected_time">Preferred Time</Label>
              <Select value={bookingData.selected_time} onValueChange={(value) => handleInputChange('selected_time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {service.available_times.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Only show visit date for tickets */}
      {serviceType === 'ticket' && (
        <div>
          <Label htmlFor="travel_date">Visit Date</Label>
          <Input
            id="travel_date"
            type="date"
            value={bookingData.travel_date}
            onChange={(e) => handleInputChange('travel_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}

      {/* Language selection for tours only */}
      {serviceType === 'tour' && service.languages && service.languages.length > 1 && (
        <div>
          <Label htmlFor="language">Preferred Language</Label>
          <Select value={bookingData.selected_language} onValueChange={(value) => handleInputChange('selected_language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {service.languages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer_name">Full Name *</Label>
          <Input
            id="customer_name"
            value={bookingData.customer_name}
            onChange={(e) => handleInputChange('customer_name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="customer_email">Email Address *</Label>
          <Input
            id="customer_email"
            type="email"
            value={bookingData.customer_email}
            onChange={(e) => handleInputChange('customer_email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer_phone">Phone Number *</Label>
          <Input
            id="customer_phone"
            type="tel"
            value={bookingData.customer_phone}
            onChange={(e) => handleInputChange('customer_phone', e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        {/* Only show pickup location for tours */}
        {serviceType === 'tour' && (
          <div>
            <Label htmlFor="pickup_location">Pickup Location</Label>
            <Input
              id="pickup_location"
              value={bookingData.pickup_location}
              onChange={(e) => handleInputChange('pickup_location', e.target.value)}
              placeholder="Hotel name or address"
            />
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          value={bookingData.special_requests}
          onChange={(e) => handleInputChange('special_requests', e.target.value)}
          placeholder="Any special requirements or requests..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="font-medium">{service.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Adults ({bookingData.adults_count}):</span>
            <span>₹{bookingData.adults_count * service.price_adult}</span>
          </div>
          {bookingData.children_count > 0 && (
            <div className="flex justify-between">
              <span>Children ({bookingData.children_count}):</span>
              <span>₹{bookingData.children_count * service.price_child}</span>
            </div>
          )}
          {bookingData.infants_count > 0 && (
            <div className="flex justify-between">
              <span>Infants ({bookingData.infants_count}):</span>
              <span>₹{bookingData.infants_count * service.price_infant}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="payment_method">Payment Method</Label>
        <Select value={bookingData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="razorpay">Razorpay (Cards, UPI, Net Banking)</SelectItem>
            <SelectItem value="payu">PayU Money</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-2xl font-semibold text-green-600">Booking Confirmed!</h3>
      <p className="text-gray-600">
        Thank you for your booking. We'll send you a confirmation email shortly.
      </p>
      <Button onClick={() => window.location.href = '/'}>
        Return to Home
      </Button>
    </div>
  );

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) {
      return bookingData.customer_name && bookingData.customer_email && bookingData.customer_phone;
    }
    if (step === 3) return true;
    return false;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Experience</span>
          <Badge variant="secondary">Step {step} of 3</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        
        {step < 4 && (
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitBooking}
                  disabled={loading || !canProceed()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Processing...' : `Confirm Booking - ₹${calculateTotal()}`}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedBookingFlow;
