import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

interface GuestBookingFormProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
}

const GuestBookingForm = ({ 
  serviceId, 
  serviceType, 
  serviceTitle, 
  priceAdult,
  priceChild = 0,
  priceInfant = 0 
}: GuestBookingFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    travelDate: '',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    pickupLocation: '',
    specialRequests: '',
    selectedTime: '',
    selectedLanguage: 'English'
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const calculateTotal = () => {
    const adultTotal = formData.adultsCount * priceAdult;
    const childTotal = formData.childrenCount * (priceChild || 0);
    const infantTotal = formData.infantsCount * (priceInfant || 0);
    return adultTotal + childTotal + infantTotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please provide at least your name and phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const totalAmount = calculateTotal();
      
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          service_type: serviceType,
          service_id: serviceId,
          service_title: serviceTitle,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          travel_date: formData.travelDate || null,
          adults_count: formData.adultsCount,
          children_count: formData.childrenCount,
          infants_count: formData.infantsCount,
          pickup_location: formData.pickupLocation || null,
          special_requests: formData.specialRequests || null,
          selected_language: formData.selectedLanguage,
          base_amount: totalAmount,
          total_amount: totalAmount,
          final_amount: totalAmount,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: `Your booking has been submitted successfully!`,
      });

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        travelDate: '',
        adultsCount: 1,
        childrenCount: 0,
        infantsCount: 0,
        pickupLocation: '',
        specialRequests: '',
        selectedTime: '',
        selectedLanguage: 'English'
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email (optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="travelDate">Travel Date</Label>
            <Input
              id="travelDate"
              type="date"
              value={formData.travelDate}
              onChange={(e) => setFormData(prev => ({ ...prev, travelDate: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adultsCount">Adults</Label>
              <Input
                id="adultsCount"
                type="number"
                min="1"
                value={formData.adultsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, adultsCount: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="childrenCount">Children</Label>
              <Input
                id="childrenCount"
                type="number"
                min="0"
                value={formData.childrenCount}
                onChange={(e) => setFormData(prev => ({ ...prev, childrenCount: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="infantsCount">Infants</Label>
              <Input
                id="infantsCount"
                type="number"
                min="0"
                value={formData.infantsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, infantsCount: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pickupLocation">Pickup Location (optional)</Label>
            <Input
              id="pickupLocation"
              placeholder="Enter pickup address or location"
              value={formData.pickupLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="selectedTime">Preferred Time</Label>
              <Select value={formData.selectedTime} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTime: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12:00 PM - 4:00 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4:00 PM - 8:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="selectedLanguage">Language</Label>
              <Select value={formData.selectedLanguage} onValueChange={(value) => setFormData(prev => ({ ...prev, selectedLanguage: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special requirements or requests..."
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Adults ({formData.adultsCount}):</span>
              <span>{formatPrice(formData.adultsCount * priceAdult)}</span>
            </div>
            {formData.childrenCount > 0 && (
              <div className="flex justify-between">
                <span>Children ({formData.childrenCount}):</span>
                <span>{formatPrice(formData.childrenCount * (priceChild || 0))}</span>
              </div>
            )}
            {formData.infantsCount > 0 && (
              <div className="flex justify-between">
                <span>Infants ({formData.infantsCount}):</span>
                <span>{formatPrice(formData.infantsCount * (priceInfant || 0))}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Booking'}
      </Button>
    </form>
  );
};

export default GuestBookingForm;