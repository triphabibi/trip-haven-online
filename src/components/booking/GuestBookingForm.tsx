
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GuestBookingFormProps {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
}

const GuestBookingForm = ({ serviceId, serviceType, serviceTitle, priceAdult }: GuestBookingFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    travelDate: '',
    pickupLocation: '',
    specialRequests: '',
    selectedTime: '',
    selectedLanguage: 'English'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone) {
      toast({
        title: "Error",
        description: "Name and phone/email are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const totalAmount = (formData.adultsCount * priceAdult);
      
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_email: formData.customerEmail || null,
          service_id: serviceId,
          booking_type: serviceType,
          adults_count: formData.adultsCount,
          children_count: formData.childrenCount,
          infants_count: formData.infantsCount,
          travel_date: formData.travelDate || null,
          pickup_location: formData.pickupLocation || null,
          special_requests: formData.specialRequests || null,
          selected_time: formData.selectedTime || null,
          selected_language: formData.selectedLanguage,
          total_amount: totalAmount,
          final_amount: totalAmount,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created!",
        description: `Your booking reference is: ${data.booking_reference}`,
      });

      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        adultsCount: 1,
        childrenCount: 0,
        infantsCount: 0,
        travelDate: '',
        pickupLocation: '',
        specialRequests: '',
        selectedTime: '',
        selectedLanguage: 'English'
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book {serviceTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerEmail">Email (Optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Select value={formData.adultsCount.toString()} onValueChange={(value) => setFormData({...formData, adultsCount: parseInt(value)})}>
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
              <Select value={formData.childrenCount.toString()} onValueChange={(value) => setFormData({...formData, childrenCount: parseInt(value)})}>
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
              <Select value={formData.infantsCount.toString()} onValueChange={(value) => setFormData({...formData, infantsCount: parseInt(value)})}>
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
            <Label htmlFor="travelDate">Travel Date</Label>
            <Input
              id="travelDate"
              type="date"
              value={formData.travelDate}
              onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="pickupLocation">Pickup Location (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="pickupLocation"
                className="pl-10"
                placeholder="Enter pickup location"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special requirements or notes..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{(formData.adultsCount * priceAdult).toLocaleString()}
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Booking...' : 'Book Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestBookingForm;
