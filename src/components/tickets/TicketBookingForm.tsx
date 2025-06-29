
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';

interface TicketBookingFormProps {
  ticketId: string;
  ticketTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
}

const TicketBookingForm = ({ 
  ticketId, 
  ticketTitle, 
  priceAdult,
  priceChild = 0,
  priceInfant = 0 
}: TicketBookingFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    visitDate: '',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
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

  const generateBookingReference = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK${timestamp.slice(-8)}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const totalAmount = calculateTotal();
      const bookingReference = generateBookingReference();
      
      const { data, error } = await supabase
        .from('new_bookings')
        .insert({
          booking_reference: bookingReference,
          service_id: ticketId,
          booking_type: 'ticket',
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          travel_date: formData.visitDate || null,
          adults_count: formData.adultsCount,
          children_count: formData.childrenCount,
          infants_count: formData.infantsCount,
          total_amount: totalAmount,
          final_amount: totalAmount,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ticket Booked!",
        description: `Your booking reference is ${bookingReference}. You will receive confirmation via email.`,
      });

      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        visitDate: '',
        adultsCount: 1,
        childrenCount: 0,
        infantsCount: 0,
      });

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Error",
        description: "Failed to book ticket. Please try again.",
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
            Visitor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visit Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="visitDate">Visit Date</Label>
            <Input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
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
              {priceAdult > 0 && (
                <p className="text-sm text-gray-500 mt-1">{formatPrice(priceAdult)} each</p>
              )}
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
              {priceChild > 0 && (
                <p className="text-sm text-gray-500 mt-1">{formatPrice(priceChild)} each</p>
              )}
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
              {priceInfant > 0 && (
                <p className="text-sm text-gray-500 mt-1">{formatPrice(priceInfant)} each</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Ticket:</span>
              <span className="font-medium">{ticketTitle}</span>
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
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Processing...' : 'Book Tickets'}
      </Button>
    </form>
  );
};

export default TicketBookingForm;
