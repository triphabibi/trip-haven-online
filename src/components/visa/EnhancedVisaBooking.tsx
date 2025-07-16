import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Users, CreditCard, Phone, Mail, CheckCircle } from 'lucide-react';
import { PaymentGatewaySelector } from '@/components/checkout/PaymentGatewaySelector';

interface VisaService {
  id: string;
  country: string;
  visa_type: string;
  price: number;
  processing_time?: string;
  requirements?: string[];
  description?: string;
  is_featured: boolean;
}

interface TravelerInfo {
  id: string;
  fullName: string;
  passportNumber: string;
  dateOfBirth: string;
  tentativeArrivalDate: string;
  tentativeDepartureDate: string;
  passportFront?: File;
  passportBack?: File;
  clearPhoto?: File;
  returnTicket?: File;
  returnTicketPage2?: File;
}

interface EnhancedVisaBookingProps {
  visa: VisaService;
  onBack: () => void;
}

const EnhancedVisaBooking = ({ visa, onBack }: EnhancedVisaBookingProps) => {
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<'selection' | 'booking_option' | 'traveler_forms' | 'payment' | 'success'>('selection');
  
  // Traveler selection
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  
  // Booking option
  const [bookingOption, setBookingOption] = useState<'fill_and_pay' | 'pay_now' | ''>('');
  
  // Contact info for lazy flow
  const [contactEmail, setContactEmail] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  
  // Traveler forms
  const [travelers, setTravelers] = useState<TravelerInfo[]>([]);
  
  // Promo code
  const [promoCode, setPromoCode] = useState('');
  
  // Booking state
  const [bookingId, setBookingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalTravelers = adultsCount + childrenCount;
  const totalAmount = totalTravelers * visa.price;

  // Initialize traveler forms when needed
  const initializeTravelers = () => {
    const newTravelers: TravelerInfo[] = [];
    
    for (let i = 0; i < adultsCount; i++) {
      newTravelers.push({
        id: `adult-${i + 1}`,
        fullName: '',
        passportNumber: '',
        dateOfBirth: '',
        tentativeArrivalDate: '',
        tentativeDepartureDate: ''
      });
    }
    
    for (let i = 0; i < childrenCount; i++) {
      newTravelers.push({
        id: `child-${i + 1}`,
        fullName: '',
        passportNumber: '',
        dateOfBirth: '',
        tentativeArrivalDate: '',
        tentativeDepartureDate: ''
      });
    }
    
    setTravelers(newTravelers);
  };

  const handleFileUpload = (travelerId: string, fileType: keyof TravelerInfo, file: File) => {
    setTravelers(prev => prev.map(traveler => 
      traveler.id === travelerId 
        ? { ...traveler, [fileType]: file }
        : traveler
    ));
  };

  const updateTravelerField = (travelerId: string, field: keyof TravelerInfo, value: string) => {
    setTravelers(prev => prev.map(traveler => 
      traveler.id === travelerId 
        ? { ...traveler, [field]: value }
        : traveler
    ));
  };

  const validateTravelerForms = () => {
    for (const traveler of travelers) {
      if (!traveler.fullName || !traveler.passportNumber || !traveler.dateOfBirth || 
          !traveler.tentativeArrivalDate || !traveler.tentativeDepartureDate || 
          !traveler.passportFront || !traveler.clearPhoto || !traveler.returnTicket) {
        return false;
      }
    }
    return true;
  };

  const handleSubmitFullApplication = async () => {
    if (!validateTravelerForms()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields and upload required documents for all travelers",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking first
      const bookingData = {
        service_id: visa.id,
        service_type: 'visa',
        service_title: `${visa.country} ${visa.visa_type} Visa`,
        customer_name: travelers[0].fullName,
        customer_email: contactEmail,
        customer_phone: contactWhatsapp,
        adults_count: adultsCount,
        children_count: childrenCount,
        total_amount: totalAmount,
        base_amount: totalAmount,
        final_amount: totalAmount,
        travel_date: travelers[0].tentativeArrivalDate
      };

      const { data: booking, error: bookingError } = await supabase
        .from('new_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Save traveler details
      const travelerData = travelers.map(traveler => ({
        booking_id: booking.id,
        first_name: traveler.fullName.split(' ')[0],
        last_name: traveler.fullName.split(' ').slice(1).join(' ') || traveler.fullName.split(' ')[0],
        traveler_type: traveler.id.startsWith('adult') ? 'adult' : 'child',
        passport_number: traveler.passportNumber,
        date_of_birth: traveler.dateOfBirth
      }));

      const { error: travelersError } = await supabase
        .from('booking_travelers')
        .insert(travelerData);

      if (travelersError) throw travelersError;

      setBookingId(booking.id);
      setCurrentStep('payment');

      toast({
        title: "Application Submitted",
        description: "Your visa application details have been saved. Please proceed with payment.",
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayNowBooking = async () => {
    if (!contactEmail || !contactWhatsapp) {
      toast({
        title: "Contact Information Required",
        description: "Please provide your email and WhatsApp number",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        service_id: visa.id,
        service_type: 'visa',
        service_title: `${visa.country} ${visa.visa_type} Visa`,
        customer_name: 'Documents Pending',
        customer_email: contactEmail,
        customer_phone: contactWhatsapp,
        adults_count: adultsCount,
        children_count: childrenCount,
        total_amount: totalAmount,
        base_amount: totalAmount,
        final_amount: totalAmount,
        booking_status: 'pending',
        special_requests: 'Pay Now - Documents to be submitted later'
      };

      const { data: booking, error: bookingError } = await supabase
        .from('new_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      setBookingId(booking.id);
      setCurrentStep('payment');

      toast({
        title: "Booking Created",
        description: "Please proceed with payment. Document submission details will be sent to your email.",
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('success');
    toast({
      title: "Payment Successful",
      description: "Your visa application has been submitted successfully!",
    });
  };

  // Step 1: Traveler Selection
  if (currentStep === 'selection') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              {visa.country} {visa.visa_type} Visa Application
            </CardTitle>
            <p className="text-muted-foreground">Step 1: How many travelers?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adults">No. of Adults (required)</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  max="10"
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                  className="text-center text-lg font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="children">No. of Children (optional)</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  max="10"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                  className="text-center text-lg font-semibold"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Travelers:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalTravelers} {totalTravelers === 1 ? 'person' : 'people'}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(totalAmount, 'USD')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep('booking_option')} 
                className="flex-1"
                disabled={totalTravelers === 0}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Booking Option
  if (currentStep === 'booking_option') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Choose Booking Option</CardTitle>
            <p className="text-muted-foreground">How would you like to proceed?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={bookingOption} onValueChange={setBookingOption as any}>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fill_and_pay" id="fill_and_pay" />
                    <Label htmlFor="fill_and_pay" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Fill Out Application & Pay</div>
                          <div className="text-sm text-muted-foreground">
                            Complete all traveler details and upload documents now
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay_now" id="pay_now" />
                    <Label htmlFor="pay_now" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Pay Online Now</div>
                          <div className="text-sm text-muted-foreground">
                            Quick payment - submit documents later via email/WhatsApp
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('selection')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (bookingOption === 'fill_and_pay') {
                    initializeTravelers();
                    setCurrentStep('traveler_forms');
                  } else if (bookingOption === 'pay_now') {
                    setCurrentStep('payment');
                  }
                }} 
                className="flex-1"
                disabled={!bookingOption}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Traveler Forms (only for fill_and_pay option)
  if (currentStep === 'traveler_forms') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Traveler Information</CardTitle>
            <p className="text-muted-foreground">Please fill details for all travelers</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {travelers.map((traveler, index) => (
              <div key={traveler.id} className="border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-blue-600">
                  {traveler.id.startsWith('adult') ? 'Adult' : 'Child'} {index + 1}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={traveler.fullName}
                      onChange={(e) => updateTravelerField(traveler.id, 'fullName', e.target.value)}
                      placeholder="As per passport"
                    />
                  </div>
                  <div>
                    <Label>Passport Number *</Label>
                    <Input
                      value={traveler.passportNumber}
                      onChange={(e) => updateTravelerField(traveler.id, 'passportNumber', e.target.value)}
                      placeholder="Passport number"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={traveler.dateOfBirth}
                      onChange={(e) => updateTravelerField(traveler.id, 'dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tentative Arrival Date *</Label>
                    <Input
                      type="date"
                      value={traveler.tentativeArrivalDate}
                      onChange={(e) => updateTravelerField(traveler.id, 'tentativeArrivalDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tentative Departure Date *</Label>
                    <Input
                      type="date"
                      value={traveler.tentativeDepartureDate}
                      onChange={(e) => updateTravelerField(traveler.id, 'tentativeDepartureDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Passport Front Page *</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(traveler.id, 'passportFront', file);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Passport Back Page</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(traveler.id, 'passportBack', file);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Clear Photo *</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(traveler.id, 'clearPhoto', file);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Return Ticket *</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(traveler.id, 'returnTicket', file);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Return Ticket Page 2</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(traveler.id, 'returnTicketPage2', file);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4">
              <div>
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label>WhatsApp Number *</Label>
                <Input
                  type="tel"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <Label>Promo Code (optional)</Label>
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalAmount, 'USD')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('booking_option')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmitFullApplication}
                className="flex-1"
                disabled={isSubmitting || !contactEmail || !contactWhatsapp}
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Pay'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment Step
  if (currentStep === 'payment') {
    // For pay_now option, show contact form first
    if (bookingOption === 'pay_now' && !bookingId) {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-green-600" />
                Contact Information
              </CardTitle>
              <p className="text-muted-foreground">We'll send document submission details to your email</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 mb-2">
                      ✅ Thank you for choosing Pay Now.
                    </p>
                    <p className="text-green-700 mb-2">
                      Please send your documents after payment via:
                    </p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        📧 Email: visa@triphabibi.com
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        📲 WhatsApp: +91 98765 43210
                      </p>
                    </div>
                    <p className="text-green-600 text-xs mt-2">
                      This info will also be sent to your email after payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalAmount, 'USD')}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentStep('booking_option')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handlePayNowBooking}
                  className="flex-1"
                  disabled={isSubmitting || !contactEmail || !contactWhatsapp}
                >
                  {isSubmitting ? 'Creating...' : 'Proceed to Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show payment gateway
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
          <p className="text-muted-foreground">
            {visa.country} {visa.visa_type} Visa - {totalTravelers} {totalTravelers === 1 ? 'traveler' : 'travelers'}
          </p>
        </div>

        <PaymentGatewaySelector
          amount={totalAmount}
          bookingId={bookingId}
          customerName={bookingOption === 'fill_and_pay' ? travelers[0]?.fullName || 'Visa Applicant' : 'Documents Pending'}
          customerEmail={contactEmail}
          customerPhone={contactWhatsapp}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={(error) => {
            toast({
              title: "Payment Failed",
              description: error,
              variant: "destructive"
            });
          }}
        />
      </div>
    );
  }

  // Success Step
  if (currentStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your {visa.country} {visa.visa_type} visa application has been received and payment confirmed.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <ul className="text-sm space-y-1 text-left">
                <li>• Confirmation email sent to {contactEmail}</li>
                <li>• Admin notification sent for processing</li>
                <li>• You'll receive updates on your application status</li>
                {bookingOption === 'pay_now' && (
                  <li>• Please submit documents via email/WhatsApp as instructed</li>
                )}
              </ul>
            </div>

            <Button onClick={onBack} className="w-full">
              Back to Visa Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default EnhancedVisaBooking;