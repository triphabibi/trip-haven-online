
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Users, Phone, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateBooking, BookingData, TravelerData } from '@/hooks/useBookings';
import PaymentGatewaySelector from '@/components/common/PaymentGatewaySelector';

interface UnifiedBookingFormProps {
  serviceType: 'tour' | 'package' | 'ticket' | 'visa' | 'transfer';
  serviceId: string;
  serviceTitle: string;
  priceAdult: number;
  priceChild?: number;
  priceInfant?: number;
  availableTimes?: string[];
  languages?: string[];
  requiresPickup?: boolean;
}

const UnifiedBookingForm = ({
  serviceType,
  serviceId,
  serviceTitle,
  priceAdult,
  priceChild = 0,
  priceInfant = 0,
  availableTimes = [],
  languages = ['English'],
  requiresPickup = false
}: UnifiedBookingFormProps) => {
  const [step, setStep] = useState<'booking' | 'travelers' | 'payment'>('booking');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedGateway, setSelectedGateway] = useState('');
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [travelers, setTravelers] = useState<TravelerData[]>([]);

  const createBooking = useCreateBooking();

  const totalAmount = (adults * priceAdult) + (children * priceChild) + (infants * priceInfant);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adults + children + infants > 1 && serviceType !== 'visa') {
      setStep('travelers');
      initializeTravelers();
    } else {
      setStep('payment');
    }
  };

  const initializeTravelers = () => {
    const newTravelers: TravelerData[] = [];
    
    for (let i = 0; i < adults; i++) {
      newTravelers.push({
        traveler_type: 'adult',
        first_name: '',
        last_name: '',
        title: 'Mr'
      });
    }
    
    for (let i = 0; i < children; i++) {
      newTravelers.push({
        traveler_type: 'child',
        first_name: '',
        last_name: ''
      });
    }
    
    for (let i = 0; i < infants; i++) {
      newTravelers.push({
        traveler_type: 'infant',
        first_name: '',
        last_name: ''
      });
    }
    
    setTravelers(newTravelers);
  };

  const updateTraveler = (index: number, field: keyof TravelerData, value: string) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
    setTravelers(updatedTravelers);
  };

  const handleFinalBooking = async () => {
    const bookingData: BookingData = {
      service_type: serviceType,
      service_id: serviceId,
      service_title: serviceTitle,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      travel_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
      travel_time: selectedTime,
      adults_count: adults,
      children_count: children,
      infants_count: infants,
      base_amount: totalAmount,
      total_amount: totalAmount,
      special_requests: specialRequests,
      pickup_location: pickupLocation,
      selected_language: selectedLanguage
    };

    try {
      await createBooking.mutateAsync({ bookingData, travelers });
      // Handle payment gateway redirect here
      handlePayment();
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handlePayment = () => {
    if (selectedGateway === 'razorpay') {
      const options = {
        key: 'rzp_test_9WaeLLJnOFJCBz',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'TripHabibi',
        description: serviceTitle,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          window.location.href = '/booking-confirmation?status=success';
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } else if (selectedGateway === 'cash_on_arrival') {
      window.location.href = '/booking-confirmation?status=success';
    }
  };

  if (step === 'payment') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{serviceTitle}</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Adults:</strong> {adults}</p>
                  {children > 0 && <p><strong>Children:</strong> {children}</p>}
                  {infants > 0 && <p><strong>Infants:</strong> {infants}</p>}
                  {selectedDate && <p><strong>Date:</strong> {format(selectedDate, 'PPP')}</p>}
                  {selectedTime && <p><strong>Time:</strong> {selectedTime}</p>}
                </div>
                <div>
                  <p><strong>Customer:</strong> {customerName}</p>
                  <p><strong>Email:</strong> {customerEmail}</p>
                  <p><strong>Phone:</strong> {customerPhone}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">AED {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <PaymentGatewaySelector
          onGatewaySelect={setSelectedGateway}
          onProceedToPayment={handleFinalBooking}
          selectedGateway={selectedGateway}
          amount={totalAmount}
        />
      </div>
    );
  }

  if (step === 'travelers') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Traveler Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {travelers.map((traveler, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-4">
              <h4 className="font-semibold capitalize">
                {traveler.traveler_type} {index + 1}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {traveler.traveler_type === 'adult' && (
                  <div>
                    <Label>Title</Label>
                    <Select 
                      value={traveler.title} 
                      onValueChange={(value) => updateTraveler(index, 'title', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={traveler.first_name}
                    onChange={(e) => updateTraveler(index, 'first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={traveler.last_name}
                    onChange={(e) => updateTraveler(index, 'last_name', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep('booking')}>
              Back
            </Button>
            <Button onClick={() => setStep('payment')} className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Book {serviceTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Travel Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Travel Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Adults *</Label>
                <Select value={adults.toString()} onValueChange={(v) => setAdults(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Children</Label>
                <Select value={children.toString()} onValueChange={(v) => setChildren(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Infants</Label>
                <Select value={infants.toString()} onValueChange={(v) => setInfants(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3].map(n => (
                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {serviceType !== 'visa' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {availableTimes.length > 0 && (
                  <div>
                    <Label>Preferred Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {languages.length > 1 && (
              <div>
                <Label>Preferred Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {requiresPickup && (
              <div>
                <Label>Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter your pickup location"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <Label>Special Requests</Label>
            <Textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special requirements or requests..."
              rows={3}
            />
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Adults ({adults} × AED {priceAdult})</span>
              <span>AED {(adults * priceAdult).toFixed(2)}</span>
            </div>
            {children > 0 && (
              <div className="flex justify-between">
                <span>Children ({children} × AED {priceChild})</span>
                <span>AED {(children * priceChild).toFixed(2)}</span>
              </div>
            )}
            {infants > 0 && (
              <div className="flex justify-between">
                <span>Infants ({infants} × AED {priceInfant})</span>
                <span>AED {(infants * priceInfant).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">AED {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg" disabled={createBooking.isPending}>
            {createBooking.isPending ? 'Processing...' : 'Continue to Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnifiedBookingForm;
