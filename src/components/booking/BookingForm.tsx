
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface BookingFormProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
  onSuccess?: (bookingId: string) => void;
}

const BookingForm = ({ 
  serviceId, 
  serviceType, 
  serviceTitle, 
  priceAdult, 
  priceChild = 0, 
  priceInfant = 0,
  onSuccess 
}: BookingFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    pickupLocation: '',
    specialRequests: '',
    promoCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch promo codes
  const { data: promoCodes } = useQuery({
    queryKey: ['promo_codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  const calculateTotal = () => {
    const adultTotal = formData.adults * priceAdult;
    const childTotal = formData.children * (priceChild || 0);
    const infantTotal = formData.infants * (priceInfant || 0);
    return adultTotal + childTotal + infantTotal;
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
        special_requests: formData.specialRequests
      };

      const { data, error } = await supabase
        .from('new_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Submitted Successfully!",
        description: `Your booking reference is ${data.booking_reference}`,
      });

      onSuccess?.(data.id);

      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        travelDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        pickupLocation: '',
        specialRequests: '',
        promoCode: ''
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book {serviceTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="travelDate">Travel Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Group Size</h3>
            
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
              <Label htmlFor="promoCode">Promo Code</Label>
              <Input
                id="promoCode"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                placeholder="Enter promo code"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Adults ({formData.adults} × {priceAdult})</span>
                <span>{formData.adults * priceAdult}</span>
              </div>
              {formData.children > 0 && (
                <div className="flex justify-between">
                  <span>Children ({formData.children} × {priceChild})</span>
                  <span>{formData.children * (priceChild || 0)}</span>
                </div>
              )}
              {formData.infants > 0 && (
                <div className="flex justify-between">
                  <span>Infants ({formData.infants} × {priceInfant})</span>
                  <span>{formData.infants * (priceInfant || 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>AED {calculateTotal()}</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
