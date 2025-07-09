
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
import { CreditCard, Wallet, Banknote, Star, Clock, Users, MapPin, Plus, Minus } from 'lucide-react';

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
    leadGuestName: '',
    leadGuestEmail: '',
    leadGuestMobile: '',
    travelDate: '',
    travelTime: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isToursOrPackages = serviceType === 'tour' || serviceType === 'package';

  const calculateTotal = () => {
    return (formData.adults * priceAdult) + 
           (formData.children * priceChild) + 
           (formData.infants * priceInfant);
  };

  const updateCounter = (field: 'adults' | 'children' | 'infants', increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(increment ? prev[field] + 1 : prev[field] - 1, field === 'adults' ? 1 : 0)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotal();
      
      const bookingData = {
        service_type: serviceType,
        service_id: serviceId,
        service_title: serviceTitle,
        customer_name: formData.leadGuestName,
        customer_email: formData.leadGuestEmail,
        customer_phone: formData.leadGuestMobile,
        lead_guest_name: formData.leadGuestName,
        lead_guest_email: formData.leadGuestEmail,
        lead_guest_mobile: formData.leadGuestMobile,
        travel_date: formData.travelDate || null,
        travel_time: formData.travelTime || null,
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
      };

      console.log('Submitting booking data:', bookingData);

      const { data, error } = await supabase
        .from('new_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        throw error;
      }

      console.log('Booking created:', data);

      toast({
        title: "Booking Created!",
        description: `Booking reference: ${data.booking_reference}. Redirecting to payment...`,
      });

      // Simulate payment redirect
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
      console.error('Full booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again",
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
          {serviceImage && (
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
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Travel Date */}
            <div>
              <Label htmlFor="travelDate">Choose Date *</Label>
              <Input
                id="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            {/* Group Size with +/- buttons */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Number of Travelers</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Adults */}
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <span className="font-medium">Adults</span>
                    <div className="text-sm text-gray-600">AED {priceAdult}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('adults', false)}
                      disabled={formData.adults <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.adults}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('adults', true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <span className="font-medium">Children</span>
                    <div className="text-sm text-gray-600">AED {priceChild}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('children', false)}
                      disabled={formData.children <= 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.children}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('children', true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <span className="font-medium">Infants</span>
                    <div className="text-sm text-gray-600">AED {priceInfant}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('infants', false)}
                      disabled={formData.infants <= 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.infants}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => updateCounter('infants', true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Time - Only for Tours/Packages */}
            {isToursOrPackages && (
              <div>
                <Label htmlFor="travelTime">Pickup Time *</Label>
                <Select value={formData.travelTime} onValueChange={(value) => setFormData({ ...formData, travelTime: value })}>
                  <SelectTrigger className="mt-1 bg-white">
                    <SelectValue placeholder="Select pickup time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="07:00">07:00 AM</SelectItem>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Pickup Location */}
            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="Hotel name or address"
                className="mt-1"
              />
            </div>

            {/* Lead Guest Details */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Lead Guest Details</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leadGuestName">Full Name *</Label>
                  <Input
                    id="leadGuestName"
                    value={formData.leadGuestName}
                    onChange={(e) => setFormData({ ...formData, leadGuestName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="leadGuestEmail">Email *</Label>
                  <Input
                    id="leadGuestEmail"
                    type="email"
                    value={formData.leadGuestEmail}
                    onChange={(e) => setFormData({ ...formData, leadGuestEmail: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="leadGuestMobile">Mobile Number *</Label>
                <Input
                  id="leadGuestMobile"
                  value={formData.leadGuestMobile}
                  onChange={(e) => setFormData({ ...formData, leadGuestMobile: e.target.value })}
                  placeholder="+971 XX XXX XXXX"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements..."
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <Label className="text-base font-semibold">Select Payment Method</Label>
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
              {isSubmitting ? 'Processing...' : `Proceed to Payment - AED ${calculateTotal()}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SinglePageBookingFlow;
