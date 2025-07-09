
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet, Banknote, Star, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SinglePageBookingFlowProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
  serviceImage?: string;
}

const SinglePageBookingFlow = ({
  serviceId,
  serviceType,
  serviceTitle,
  priceAdult,
  priceChild = 0,
  priceInfant = 0,
  serviceImage
}: SinglePageBookingFlowProps) => {
  const [formData, setFormData] = useState({
    travelDate: '',
    travelTime: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    leadGuestName: '',
    leadGuestEmail: '',
    leadGuestMobile: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch enabled payment gateways
  const { data: paymentGateways } = useQuery({
    queryKey: ['payment_gateways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('is_enabled', true)
        .order('priority');
      
      if (error) throw error;
      return data;
    },
  });

  // Set default payment method when gateways load
  useEffect(() => {
    if (paymentGateways && paymentGateways.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentGateways[0].gateway_name);
    }
  }, [paymentGateways, paymentMethod]);

  const calculateTotal = () => {
    return (formData.adults * priceAdult) + 
           (formData.children * priceChild) + 
           (formData.infants * priceInfant);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.travelDate || !formData.leadGuestName || !formData.leadGuestEmail || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotal();
      
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          service_type: serviceType,
          service_id: serviceId,
          service_title: serviceTitle,
          customer_name: formData.leadGuestName,
          customer_email: formData.leadGuestEmail,
          customer_phone: formData.leadGuestMobile,
          travel_date: formData.travelDate,
          adults_count: formData.adults,
          children_count: formData.children,
          infants_count: formData.infants,
          pickup_location: formData.pickupLocation,
          base_amount: totalAmount,
          total_amount: totalAmount,
          final_amount: totalAmount,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
          payment_status: 'pending',
          payment_gateway: paymentMethod
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created Successfully!",
        description: `Booking reference: ${data.booking_reference}. Redirecting to payment...`,
      });

      // Simulate payment redirect
      setTimeout(() => {
        window.open(`/payment/${paymentMethod}?booking=${data.id}`, '_blank');
      }, 1500);

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentIcon = (gatewayName: string) => {
    switch (gatewayName) {
      case 'razorpay':
        return <Wallet className="h-4 w-4 text-blue-600" />;
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'paypal':
        return <Wallet className="h-4 w-4 text-yellow-600" />;
      case 'cash_on_arrival':
        return <Banknote className="h-4 w-4 text-green-600" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Service Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {serviceImage && (
            <img 
              src={serviceImage} 
              alt={serviceTitle} 
              className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4" 
            />
          )}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{serviceTitle}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.8 (127 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Full Day Experience</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Small Group</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Complete Your Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Choose Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                1. Choose Date & Pickup Time
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelDate">Travel Date *</Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="travelTime">Pickup Time</Label>
                  <Select value={formData.travelTime} onValueChange={(value) => setFormData({ ...formData, travelTime: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Step 2: Number of Travelers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                2. Number of Travelers
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="adults">Adults (12+ years)</Label>
                  <Select value={formData.adults.toString()} onValueChange={(value) => setFormData({ ...formData, adults: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Adult{num > 1 ? 's' : ''} - AED {(num * priceAdult).toFixed(0)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children">Children (3-11 years)</Label>
                  <Select value={formData.children.toString()} onValueChange={(value) => setFormData({ ...formData, children: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Child{num !== 1 ? 'ren' : ''} {num > 0 && `- AED ${(num * priceChild).toFixed(0)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="infants">Infants (0-2 years)</Label>
                  <Select value={formData.infants.toString()} onValueChange={(value) => setFormData({ ...formData, infants: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Infant{num > 1 ? 's' : ''} {num > 0 && priceInfant > 0 && `- AED ${(num * priceInfant).toFixed(0)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Step 3: Pickup Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                3. Pickup Location
              </h3>
              <div>
                <Label htmlFor="pickupLocation">Hotel Name or Address</Label>
                <Input
                  id="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  placeholder="Enter your hotel name or pickup address"
                  className="w-full"
                />
              </div>
            </div>

            {/* Step 4: Lead Guest Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">4. Lead Guest Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="leadGuestName">Full Name *</Label>
                  <Input
                    id="leadGuestName"
                    value={formData.leadGuestName}
                    onChange={(e) => setFormData({ ...formData, leadGuestName: e.target.value })}
                    required
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="leadGuestEmail">Email Address *</Label>
                  <Input
                    id="leadGuestEmail"
                    type="email"
                    value={formData.leadGuestEmail}
                    onChange={(e) => setFormData({ ...formData, leadGuestEmail: e.target.value })}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="leadGuestMobile">Mobile Number</Label>
                  <Input
                    id="leadGuestMobile"
                    value={formData.leadGuestMobile}
                    onChange={(e) => setFormData({ ...formData, leadGuestMobile: e.target.value })}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            {/* Step 5: Payment Method Selection */}
            {paymentGateways && paymentGateways.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5. Select Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={gateway.gateway_name} id={gateway.gateway_name} />
                      <Label htmlFor={gateway.gateway_name} className="flex items-center gap-3 cursor-pointer flex-1">
                        {getPaymentIcon(gateway.gateway_name)}
                        <div>
                          <div className="font-medium">{gateway.display_name}</div>
                          {gateway.description && (
                            <div className="text-sm text-gray-500">{gateway.description}</div>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Price Summary */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="text-lg font-semibold">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Adults ({formData.adults} × AED {priceAdult})</span>
                  <span>AED {(formData.adults * priceAdult).toFixed(2)}</span>
                </div>
                {formData.children > 0 && (
                  <div className="flex justify-between">
                    <span>Children ({formData.children} × AED {priceChild})</span>
                    <span>AED {(formData.children * priceChild).toFixed(2)}</span>
                  </div>
                )}
                {formData.infants > 0 && priceInfant > 0 && (
                  <div className="flex justify-between">
                    <span>Infants ({formData.infants} × AED {priceInfant})</span>
                    <span>AED {(formData.infants * priceInfant).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">AED {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing Booking...' : `Proceed to Payment - AED ${calculateTotal().toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SinglePageBookingFlow;
