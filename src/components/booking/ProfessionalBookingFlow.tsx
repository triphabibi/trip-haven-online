
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, CreditCard, CheckCircle, User, Calendar, MapPin } from 'lucide-react';
import ModularPaymentGateway from './ModularPaymentGateway';

interface BookingData {
  serviceId: string;
  serviceType: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
}

interface TravelerData {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  specialRequirements: string;
  type: 'adult' | 'child' | 'infant';
}

interface ProfessionalBookingFlowProps {
  bookingData: BookingData;
  onComplete?: () => void;
}

const ProfessionalBookingFlow = ({ bookingData, onComplete }: ProfessionalBookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    travelDate: '',
    pickupLocation: '',
    specialRequests: ''
  });

  const [travelers, setTravelers] = useState<TravelerData[]>([]);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  const calculatePricing = () => {
    const adultTotal = bookingData.priceAdult * customerData.adultsCount;
    const childTotal = bookingData.priceChild * customerData.childrenCount;
    const infantTotal = bookingData.priceInfant * customerData.infantsCount;
    const subtotal = adultTotal + childTotal + infantTotal;
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      breakdown: {
        adults: { count: customerData.adultsCount, price: bookingData.priceAdult, total: adultTotal },
        children: { count: customerData.childrenCount, price: bookingData.priceChild, total: childTotal },
        infants: { count: customerData.infantsCount, price: bookingData.priceInfant, total: infantTotal }
      }
    };
  };

  const generateTravelerForms = () => {
    const totalTravelers = customerData.adultsCount + customerData.childrenCount + customerData.infantsCount;
    const newTravelers: TravelerData[] = [];

    // Adults
    for (let i = 0; i < customerData.adultsCount; i++) {
      newTravelers.push({
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        specialRequirements: '',
        type: 'adult'
      });
    }

    // Children
    for (let i = 0; i < customerData.childrenCount; i++) {
      newTravelers.push({
        title: 'Master',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        specialRequirements: '',
        type: 'child'
      });
    }

    // Infants
    for (let i = 0; i < customerData.infantsCount; i++) {
      newTravelers.push({
        title: 'Baby',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        specialRequirements: '',
        type: 'infant'
      });
    }

    setTravelers(newTravelers);
  };

  const handleStepChange = (step: string) => {
    if (step === 'travelers' && travelers.length === 0) {
      generateTravelerForms();
    }
    setCurrentStep(step);
  };

  const createBooking = async () => {
    setLoading(true);
    
    try {
      const pricing = calculatePricing();
      
      const { data: booking, error: bookingError } = await supabase
        .from('new_bookings')
        .insert({
          service_type: bookingData.serviceType,
          service_id: bookingData.serviceId,
          service_title: bookingData.serviceTitle,
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          adults_count: customerData.adultsCount,
          children_count: customerData.childrenCount,
          infants_count: customerData.infantsCount,
          travel_date: customerData.travelDate || null,
          pickup_location: customerData.pickupLocation || null,
          special_requests: customerData.specialRequests || null,
          base_amount: pricing.subtotal,
          tax_amount: pricing.tax,
          total_amount: pricing.total,
          final_amount: pricing.total,
          booking_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Insert traveler details
      if (travelers.length > 0) {
        const travelerInserts = travelers.map(traveler => ({
          booking_id: booking.id,
          traveler_type: traveler.type,
          title: traveler.title,
          first_name: traveler.firstName,
          last_name: traveler.lastName,
          date_of_birth: traveler.dateOfBirth || null,
          gender: traveler.gender,
          nationality: traveler.nationality || null,
          passport_number: traveler.passportNumber || null,
          passport_expiry: traveler.passportExpiry || null,
          special_requirements: traveler.specialRequirements || null
        }));

        const { error: travelersError } = await supabase
          .from('booking_travelers')
          .insert(travelerInserts);

        if (travelersError) throw travelersError;
      }

      setCreatedBookingId(booking.id);
      setCurrentStep('payment');
      
      toast({
        title: "Booking Created!",
        description: `Booking reference: ${booking.booking_reference}`,
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string, gateway: string) => {
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
    });
    
    navigate(`/booking-confirmation/${createdBookingId}`);
    onComplete?.();
  };

  const pricing = calculatePricing();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{bookingData.serviceTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={handleStepChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="travelers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Travelers</span>
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        placeholder="+971 50 123 4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Group Size
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Adults</Label>
                        <Select 
                          value={customerData.adultsCount.toString()} 
                          onValueChange={(value) => setCustomerData({ ...customerData, adultsCount: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Children</Label>
                        <Select 
                          value={customerData.childrenCount.toString()} 
                          onValueChange={(value) => setCustomerData({ ...customerData, childrenCount: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Infants</Label>
                        <Select 
                          value={customerData.infantsCount.toString()} 
                          onValueChange={(value) => setCustomerData({ ...customerData, infantsCount: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3].map(num => (
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
                        value={customerData.travelDate}
                        onChange={(e) => setCustomerData({ ...customerData, travelDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                        id="pickupLocation"
                        value={customerData.pickupLocation}
                        onChange={(e) => setCustomerData({ ...customerData, pickupLocation: e.target.value })}
                        placeholder="Hotel name or address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={customerData.specialRequests}
                        onChange={(e) => setCustomerData({ ...customerData, specialRequests: e.target.value })}
                        placeholder="Any special requirements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <div className="text-lg font-semibold">
                  Total: AED {pricing.total.toFixed(2)}
                </div>
                <Button onClick={() => handleStepChange('travelers')}>
                  Next: Traveler Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="travelers" className="space-y-6">
              <div className="grid gap-6">
                {travelers.map((traveler, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        {traveler.type} {index + 1} Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Select 
                            value={traveler.title} 
                            onValueChange={(value) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].title = value;
                              setTravelers(updatedTravelers);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Mrs">Mrs</SelectItem>
                              <SelectItem value="Ms">Ms</SelectItem>
                              <SelectItem value="Master">Master</SelectItem>
                              <SelectItem value="Baby">Baby</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>First Name *</Label>
                          <Input
                            value={traveler.firstName}
                            onChange={(e) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].firstName = e.target.value;
                              setTravelers(updatedTravelers);
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label>Last Name *</Label>
                          <Input
                            value={traveler.lastName}
                            onChange={(e) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].lastName = e.target.value;
                              setTravelers(updatedTravelers);
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].dateOfBirth = e.target.value;
                              setTravelers(updatedTravelers);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Gender</Label>
                          <Select 
                            value={traveler.gender} 
                            onValueChange={(value) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].gender = value;
                              setTravelers(updatedTravelers);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Nationality</Label>
                          <Input
                            value={traveler.nationality}
                            onChange={(e) => {
                              const updatedTravelers = [...travelers];
                              updatedTravelers[index].nationality = e.target.value;
                              setTravelers(updatedTravelers);
                            }}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleStepChange('details')}>
                  Back
                </Button>
                <Button onClick={() => handleStepChange('summary')}>
                  Review Booking
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{bookingData.serviceTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {customerData.adultsCount} Adults, {customerData.childrenCount} Children, {customerData.infantsCount} Infants
                      </p>
                    </div>
                    <div>
                      <p><strong>Customer:</strong> {customerData.name}</p>
                      <p><strong>Email:</strong> {customerData.email}</p>
                      <p><strong>Phone:</strong> {customerData.phone}</p>
                    </div>
                    {customerData.travelDate && (
                      <p><strong>Travel Date:</strong> {customerData.travelDate}</p>
                    )}
                    {customerData.pickupLocation && (
                      <p><strong>Pickup:</strong> {customerData.pickupLocation}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Price Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pricing.breakdown.adults.count > 0 && (
                      <div className="flex justify-between">
                        <span>Adults ({pricing.breakdown.adults.count})</span>
                        <span>AED {pricing.breakdown.adults.total.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.breakdown.children.count > 0 && (
                      <div className="flex justify-between">
                        <span>Children ({pricing.breakdown.children.count})</span>
                        <span>AED {pricing.breakdown.children.total.toFixed(2)}</span>
                      </div>
                    )}
                    {pricing.breakdown.infants.count > 0 && (
                      <div className="flex justify-between">
                        <span>Infants ({pricing.breakdown.infants.count})</span>
                        <span>AED {pricing.breakdown.infants.total.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>AED {pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>AED {pricing.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>AED {pricing.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => handleStepChange('travelers')}>
                  Back
                </Button>
                <Button onClick={createBooking} disabled={loading}>
                  {loading ? 'Creating Booking...' : 'Proceed to Payment'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="payment">
              {createdBookingId && (
                <ModularPaymentGateway
                  bookingId={createdBookingId}
                  amount={pricing.total}
                  customerName={customerData.name}
                  customerEmail={customerData.email}
                  customerPhone={customerData.phone}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    toast({
                      title: "Payment Failed",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalBookingFlow;
