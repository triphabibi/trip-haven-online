
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, CreditCard, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';

const BookingPage = () => {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const { selectedGateway, setSelectedGateway, processPayment } = usePayment();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [bookingData, setBookingData] = useState({
    travelerCount: 1,
    travelDate: '',
    specialRequests: '',
    travelers: [{ fullName: '', age: '', passportNumber: '', nationality: '' }],
  });

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast({
        title: "Error",
        description: "Failed to load service details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTravelerChange = (index: number, field: string, value: string) => {
    const newTravelers = [...bookingData.travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setBookingData(prev => ({
      ...prev,
      travelers: newTravelers,
    }));
  };

  const addTraveler = () => {
    setBookingData(prev => ({
      ...prev,
      travelers: [...prev.travelers, { fullName: '', age: '', passportNumber: '', nationality: '' }],
    }));
  };

  const removeTraveler = (index: number) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.filter((_, i) => i !== index),
    }));
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code you entered is not valid or has expired.",
          variant: "destructive",
        });
        return;
      }

      const discount = data.discount_percentage || 0;
      setPromoDiscount(discount);
      toast({
        title: "Promo Code Applied!",
        description: `You saved ${discount}% on your booking!`,
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
    }
  };

  const calculateTotal = () => {
    if (!service) return 0;
    const baseAmount = service.price * bookingData.travelerCount;
    const discountAmount = (baseAmount * promoDiscount) / 100;
    return baseAmount - discountAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !service) return;

    setSubmitting(true);
    
    try {
      const totalAmount = service.price * bookingData.travelerCount;
      const discountAmount = (totalAmount * promoDiscount) / 100;
      const finalAmount = totalAmount - discountAmount;

      // Create booking - let the database generate the booking_reference via trigger
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: service.id,
          traveler_count: bookingData.travelerCount,
          travel_date: bookingData.travelDate || null,
          special_requests: bookingData.specialRequests || null,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          payment_gateway: selectedGateway,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Add travelers with correct field names
      if (bookingData.travelers.length > 0) {
        const travelersData = bookingData.travelers.map(traveler => ({
          booking_id: booking.id,
          full_name: traveler.fullName, // Map fullName to full_name
          age: traveler.age ? parseInt(traveler.age) : null,
          passport_number: traveler.passportNumber, // Map passportNumber to passport_number
          nationality: traveler.nationality,
        }));

        const { error: travelersError } = await supabase
          .from('booking_travelers')
          .insert(travelersData);

        if (travelersError) throw travelersError;
      }

      // Process payment
      const paymentResult = await processPayment(finalAmount, booking.id);
      
      if (paymentResult.success) {
        // Update booking with payment details
        await supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
            booking_status: 'confirmed',
            payment_reference: paymentResult.paymentId,
          })
          .eq('id', booking.id);

        toast({
          title: "Booking Confirmed!",
          description: `Your booking has been confirmed. Reference: ${booking.booking_reference}`,
        });

        navigate('/my-bookings');
      } else {
        // Update booking with failed payment
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
          })
          .eq('id', booking.id);

        toast({
          title: "Payment Failed",
          description: "Your booking was created but payment failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 capitalize">
                  {service.service_type}
                </Badge>
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-green-600">
                  ${service.price} per person
                </div>
                
                {service.features && (
                  <div>
                    <h4 className="font-medium mb-2">Included Features:</h4>
                    <div className="space-y-1">
                      {service.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
              <CardDescription>Fill in your details to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Traveler Count */}
                <div>
                  <Label htmlFor="travelerCount">Number of Travelers</Label>
                  <Select
                    value={bookingData.travelerCount.toString()}
                    onValueChange={(value) => {
                      const count = parseInt(value);
                      handleInputChange('travelerCount', count);
                      // Adjust travelers array
                      const newTravelers = Array.from({ length: count }, (_, i) => 
                        bookingData.travelers[i] || { fullName: '', age: '', passportNumber: '', nationality: '' }
                      );
                      setBookingData(prev => ({ ...prev, travelers: newTravelers }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Traveler' : 'Travelers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Travel Date */}
                <div>
                  <Label htmlFor="travelDate">Travel Date</Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(e) => handleInputChange('travelDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Traveler Details */}
                <div>
                  <Label>Traveler Details</Label>
                  {bookingData.travelers.map((traveler, index) => (
                    <Card key={index} className="mt-2">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Traveler {index + 1}</h4>
                          {bookingData.travelers.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTraveler(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`traveler-${index}-name`}>Full Name</Label>
                            <Input
                              id={`traveler-${index}-name`}
                              value={traveler.fullName}
                              onChange={(e) => handleTravelerChange(index, 'fullName', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`traveler-${index}-age`}>Age</Label>
                            <Input
                              id={`traveler-${index}-age`}
                              type="number"
                              value={traveler.age}
                              onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`traveler-${index}-passport`}>Passport Number</Label>
                            <Input
                              id={`traveler-${index}-passport`}
                              value={traveler.passportNumber}
                              onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`traveler-${index}-nationality`}>Nationality</Label>
                            <Input
                              id={`traveler-${index}-nationality`}
                              value={traveler.nationality}
                              onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                {/* Promo Code */}
                <div>
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                    />
                    <Button type="button" onClick={applyPromoCode} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {promoDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Promo code applied! {promoDiscount}% discount
                    </p>
                  )}
                </div>

                {/* Payment Gateway Selection */}
                <div>
                  <Label>Payment Gateway</Label>
                  <Select value={selectedGateway} onValueChange={setSelectedGateway}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="payu">PayU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Summary */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({bookingData.travelerCount} travelers)</span>
                        <span>${(service.price * bookingData.travelerCount).toFixed(2)}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({promoDiscount}%)</span>
                          <span>-${((service.price * bookingData.travelerCount * promoDiscount) / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
