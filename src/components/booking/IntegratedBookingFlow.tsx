
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet, Banknote, Star, Clock, Users, MapPin } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    return (formData.adults * priceAdult) + 
           (formData.children * priceChild) + 
           (formData.infants * priceInfant);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          payment_status: 'pending',
          payment_gateway: paymentMethod
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created!",
        description: `Booking reference: ${data.booking_reference}. Redirecting to payment...`,
      });

      // Simulate payment redirect based on selected method
      setTimeout(() => {
        if (paymentMethod === 'razorpay') {
          toast({
            title: "Redirecting to Razorpay",
            description: "Please complete your payment",
          });
        } else if (paymentMethod === 'stripe') {
          toast({
            title: "Redirecting to Stripe",
            description: "Please complete your payment",
          });
        } else {
          toast({
            title: "Cash Payment Selected",
            description: "Please pay at pickup location",
          });
        }
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

  return (
    <div className="space-y-6">
      {/* Service Summary Card */}
      <Card>
        <CardContent className="p-4">
          {serviceImage && serviceImage.trim() && (
            <img src={serviceImage} alt={serviceTitle} className="w-full h-32 object-cover rounded-lg mb-3" />
          )}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{serviceTitle}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.8 (127 reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Full Day</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Book Your Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="travelDate">Travel Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                />
              </div>
            </div>

            {/* Group Size */}
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
                    {[0,1,2,3,4].map(num => (
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
                    {[0,1,2,3].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
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
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Any special requirements..."
                  rows={3}
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <Label className="text-base font-semibold">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wallet className="h-4 w-4 text-blue-600" />
                    Razorpay (UPI, Cards, Net Banking)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    Stripe (International Cards)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Banknote className="h-4 w-4 text-green-600" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Adults ({formData.adults} × AED {priceAdult})</span>
                <span>AED {formData.adults * priceAdult}</span>
              </div>
              {formData.children > 0 && (
                <div className="flex justify-between">
                  <span>Children ({formData.children} × AED {priceChild})</span>
                  <span>AED {formData.children * priceChild}</span>
                </div>
              )}
              {formData.infants > 0 && (
                <div className="flex justify-between">
                  <span>Infants ({formData.infants} × AED {priceInfant})</span>
                  <span>AED {formData.infants * priceInfant}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">AED {calculateTotal()}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Book Now - AED ${calculateTotal()}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedBookingFlow;
