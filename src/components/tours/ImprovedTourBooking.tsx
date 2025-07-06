
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Clock, Users, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImprovedTourBookingProps {
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

interface GuestInfo {
  name: string;
  age: number;
  type: 'adult' | 'child' | 'infant';
}

const ImprovedTourBooking = ({ tour }: ImprovedTourBookingProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Traveler details
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    adults_count: 1,
    children_count: 0,
    infants_count: 0,
    
    // Guest details
    guests: [] as GuestInfo[],
    
    // Tour specific
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

  // Update guests array when counts change
  const updateGuestsArray = () => {
    const totalGuests = formData.adults_count + formData.children_count + formData.infants_count;
    const newGuests: GuestInfo[] = [];
    
    // Add adults
    for (let i = 0; i < formData.adults_count; i++) {
      newGuests.push({
        name: formData.guests[i]?.name || '',
        age: formData.guests[i]?.age || 18,
        type: 'adult'
      });
    }
    
    // Add children
    for (let i = 0; i < formData.children_count; i++) {
      const guestIndex = formData.adults_count + i;
      newGuests.push({
        name: formData.guests[guestIndex]?.name || '',
        age: formData.guests[guestIndex]?.age || 8,
        type: 'child'
      });
    }
    
    // Add infants
    for (let i = 0; i < formData.infants_count; i++) {
      const guestIndex = formData.adults_count + formData.children_count + i;
      newGuests.push({
        name: formData.guests[guestIndex]?.name || '',
        age: formData.guests[guestIndex]?.age || 1,
        type: 'infant'
      });
    }
    
    setFormData(prev => ({ ...prev, guests: newGuests }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCountChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(updateGuestsArray, 0); // Update guests on next tick
  };

  const updateGuestInfo = (index: number, field: keyof GuestInfo, value: string | number) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setFormData(prev => ({ ...prev, guests: updatedGuests }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.travel_date) newErrors.travel_date = 'Travel date is required';
      if (!formData.selected_time) newErrors.selected_time = 'Time selection is required';
      if (!formData.pickup_location) newErrors.pickup_location = 'Pickup location is required';
      if (formData.adults_count < 1) newErrors.adults_count = 'At least 1 adult is required';
    }

    if (stepNumber === 2) {
      if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
      if (!formData.customer_email.trim()) newErrors.customer_email = 'Email is required';
      if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Phone number is required';
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.customer_email && !emailRegex.test(formData.customer_email)) {
        newErrors.customer_email = 'Please enter a valid email address';
      }
      
      // Guest names validation
      formData.guests.forEach((guest, index) => {
        if (!guest.name.trim()) {
          newErrors[`guest_${index}`] = `Guest ${index + 1} name is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    const adults = Number(formData.adults_count) * (tour.price_adult || 0);
    const children = Number(formData.children_count) * (tour.price_child || 0);
    const infants = Number(formData.infants_count) * (tour.price_infant || 0);
    return adults + children + infants;
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    try {
      const totalAmount = calculateTotal();

      const { error } = await supabase
        .from('new_bookings')
        .insert({
          service_id: tour.id,
          service_type: 'tour',
          service_title: tour.title,
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
          special_requests: `${formData.special_requests}\n\nGuest Details:\n${formData.guests.map((g, i) => `${i+1}. ${g.name} (${g.type}, age: ${g.age})`).join('\n')}`,
          booking_status: 'pending',
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "🎉 Booking Submitted!",
        description: `Your booking has been submitted successfully!`,
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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl border border-blue-100">
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
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 ${errors.travel_date ? 'border-red-500' : ''}`}
            required
          />
          {errors.travel_date && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.travel_date}</p>}
        </div>
        
        <div>
          <Label htmlFor="selected_time" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            🕐 Preferred Time *
          </Label>
          <Select value={formData.selected_time} onValueChange={(value) => handleInputChange('selected_time', value)}>
            <SelectTrigger className={`bg-white border-gray-300 focus:border-blue-500 ${errors.selected_time ? 'border-red-500' : ''}`}>
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
          {errors.selected_time && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.selected_time}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="pickup_location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          📍 Pickup Location *
        </Label>
        <Select value={formData.pickup_location} onValueChange={(value) => handleInputChange('pickup_location', value)}>
          <SelectTrigger className={`bg-white border-gray-300 focus:border-blue-500 ${errors.pickup_location ? 'border-red-500' : ''}`}>
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
        {errors.pickup_location && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.pickup_location}</p>}
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          👥 Number of Travelers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-amber-700">Adults (12+)</Label>
            <Input
              type="number"
              min="1"
              value={formData.adults_count}
              onChange={(e) => handleCountChange('adults_count', parseInt(e.target.value) || 1)}
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
              onChange={(e) => handleCountChange('children_count', parseInt(e.target.value) || 0)}
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
              onChange={(e) => handleCountChange('infants_count', parseInt(e.target.value) || 0)}
              className="bg-white border-amber-300 focus:border-amber-500"
            />
            <p className="text-xs text-amber-600 mt-1">₹{tour.price_infant?.toLocaleString()}</p>
          </div>
        </div>
        {errors.adults_count && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.adults_count}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 md:p-6 rounded-xl border border-green-100">
        <h3 className="font-semibold text-green-900 mb-2">
          📝 Contact & Guest Information
        </h3>
        <p className="text-green-700 text-sm">Provide contact details and guest names</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_name">👤 Full Name *</Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="Enter your full name"
              className={`bg-white border-gray-300 focus:border-green-500 focus:ring-green-200 ${errors.customer_name ? 'border-red-500' : ''}`}
              required
            />
            {errors.customer_name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.customer_name}</p>}
          </div>
          
          <div>
            <Label htmlFor="customer_phone">📞 Phone Number *</Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              placeholder="+971 50 123 4567"
              className={`bg-white border-gray-300 focus:border-green-500 focus:ring-green-200 ${errors.customer_phone ? 'border-red-500' : ''}`}
              required
            />
            {errors.customer_phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.customer_phone}</p>}
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
            className={`bg-white border-gray-300 focus:border-green-500 focus:ring-green-200 ${errors.customer_email ? 'border-red-500' : ''}`}
            required
          />
          {errors.customer_email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.customer_email}</p>}
        </div>
      </div>

      {/* Guest Details */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Guest Details</h4>
        <div className="space-y-3">
          {formData.guests.map((guest, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor={`guest_${index}_name`}>
                    Guest {index + 1} Name ({guest.type}) *
                  </Label>
                  <Input
                    id={`guest_${index}_name`}
                    value={guest.name}
                    onChange={(e) => updateGuestInfo(index, 'name', e.target.value)}
                    placeholder={`Enter guest ${index + 1} name`}
                    className={`bg-white ${errors[`guest_${index}`] ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors[`guest_${index}`] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors[`guest_${index}`]}</p>}
                </div>
                <div>
                  <Label htmlFor={`guest_${index}_age`}>Age</Label>
                  <Input
                    id={`guest_${index}_age`}
                    type="number"
                    min="0"
                    max="120"
                    value={guest.age}
                    onChange={(e) => updateGuestInfo(index, 'age', parseInt(e.target.value) || 0)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
        <div className="bg-purple-50 p-4 md:p-6 rounded-xl border border-purple-100">
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
            
            {/* Guest Names Summary */}
            <div className="border-t pt-3">
              <span className="font-medium">Guest Names:</span>
              <div className="mt-2 space-y-1">
                {formData.guests.map((guest, index) => (
                  <div key={index} className="text-xs text-gray-600 flex justify-between">
                    <span>{index + 1}. {guest.name}</span>
                    <span>({guest.type}, {guest.age} years)</span>
                  </div>
                ))}
              </div>
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
      return validateStep(1);
    }
    if (step === 2) {
      return validateStep(2);
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
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
      <CardContent className="p-4 md:p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderSuccess()}
        
        {step < 4 && (
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="w-full md:w-auto">
                ← Previous
              </Button>
            )}
            <div className="md:ml-auto">
              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                >
                  Next →
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 w-full md:w-auto"
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

export default ImprovedTourBooking;
