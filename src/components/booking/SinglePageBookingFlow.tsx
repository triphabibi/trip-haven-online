import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Wallet, Banknote } from 'lucide-react';

interface SinglePageBookingFlowProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
}

const SinglePageBookingFlow = ({
  serviceId,
  serviceType,
  serviceTitle,
  priceAdult,
  priceChild = 0,
  priceInfant = 0
}: SinglePageBookingFlowProps) => {
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

      // Redirect to payment gateway
      setTimeout(() => {
        if (paymentMethod === 'razorpay') {
          // Integrate Razorpay
          window.location.href = `/payment/razorpay?booking=${data.id}`;
        } else if (paymentMethod === 'stripe') {
          // Integrate Stripe
          window.location.href = `/payment/stripe?booking=${data.id}`;
        } else {
          // Cash payment
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book {serviceTitle}</CardTitle>
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

            {/* Payment Method Selection */}
            <div>
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
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

            {/* Total & Submit */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  AED {calculateTotal().toFixed(2)}
                </span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Book Now - AED ${calculateTotal().toFixed(2)}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SinglePageBookingFlow;