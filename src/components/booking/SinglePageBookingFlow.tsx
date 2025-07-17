
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ArrowLeft, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TabbedTourDetails from '@/components/tours/TabbedTourDetails';
import { PaymentGatewaySelector } from '@/components/checkout/PaymentGatewaySelector';
import { BankTransferSuccess } from '@/components/booking/BankTransferSuccess';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import LoadingOverlay from '@/components/common/LoadingOverlay';

interface Service {
  id: string;
  title: string;
  price_adult: number;
  price_child: number;
  price_infant: number;
  type: 'tour' | 'package' | 'visa' | 'ticket';
  overview?: string;
  highlights?: string[];
  whats_included?: string[];
  exclusions?: string[];
  itinerary?: any;
  duration?: string;
  location?: string;
  cancellation_policy?: string;
  terms_conditions?: string;
}

interface Props {
  service: Service;
  onBack: () => void;
}

const SinglePageBookingFlow = ({ service, onBack }: Props) => {
  const [step, setStep] = useState<'details' | 'payment' | 'bank_transfer'>('details');
  const [bookingId, setBookingId] = useState<string>('');
  const [bankTransferData, setBankTransferData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const [formData, setFormData] = useState({
    travelDate: undefined as Date | undefined,
    travelTime: '',
    pickupLocation: '',
    adults: 1,
    children: 0,
    infants: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const calculateTotal = () => {
    const adultTotal = formData.adults * service.price_adult;
    const childTotal = formData.children * service.price_child;
    const infantTotal = formData.infants * service.price_infant;
    return adultTotal + childTotal + infantTotal;
  };

  const adjustCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [type]: increment 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.travelDate) {
      newErrors.travelDate = 'Travel date is required';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email address is required';
    } else if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (service.type === 'tour' && !formData.travelTime) {
      newErrors.travelTime = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBooking = async () => {
    console.log('Creating booking with form data:', formData);
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setLoadingMessage('Creating your booking...');

    try {
      const totalAmount = calculateTotal();
      console.log('Total amount calculated:', totalAmount);

      const bookingData = {
        service_id: service.id,
        service_type: service.type,
        service_title: service.title,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        travel_date: formData.travelDate ? formData.travelDate.toISOString().split('T')[0] : null,
        travel_time: formData.travelTime,
        pickup_location: formData.pickupLocation,
        adults_count: formData.adults,
        children_count: formData.children,
        infants_count: formData.infants,
        base_amount: totalAmount,
        total_amount: totalAmount,
        final_amount: totalAmount,
        special_requests: formData.specialRequests,
        booking_status: 'pending',
        payment_status: 'pending'
      };

      console.log('Inserting booking data:', bookingData);

      const { data: bookingResult, error: bookingError } = await supabase
        .from('new_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', bookingResult);
      setBookingId(bookingResult.id);
      setStep('payment');

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error creating your booking.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful, booking confirmed', paymentData);
    
    // Handle bank transfer differently
    if (paymentData.requiresUpload) {
      // Store bank transfer data and show upload page
      setBankTransferData(paymentData);
      setStep('bank_transfer');
      return;
    }
    
    toast({
      title: "🎉 Booking Confirmed!",
      description: "Your booking has been confirmed successfully!",
      duration: 5000,
    });
    
    // Redirect to booking confirmation page instead of going back
    const confirmationUrl = `/booking-confirmation?booking=${bookingId}`;
    window.location.href = confirmationUrl;
  };

  const showTimeField = service.type === 'tour';
  const showPickupField = service.type === 'tour';

  // Bank Transfer Step
  if (step === 'bank_transfer') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => setStep('payment')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Payment
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Bank Transfer</h1>
              <p className="text-gray-600">Transfer payment and upload proof</p>
            </div>
          </div>

          <BankTransferSuccess
            bookingId={bookingId}
            bankDetails={bankTransferData?.bankDetails || ''}
            amount={bankTransferData?.amount || calculateTotal()}
            currency={bankTransferData?.currency || 'USD'}
            onUploadComplete={() => {
              const confirmationUrl = `/booking-confirmation?booking=${bookingId}`;
              window.location.href = confirmationUrl;
            }}
          />
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    console.log('Rendering payment step with booking ID:', bookingId);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => setStep('details')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-gray-600">Secure payment processing</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <PaymentGatewaySelector
              amount={calculateTotal()}
              bookingId={bookingId}
              customerName={formData.customerName}
              customerEmail={formData.customerEmail}
              customerPhone={formData.customerPhone}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={(error) => {
                toast({
                  title: "Payment Failed",
                  description: error,
                  variant: "destructive"
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay 
        isVisible={isProcessing} 
        type="booking" 
        message={loadingMessage}
      />
      
      {/* Clean Package-Style Booking Form */}
      <Card className="shadow-lg border-0 max-w-md mx-auto">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 md:p-6">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Book This {service.type === 'tour' ? 'Tour' : service.type === 'package' ? 'Package' : service.type === 'visa' ? 'Visa' : 'Service'}
          </CardTitle>
          {service.duration && (
            <div className="flex items-center justify-center gap-2 text-sm md:text-base">
              <span>{service.duration}</span>
              {service.location && (
                <>
                  <span>•</span>
                  <span>{service.location}</span>
                </>
              )}
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold">{formatPrice(calculateTotal())}</div>
            <div className="text-white/90 text-sm">per person</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Travel Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !formData.travelDate && "text-muted-foreground",
                    errors.travelDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.travelDate ? format(formData.travelDate, "PPP") : <span>Check-in</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.travelDate}
                  onSelect={(date) => setFormData(prev => ({...prev, travelDate: date}))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.travelDate && <p className="text-red-500 text-xs">{errors.travelDate}</p>}
          </div>

          {/* Travel Time - Only for tours */}
          {showTimeField && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Time *</Label>
              <Select value={formData.travelTime} onValueChange={(value) => setFormData(prev => ({...prev, travelTime: value}))}>
                <SelectTrigger className={cn("h-12", errors.travelTime && "border-red-500")}>
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
              {errors.travelTime && <p className="text-red-500 text-xs">{errors.travelTime}</p>}
            </div>
          )}

          {/* Number of Travelers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Number of Travelers</Label>
            
            <div className="border rounded-lg p-4 space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-xs text-gray-500">Age 12+</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('adults', false)}
                    disabled={formData.adults <= 1}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('adults', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-xs text-gray-500">Age 2-11</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('children', false)}
                    disabled={formData.children <= 0}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('children', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-xs text-gray-500">Under 2</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('infants', false)}
                    disabled={formData.infants <= 0}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-lg">{formData.infants}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustCount('infants', true)}
                    className="h-10 w-10 p-0 rounded-md"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Address *</Label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              placeholder="your@email.com"
              className={`h-12 ${errors.customerEmail ? 'border-red-500' : ''}`}
            />
            {errors.customerEmail && <p className="text-red-500 text-xs">{errors.customerEmail}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Phone Number *</Label>
            <Input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              placeholder="+971 50 123 4567"
              className="h-12"
            />
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Full Name *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Enter full name"
              className={`h-12 ${errors.customerName ? 'border-red-500' : ''}`}
            />
            {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
          </div>

          {/* Pickup Location - Only for tours */}
          {showPickupField && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pickup Location</Label>
              <Input
                value={formData.pickupLocation}
                onChange={(e) => setFormData(prev => ({...prev, pickupLocation: e.target.value}))}
                placeholder="Enter pickup location"
                className="h-12"
              />
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Special Requests</Label>
            <Textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requirements or requests..."
              className="min-h-[80px]"
            />
          </div>

          {/* Book Now Button */}
          <Button
            onClick={handleCreateBooking}
            disabled={isProcessing}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
          >
            {isProcessing ? 'Creating Booking...' : `Book Now - ${formatPrice(calculateTotal())}`}
          </Button>
        </CardContent>
      </Card>
    </>
  );

};

export default SinglePageBookingFlow;
