
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar, CreditCard, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
}

interface ProfessionalBookingFlowProps {
  bookingData: BookingData;
  onComplete?: () => void;
}

const ProfessionalBookingFlow = ({ bookingData, onComplete }: ProfessionalBookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Customer Details
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Booking Details
    travelDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    specialRequests: '',
    
    // Traveler Details
    travelers: [] as any[],
    
    // Payment
    selectedPayment: '',
  });

  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Customer Details', icon: Users },
    { number: 2, title: 'Traveler Details', icon: Calendar },
    { number: 3, title: 'Booking Summary', icon: Check },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  const calculateTotal = () => {
    const adultTotal = formData.adults * bookingData.priceAdult;
    const childTotal = formData.children * bookingData.priceChild;
    const infantTotal = formData.infants * bookingData.priceInfant;
    return adultTotal + childTotal + infantTotal;
  };

  const handleBookingSubmit = async () => {
    try {
      const bookingPayload = {
        service_type: bookingData.serviceType,
        service_id: bookingData.serviceId,
        service_title: bookingData.serviceTitle,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        travel_date: formData.travelDate,
        adults_count: formData.adults,
        children_count: formData.children,
        infants_count: formData.infants,
        pickup_location: formData.pickupLocation,
        special_requests: formData.specialRequests,
        base_amount: calculateTotal(),
        total_amount: calculateTotal(),
        final_amount: calculateTotal(),
        payment_method: formData.selectedPayment,
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('new_bookings')
        .insert([bookingPayload])
        .select()
        .single();

      if (error) throw error;

      // Insert traveler details
      if (formData.travelers.length > 0) {
        const travelerInserts = formData.travelers.map(traveler => ({
          booking_id: data.id,
          ...traveler
        }));

        await supabase
          .from('booking_travelers')
          .insert(travelerInserts);
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${data.booking_reference}`,
      });

      onComplete?.();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="travelDate">Travel Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adults">Adults</Label>
                <Select value={formData.adults.toString()} onValueChange={(value) => setFormData({ ...formData, adults: parseInt(value) })}>
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
                <Label htmlFor="children">Children</Label>
                <Select value={formData.children.toString()} onValueChange={(value) => setFormData({ ...formData, children: parseInt(value) })}>
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
                <Label htmlFor="infants">Infants</Label>
                <Select value={formData.infants.toString()} onValueChange={(value) => setFormData({ ...formData, infants: parseInt(value) })}>
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

            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="Hotel name or address"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Input
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide details for all travelers (optional for quick booking)
            </p>
            <div className="text-center py-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(3)}
              >
                Skip Traveler Details (Add Later)
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{bookingData.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Date:</span>
                  <span>{formData.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span>{formData.adults} Adults, {formData.children} Children, {formData.infants} Infants</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Adults ({formData.adults} × AED {bookingData.priceAdult})</span>
                    <span>AED {formData.adults * bookingData.priceAdult}</span>
                  </div>
                  {formData.children > 0 && (
                    <div className="flex justify-between">
                      <span>Children ({formData.children} × AED {bookingData.priceChild})</span>
                      <span>AED {formData.children * bookingData.priceChild}</span>
                    </div>
                  )}
                  {formData.infants > 0 && (
                    <div className="flex justify-between">
                      <span>Infants ({formData.infants} × AED {bookingData.priceInfant})</span>
                      <span>AED {formData.infants * bookingData.priceInfant}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>AED {calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'razorpay', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, American Express' },
                { id: 'paypal', name: 'PayPal', desc: 'Pay with your PayPal account' },
                { id: 'bank_transfer', name: 'Bank Transfer', desc: 'Direct bank transfer' },
                { id: 'cash_on_arrival', name: 'Pay Later', desc: 'Pay at pickup location' }
              ].map((method) => (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all ${formData.selectedPayment === method.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setFormData({ ...formData, selectedPayment: method.id })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${formData.selectedPayment === method.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Amount: AED {calculateTotal()}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You will be redirected to the payment gateway after clicking "Complete Payment"
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>
                  Step {step.number}
                </p>
                <p className="text-xs text-gray-500">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!formData.customerName || !formData.customerEmail || !formData.travelDate)) ||
                  (currentStep === 4 && !formData.selectedPayment)
                }
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleBookingSubmit}
                disabled={!formData.selectedPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalBookingFlow;
