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
      
      {/* Mobile-First Responsive Styles */}
      <style>{`
        /* Mobile-first responsive styles */
        .booking-form-container {
          width: 100% !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .booking-section {
          width: 100% !important;
          margin-bottom: 1.5rem !important;
          padding: 1rem !important;
          border-radius: 12px !important;
          background: white !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        .mobile-input {
          width: 100% !important;
          height: 48px !important;
          font-size: 16px !important;
          padding: 12px 16px !important;
          border-radius: 8px !important;
          border: 1px solid #d1d5db !important;
          background: white !important;
        }
        
        .mobile-button {
          width: 100% !important;
          height: 48px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          margin-top: 8px !important;
        }
        
        .traveler-counter {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 16px !important;
          background: #f9fafb !important;
          border-radius: 8px !important;
          margin-bottom: 12px !important;
        }
        
        .counter-buttons {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        
        .counter-btn {
          width: 40px !important;
          height: 40px !important;
          border-radius: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 2px solid #e5e7eb !important;
          background: white !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        
        .counter-btn:hover {
          border-color: #3b82f6 !important;
          background: #eff6ff !important;
        }
        
        .counter-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        
        .summary-card {
          position: sticky !important;
          top: 20px !important;
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          overflow: hidden !important;
        }
        
        /* Responsive grid fix */
        @media (max-width: 1024px) {
          .lg\\:grid-cols-3 {
            display: block !important;
          }
          
          .lg\\:col-span-2,
          .lg\\:col-span-1 {
            width: 100% !important;
          }
          
          .summary-card {
            position: static !important;
            margin-top: 1.5rem !important;
          }
        }
        
        /* Tablet adjustments */
        @media (min-width: 768px) and (max-width: 1023px) {
          .booking-section {
            padding: 1.5rem !important;
          }
          
          .mobile-input {
            height: 44px !important;
          }
          
          .mobile-button {
            height: 44px !important;
          }
        }
      `}</style>
      
      <div className="booking-form-container">
        <div className="w-full space-y-6">
          
          {/* Trip Details Section */}
          <div className="booking-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
            
            {/* Travel Date */}
            <div className="mb-4">
              <Label htmlFor="travel-date" className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mobile-input justify-start text-left font-normal",
                      !formData.travelDate && "text-muted-foreground",
                      errors.travelDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {formData.travelDate ? format(formData.travelDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border shadow-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.travelDate}
                    onSelect={(date) => setFormData(prev => ({...prev, travelDate: date}))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.travelDate && <p className="text-sm text-red-600 mt-1">{errors.travelDate}</p>}
            </div>

            {/* Travel Time - Only for tours */}
            {showTimeField && (
              <div className="mb-4">
                <Label htmlFor="travel-time" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time *
                </Label>
                <Select value={formData.travelTime} onValueChange={(value) => setFormData(prev => ({...prev, travelTime: value}))}>
                  <SelectTrigger className={cn("mobile-input", errors.travelTime && "border-red-500")}>
                    <SelectValue placeholder="Choose your preferred time" />
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
                {errors.travelTime && <p className="text-sm text-red-600 mt-1">{errors.travelTime}</p>}
              </div>
            )}

            {/* Pickup Location - Only for tours */}
            {showPickupField && (
              <div className="mb-4">
                <Label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </Label>
                <Input
                  id="pickup"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData(prev => ({...prev, pickupLocation: e.target.value}))}
                  placeholder="Enter your pickup location"
                  className="mobile-input"
                />
              </div>
            )}
          </div>

          {/* Travelers Section */}
          <div className="booking-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of Travelers</h3>
            
            {/* Adults */}
            <div className="traveler-counter">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-600">{formatPrice(service.price_adult)} each</div>
              </div>
              <div className="counter-buttons">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('adults', false)}
                  disabled={formData.adults <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg min-w-[2rem] text-center">{formData.adults}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('adults', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="traveler-counter">
              <div>
                <div className="font-medium text-gray-900">Children (2-12 years)</div>
                <div className="text-sm text-gray-600">{formatPrice(service.price_child)} each</div>
              </div>
              <div className="counter-buttons">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('children', false)}
                  disabled={formData.children <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg min-w-[2rem] text-center">{formData.children}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('children', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="traveler-counter">
              <div>
                <div className="font-medium text-gray-900">Infants (0-2 years)</div>
                <div className="text-sm text-gray-600">{formatPrice(service.price_infant)} each</div>
              </div>
              <div className="counter-buttons">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('infants', false)}
                  disabled={formData.infants <= 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-lg min-w-[2rem] text-center">{formData.infants}</span>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => adjustCount('infants', true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Guest Details Section */}
          <div className="booking-section">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Details</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({...prev, customerName: e.target.value}))}
                  placeholder="Enter your full name"
                  className={cn("mobile-input", errors.customerName && "border-red-500")}
                />
                {errors.customerName && <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>}
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({...prev, customerEmail: e.target.value}))}
                  placeholder="Enter your email"
                  className={cn("mobile-input", errors.customerEmail && "border-red-500")}
                />
                {errors.customerEmail && <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>}
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({...prev, customerPhone: e.target.value}))}
                  placeholder="Enter your phone number"
                  className="mobile-input"
                />
              </div>
              
              <div>
                <Label htmlFor="requests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </Label>
                <Textarea
                  id="requests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({...prev, specialRequests: e.target.value}))}
                  placeholder="Any special requirements or requests"
                  className="w-full min-h-[80px] p-3 text-base border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="summary-card">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Booking Summary</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-base text-gray-900">{service.title}</h4>
                {formData.travelDate && (
                  <p className="text-sm text-gray-600 mt-1">
                    {format(formData.travelDate, "PPP")}
                    {formData.travelTime && ` at ${formData.travelTime}`}
                  </p>
                )}
              </div>

              <div className="space-y-3 py-3 border-t border-b border-gray-200">
                {formData.adults > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{formData.adults} Adult{formData.adults > 1 ? 's' : ''}</span>
                    <span className="font-medium">{formatPrice(formData.adults * service.price_adult)}</span>
                  </div>
                )}
                {formData.children > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{formData.children} Child{formData.children > 1 ? 'ren' : ''}</span>
                    <span className="font-medium">{formatPrice(formData.children * service.price_child)}</span>
                  </div>
                )}
                {formData.infants > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{formData.infants} Infant{formData.infants > 1 ? 's' : ''}</span>
                    <span className="font-medium">{formatPrice(formData.infants * service.price_infant)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <Button 
                onClick={handleCreateBooking}
                disabled={isProcessing}
                className="mobile-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Booking...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePageBookingFlow;
