
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ArrowLeft, CreditCard, Wallet, Banknote, Plus, Minus, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TabbedTourDetails from '@/components/tours/TabbedTourDetails';
import { useQuery } from '@tanstack/react-query';

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

interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  test_mode: boolean;
  priority: number;
  bank_details: any;
}

interface Props {
  service: Service;
  onBack: () => void;
}

const SinglePageBookingFlow = ({ service, onBack }: Props) => {
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
    paymentMethod: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  // Fetch enabled payment gateways
  const { data: paymentGateways } = useQuery({
    queryKey: ['enabled_payment_gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('is_enabled', true)
        .order('priority');
      
      if (error) throw error;
      return data as PaymentGateway[];
    }
  });

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
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (service.type === 'tour' && !formData.travelTime) {
      newErrors.travelTime = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = calculateTotal();
      const selectedGateway = paymentGateways?.find(g => g.gateway_name === formData.paymentMethod);

      if (!selectedGateway) {
        throw new Error('Selected payment gateway not found');
      }

      // Create booking record
      const { data: bookingData, error: bookingError } = await supabase
        .from('new_bookings')
        .insert({
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
          payment_gateway: selectedGateway.display_name,
          payment_method: selectedGateway.gateway_name,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Handle different payment methods
      if (formData.paymentMethod === 'cash_on_arrival') {
        await supabase
          .from('new_bookings')
          .update({ 
            payment_status: 'confirmed',
            booking_status: 'confirmed',
            confirmed_at: new Date().toISOString()
          })
          .eq('id', bookingData.id);

        toast({
          title: "Booking Confirmed!",
          description: `Your booking reference is ${bookingData.booking_reference}. You can pay upon arrival.`,
        });
        
        onBack();
      } else if (formData.paymentMethod === 'bank_transfer') {
        setShowBankDetails(true);
        
        toast({
          title: "Booking Created!",
          description: `Your booking reference is ${bookingData.booking_reference}. Please complete the bank transfer to confirm your booking.`,
        });
      } else if (formData.paymentMethod === 'razorpay') {
        await initializeRazorpay();

        const options = {
          key: selectedGateway.api_key || 'rzp_test_9wuOSlATpSiUGq',
          amount: Math.round(totalAmount * 100),
          currency: 'AED',
          name: 'Trip Habibi',
          description: service.title,
          order_id: bookingData.booking_reference,
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone
          },
          theme: {
            color: '#3B82F6'
          },
          handler: async function (response: any) {
            await supabase
              .from('new_bookings')
              .update({ 
                payment_status: 'paid',
                booking_status: 'confirmed',
                payment_reference: response.razorpay_payment_id,
                confirmed_at: new Date().toISOString()
              })
              .eq('id', bookingData.id);

            toast({
              title: "Payment Successful!",
              description: `Your booking is confirmed. Reference: ${bookingData.booking_reference}`,
            });
            onBack();
          },
          modal: {
            ondismiss: function() {
              toast({
                title: "Payment Cancelled",
                description: "Your booking is saved as pending. You can complete payment later.",
              });
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (formData.paymentMethod === 'stripe') {
        // Simulate Stripe payment
        setTimeout(async () => {
          await supabase
            .from('new_bookings')
            .update({ 
              payment_status: 'paid',
              booking_status: 'confirmed',
              payment_reference: `stripe_${Date.now()}`,
              confirmed_at: new Date().toISOString()
            })
            .eq('id', bookingData.id);

          toast({
            title: "Payment Successful!",
            description: `Your booking is confirmed. Reference: ${bookingData.booking_reference}`,
          });
          onBack();
        }, 2000);
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5 text-green-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-5 w-5 text-orange-600" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const selectedGateway = paymentGateways?.find(g => g.gateway_name === formData.paymentMethod);

  if (showBankDetails && selectedGateway?.bank_details) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Bank Transfer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600 mb-2">Booking Created Successfully!</p>
                <p className="text-gray-600">Please transfer the amount to the following bank account:</p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Bank Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                    <p className="text-lg font-semibold">{selectedGateway.bank_details.bank_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Account Holder</Label>
                    <p className="text-lg font-semibold">{selectedGateway.bank_details.account_holder}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                    <p className="text-lg font-semibold">{selectedGateway.bank_details.account_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">IBAN</Label>
                    <p className="text-lg font-semibold">{selectedGateway.bank_details.iban}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">SWIFT Code</Label>
                    <p className="text-lg font-semibold">{selectedGateway.bank_details.swift}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Amount to Transfer</Label>
                    <p className="text-xl font-bold text-green-600">{formatPrice(calculateTotal())}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Please use your booking reference in the transfer description for quick processing.
                </p>
                <Button onClick={onBack} className="px-8">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const showTimeField = service.type === 'tour';
  const showPickupField = service.type === 'tour';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book {service.title}</h1>
            <p className="text-gray-600">Complete your booking in just a few steps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <TabbedTourDetails tour={service} />

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Travel Date */}
                <div>
                  <Label htmlFor="travel-date">Travel Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-gray-300",
                          !formData.travelDate && "text-muted-foreground",
                          errors.travelDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                        className="pointer-events-auto bg-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.travelDate && <p className="text-sm text-red-600 mt-1">{errors.travelDate}</p>}
                </div>

                {/* Travel Time - Only for tours */}
                {showTimeField && (
                  <div>
                    <Label htmlFor="travel-time">Select Time *</Label>
                    <Select value={formData.travelTime} onValueChange={(value) => setFormData(prev => ({...prev, travelTime: value}))}>
                      <SelectTrigger className={cn("bg-white border-gray-300", errors.travelTime && "border-red-500")}>
                        <SelectValue placeholder="Choose your preferred time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg">
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
                  <div>
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <Input
                      id="pickup"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData(prev => ({...prev, pickupLocation: e.target.value}))}
                      placeholder="Enter your pickup location"
                      className="bg-white border-gray-300"
                    />
                  </div>
                )}

                {/* Travelers */}
                <div className="space-y-4">
                  <Label>Number of Travelers</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div>
                        <div className="font-medium">Adults</div>
                        <div className="text-sm text-gray-600">{formatPrice(service.price_adult)} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('adults', false)}
                          disabled={formData.adults <= 1}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{formData.adults}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('adults', true)}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div>
                        <div className="font-medium">Children (2-12 years)</div>
                        <div className="text-sm text-gray-600">{formatPrice(service.price_child)} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('children', false)}
                          disabled={formData.children <= 0}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{formData.children}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('children', true)}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div>
                        <div className="font-medium">Infants (0-2 years)</div>
                        <div className="text-sm text-gray-600">{formatPrice(service.price_infant)} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('infants', false)}
                          disabled={formData.infants <= 0}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{formData.infants}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adjustCount('infants', true)}
                          className="h-8 w-8 rounded-full p-0 border-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Details */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({...prev, customerName: e.target.value}))}
                      placeholder="Enter your full name"
                      className={cn("bg-white border-gray-300", errors.customerName && "border-red-500")}
                      required
                    />
                    {errors.customerName && <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({...prev, customerEmail: e.target.value}))}
                      placeholder="Enter your email"
                      className={cn("bg-white border-gray-300", errors.customerEmail && "border-red-500")}
                      required
                    />
                    {errors.customerEmail && <p className="text-sm text-red-600 mt-1">{errors.customerEmail}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({...prev, customerPhone: e.target.value}))}
                    placeholder="Enter your phone number"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData(prev => ({...prev, specialRequests: e.target.value}))}
                    placeholder="Any special requirements or requests"
                    className="bg-white border-gray-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentGateways?.map((gateway) => (
                    <div 
                      key={gateway.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.paymentMethod === gateway.gateway_name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({...prev, paymentMethod: gateway.gateway_name}))}
                    >
                      <div className="flex items-center gap-3">
                        {getPaymentIcon(gateway.gateway_name)}
                        <div>
                          <div className="font-medium">{gateway.display_name}</div>
                          <div className="text-sm text-gray-600">{gateway.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-sm text-red-600 mt-2">{errors.paymentMethod}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{service.title}</h3>
                  {formData.travelDate && (
                    <p className="text-sm text-gray-600">
                      {format(formData.travelDate, "PPP")}
                      {formData.travelTime && ` at ${formData.travelTime}`}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.adults > 0 && (
                    <div className="flex justify-between">
                      <span>{formData.adults} Adult{formData.adults > 1 ? 's' : ''}</span>
                      <span>{formatPrice(formData.adults * service.price_adult)}</span>
                    </div>
                  )}
                  {formData.children > 0 && (
                    <div className="flex justify-between">
                      <span>{formData.children} Child{formData.children > 1 ? 'ren' : ''}</span>
                      <span>{formatPrice(formData.children * service.price_child)}</span>
                    </div>
                  )}
                  {formData.infants > 0 && (
                    <div className="flex justify-between">
                      <span>{formData.infants} Infant{formData.infants > 1 ? 's' : ''}</span>
                      <span>{formatPrice(formData.infants * service.price_infant)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    formData.paymentMethod === 'cash_on_arrival' ? 'Confirm Booking' : 
                    formData.paymentMethod === 'bank_transfer' ? 'Get Bank Details' : 'Proceed to Payment'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePageBookingFlow;
