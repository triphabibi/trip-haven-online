
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Users, DollarSign, MapPin, Clock, Minus, Plus, X } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Traveler {
  fullName: string;
  age: number;
  passportNumber: string;
  nationality: string;
}

const BookingPage = () => {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const { selectedGateway } = usePayment();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Booking form state
  const [travelerCount, setTravelerCount] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [travelers, setTravelers] = useState<Traveler[]>([
    { fullName: '', age: 25, passportNumber: '', nationality: '' }
  ]);

  // Pricing state
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  useEffect(() => {
    calculatePricing();
  }, [service, travelerCount, appliedPromo]);

  useEffect(() => {
    // Update travelers array when count changes
    const newTravelers = [...travelers];
    if (travelerCount > travelers.length) {
      for (let i = travelers.length; i < travelerCount; i++) {
        newTravelers.push({ fullName: '', age: 25, passportNumber: '', nationality: '' });
      }
    } else {
      newTravelers.splice(travelerCount);
    }
    setTravelers(newTravelers);
  }, [travelerCount]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service:', error);
      toast({
        title: "Error",
        description: "Service not found",
        variant: "destructive",
      });
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!service) return;

    const total = service.price * travelerCount;
    let discount = 0;

    if (appliedPromo) {
      if (appliedPromo.discount_percentage) {
        discount = (total * appliedPromo.discount_percentage) / 100;
      } else if (appliedPromo.discount_amount) {
        discount = appliedPromo.discount_amount;
      }
    }

    setTotalAmount(total);
    setDiscountAmount(discount);
    setFinalAmount(total - discount);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single();

      if (error) {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code is not valid or has expired",
          variant: "destructive",
        });
        return;
      }

      if (data.current_uses >= data.max_uses) {
        toast({
          title: "Promo Code Exhausted",
          description: "This promo code has reached its usage limit",
          variant: "destructive",
        });
        return;
      }

      setAppliedPromo(data);
      toast({
        title: "Promo Code Applied",
        description: `${data.discount_percentage || data.discount_amount}% discount applied!`,
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive",
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: "Promo Code Removed",
      description: "Promo code has been removed from your booking",
    });
  };

  const updateTraveler = (index: number, field: keyof Traveler, value: string | number) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate travelers
    for (let i = 0; i < travelerCount; i++) {
      if (!travelers[i]?.fullName.trim()) {
        toast({
          title: "Missing Information",
          description: `Please fill in traveler ${i + 1} details`,
          variant: "destructive",
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      // Create booking without booking_reference (auto-generated by trigger)
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          promo_code_id: appliedPromo?.id || null,
          traveler_count: travelerCount,
          travel_date: travelDate || null,
          special_requests: specialRequests,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          final_amount: finalAmount,
          payment_gateway: selectedGateway,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert traveler details
      const travelerData = travelers.slice(0, travelerCount).map(traveler => ({
        booking_id: booking.id,
        full_name: traveler.fullName,
        age: traveler.age,
        passport_number: traveler.passportNumber,
        nationality: traveler.nationality,
      }));

      const { error: travelerError } = await supabase
        .from('booking_travelers')
        .insert(travelerData);

      if (travelerError) throw travelerError;

      // Update promo code usage
      if (appliedPromo) {
        await supabase
          .from('promo_codes')
          .update({ current_uses: appliedPromo.current_uses + 1 })
          .eq('id', appliedPromo.id);
      }

      toast({
        title: "Booking Successful",
        description: `Your booking reference is ${booking.booking_reference}`,
      });

      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading service details...</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Service not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card>
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 capitalize">
                {service.service_type}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {service.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{service.location}</span>
                  </div>
                )}
                {service.duration && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{service.duration}</span>
                  </div>
                )}
                <div className="flex items-center text-2xl font-bold text-green-600">
                  <DollarSign className="h-6 w-6 mr-1" />
                  <span>${service.price} per person</span>
                </div>
              </div>
              
              {service.features && service.features.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">What's Included:</h4>
                  <div className="space-y-1">
                    {service.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book This Service</CardTitle>
              <CardDescription>
                Fill in your details to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Traveler Count */}
                <div>
                  <Label className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    Number of Travelers
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                      disabled={travelerCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                      {travelerCount}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTravelerCount(travelerCount + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Travel Date */}
                <div>
                  <Label htmlFor="travelDate" className="flex items-center mb-2">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Travel Date (Optional)
                  </Label>
                  <Input
                    id="travelDate"
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Traveler Details */}
                <div>
                  <Label className="mb-3 block">Traveler Details</Label>
                  <div className="space-y-4">
                    {travelers.slice(0, travelerCount).map((traveler, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Traveler {index + 1}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`fullName-${index}`}>Full Name *</Label>
                            <Input
                              id={`fullName-${index}`}
                              value={traveler.fullName}
                              onChange={(e) => updateTraveler(index, 'fullName', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`age-${index}`}>Age</Label>
                            <Input
                              id={`age-${index}`}
                              type="number"
                              min="1"
                              max="120"
                              value={traveler.age}
                              onChange={(e) => updateTraveler(index, 'age', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`passport-${index}`}>Passport Number</Label>
                            <Input
                              id={`passport-${index}`}
                              value={traveler.passportNumber}
                              onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`nationality-${index}`}>Nationality</Label>
                            <Input
                              id={`nationality-${index}`}
                              value={traveler.nationality}
                              onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>

                {/* Promo Code */}
                <div>
                  <Label className="mb-2 block">Promo Code</Label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <Badge className="bg-green-600 text-white">{appliedPromo.code}</Badge>
                        <span className="ml-2 text-sm text-green-700">
                          {appliedPromo.discount_percentage}% discount applied
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                      />
                      <Button type="button" variant="outline" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({travelerCount} travelers)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Gateway Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    Payment will be processed via {selectedGateway}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Processing...' : `Book Now - $${finalAmount.toFixed(2)}`}
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
