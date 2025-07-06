
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ModularPaymentGateway from './ModularPaymentGateway';
import { CalendarDays, Users, Phone, Mail, User } from 'lucide-react';

interface IntegratedBookingFlowProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
  serviceImage?: string;
}

const IntegratedBookingFlow = ({
  serviceId,
  serviceType,
  serviceTitle,
  priceAdult,
  priceChild = 0,
  priceInfant = 0,
  serviceImage
}: IntegratedBookingFlowProps) => {
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    specialRequests: ''
  });

  const calculateTotal = () => {
    return (formData.adults * priceAdult) + 
           (formData.children * priceChild) + 
           (formData.infants * priceInfant);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotal();
      
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          service_type: serviceType,
          service_id: serviceId,
          service_title: serviceTitle,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          travel_date: formData.travelDate || null,
          adults_count: formData.adults,
          children_count: formData.children,
          infants_count: formData.infants,
          pickup_location: formData.pickupLocation,
          base_amount: totalAmount,
          total_amount: totalAmount,
          final_amount: totalAmount,
          special_requests: formData.specialRequests,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setStep(2);
      
      toast({
        title: "Booking Created!",
        description: `Booking reference: ${data.booking_reference}`,
      });

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

  const handlePaymentSuccess = (paymentId: string, gateway: string) => {
    toast({
      title: "Payment Successful!",
      description: `Your booking has been confirmed. Payment ID: ${paymentId}`,
    });
    
    // Redirect to confirmation page or reset form
    setTimeout(() => {
      window.location.href = '/booking-history';
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    
    // Allow user to try again
    setStep(1);
  };

  if (step === 2 && bookingId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{serviceTitle}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formData.customerName}</span>
                <span>{formData.customerEmail}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Travelers: {formData.adults + formData.children + formData.infants}</span>
                <span>{formData.travelDate}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">AED {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway */}
        <ModularPaymentGateway
          bookingId={bookingId}
          amount={calculateTotal()}
          customerName={formData.customerName}
          customerEmail={formData.customerEmail}
          customerPhone={formData.customerPhone}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Book {serviceTitle}
          </CardTitle>
          {serviceImage && (
            <img
              src={serviceImage}
              alt={serviceTitle}
              className="w-full h-48 object-cover rounded-lg mt-4"
            />
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customerEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="travelDate" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Travel Date
                </Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                />
              </div>
            </div>

            {/* Group Size */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Group Size
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="adults" className="text-sm">Adults</Label>
                  <Select 
                    value={formData.adults.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, adults: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">AED {priceAdult} each</p>
                </div>
                
                <div>
                  <Label htmlFor="children" className="text-sm">Children</Label>
                  <Select 
                    value={formData.children.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, children: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3,4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">AED {priceChild} each</p>
                </div>
                
                <div>
                  <Label htmlFor="infants" className="text-sm">Infants</Label>
                  <Select 
                    value={formData.infants.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, infants: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">AED {priceInfant} each</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <Label htmlFor="pickupLocation">Pickup Location (Optional)</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements"
              />
            </div>

            {/* Total & Submit */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold text-blue-600">
                    AED {calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold" 
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? 'Creating Booking...' : `Proceed to Payment - AED ${calculateTotal().toFixed(2)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedBookingFlow;
