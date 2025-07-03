import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, Users, CreditCard, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedTourBookingProps {
  tour: {
    id: string;
    title: string;
    price_adult: number;
    price_child: number;
    price_infant: number;
    available_times?: string[];
    duration?: string;
  };
}

const EnhancedTourBooking = ({ tour }: EnhancedTourBookingProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Traveler details
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    adults_count: 1,
    children_count: 0,
    infants_count: 0,
    
    // Tour specific - Point 4 & 5
    travel_date: '',
    selected_time: '',
    pickup_location: '',
    
    // Additional
    special_requests: ''
  });

  const pickupLocations = [
    'Bur Dubai',
    'Deira',
    'Marina',
    'Jumeirah',
    'Downtown Dubai',
    'Dubai Mall',
    'Mall of Emirates',
    'Sharjah',
    'Ajman',
    'Custom Location (specify in comments)'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const adults = Number(formData.adults_count) * (tour.price_adult || 0);
    const children = Number(formData.children_count) * (tour.price_child || 0);
    const infants = Number(formData.infants_count) * (tour.price_infant || 0);
    return adults + children + infants;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const totalAmount = calculateTotal();
      const bookingReference = `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;

      const { error } = await supabase
        .from('new_bookings')
        .insert({
          booking_reference: bookingReference,
          service_id: tour.id,
          booking_type: 'tour',
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          adults_count: formData.adults_count,
          children_count: formData.children_count,
          infants_count: formData.infants_count,
          total_amount: totalAmount,
          final_amount: totalAmount,
          travel_date: formData.travel_date,
          selected_time: formData.selected_time,
          pickup_location: formData.pickup_location,
          special_requests: formData.special_requests,
          booking_status: 'pending',
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "🎉 Booking Submitted!",
        description: `Reference: ${bookingReference}. We'll contact you shortly!`,
      });

      setStep(4); // Success step
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
    <div className="space-y-6" data-booking-form>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          📅 Select Your Travel Details
        </h3>
        <p className="text-blue-700 text-sm">{tour.title} - {tour.duration}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="travel_date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            📅 Travel Date *
          </Label>
          <Input
            id="travel_date"
            type="date"
            value={formData.travel_date}
            onChange={(e) => handleInputChange('travel_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="selected_time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            🕐 Preferred Time *
          </Label>
          <Select value={formData.selected_time} onValueChange={(value) => handleInputChange('selected_time', value)}>
            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {(tour.available_times || ['09:00 AM', '02:00 PM', '06:00 PM']).map((time) => (
                <SelectItem key={time} value={time} className="hover:bg-gray-50">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="pickup_location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          📍 Pickup Location *
        </Label>
        <Select value={formData.pickup_location} onValueChange={(value) => handleInputChange('pickup_location', value)}>
          <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
            <SelectValue placeholder="Select pickup location" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-64 overflow-y-auto">
            {pickupLocations.map((location) => (
              <SelectItem key={location} value={location} className="hover:bg-gray-50">
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          👥 Number of Travelers
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-amber-700">Adults (12+)</Label>
            <Input
              type="number"
              min="1"
              value={formData.adults_count}
              onChange={(e) => handleInputChange('adults_count', parseInt(e.target.value) || 1)}
              className="bg-white border-amber-300 focus:border-amber-500"
            />
            <p className="text-xs text-amber-600 mt-1">₹{tour.price_adult?.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-amber-700">Children (2-11)</Label>
            <Input
              type="number"
              min="0"
              value={formData.children_count}
              onChange={(e) => handleInputChange('children_count', parseInt(e.target.value) || 0)}
              className="bg-white border-amber-300 focus:border-amber-500"
            />
            <p className="text-xs text-amber-600 mt-1">₹{tour.price_child?.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-amber-700">Infants (0-1)</Label>
            <Input
              type="number"
              min="0"
              value={formData.infants_count}
              onChange={(e) => handleInputChange('infants_count', parseInt(e.target.value) || 0)}
              className="bg-white border-amber-300 focus:border-amber-500"
            />
            <p className="text-xs text-amber-600 mt-1">₹{tour.price_infant?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h3 className="font-semibold text-green-900 mb-2">
          📝 Contact Information
        </h3>
        <p className="text-green-700 text-sm">We'll use this to confirm your booking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer_name">👤 Full Name *</Label>
          <Input
            id="customer_name"
            value={formData.customer_name}
            onChange={(e) => handleInputChange('customer_name', e.target.value)}
            placeholder="Enter your full name"
            className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-200"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="customer_phone">📞 Phone Number *</Label>
          <Input
            id="customer_phone"
            type="tel"
            value={formData.customer_phone}
            onChange={(e) => handleInputChange('customer_phone', e.target.value)}
            placeholder="+971 50 123 4567"
            className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-200"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="customer_email">📧 Email Address *</Label>
        <Input
          id="customer_email"
          type="email"
          value={formData.customer_email}
          onChange={(e) => handleInputChange('customer_email', e.target.value)}
          placeholder="your@email.com"
          className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-200"
          required
        />
      </div>

      <div>
        <Label htmlFor="special_requests">💬 Special Requests</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => handleInputChange('special_requests', e.target.value)}
          placeholder="Any special requirements, dietary restrictions, etc..."
          rows={3}
          className="bg-white border-gray-300 focus:border-green-500 focus:ring-green-200"
        />
      </div>
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();
    return (
      <div className="space-y-6">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <h3 className="font-semibold text-purple-900 mb-4">
            📋 Booking Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Tour:</span>
              <span className="font-medium">{tour.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formData.travel_date}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{formData.selected_time}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup:</span>
              <span>{formData.pickup_location}</span>
            </div>
            <div className="flex justify-between">
              <span>Travelers:</span>
              <span>
                {formData.adults_count} Adults
                {formData.children_count > 0 && `, ${formData.children_count} Children`}
                {formData.infants_count > 0 && `, ${formData.infants_count} Infants`}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-purple-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>🔒 Secure booking with instant confirmation</span>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
      <h3 className="text-2xl font-semibold text-green-600">🎉 Booking Confirmed!</h3>
      <p className="text-gray-600">
        Thank you for booking with us! You'll receive a confirmation email shortly.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg text-left">
        <h4 className="font-medium text-blue-800 mb-2">What's Next:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Confirmation email with voucher</li>
          <li>• Pickup details via WhatsApp</li>
          <li>• 24/7 support for any queries</li>
        </ul>
      </div>
      <Button onClick={() => window.location.href = '/'} className="bg-green-600 hover:bg-green-700">
        🏠 Return to Home
      </Button>
    </div>
  );

  const canProceed = () => {
    if (step === 1) {
      return formData.travel_date && formData.selected_time && formData.pickup_location;
    }
    if (step === 2) {
      return formData.customer_name && formData.customer_email && formData.customer_phone;
    }
    return true;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Your Tour
          </span>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= step ? 'bg-white' : 'bg-white/30'
                } transition-colors duration-300`}
              />
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderSuccess()}
        
        {step < 4 && (
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                ← Previous
              </Button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next →
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {loading ? '⏳ Processing...' : `💳 Book Now - ₹${calculateTotal().toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTourBooking;