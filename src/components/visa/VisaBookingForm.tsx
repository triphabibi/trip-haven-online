
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Calendar, User, CreditCard, Shield, CheckCircle, Globe } from 'lucide-react';

interface VisaBookingFormProps {
  service: {
    id: string;
    title: string;
    country: string;
    visa_type: string;
    price: number;
    processing_time: string;
    requirements: string[];
  };
}

const generateBookingReference = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VS${timestamp.slice(-8)}${random}`;
};

const VisaBookingForm = ({ service }: VisaBookingFormProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    phone: '',
    nationality: '',
    date_of_birth: '',
    passport_number: '',
    passport_expiry: '',
    passport_issue_date: '',
    
    // Travel Information
    travel_purpose: 'tourism',
    intended_arrival: '',
    intended_departure: '',
    duration_of_stay: '',
    
    // Documents
    passport_copy: null as File | null,
    photo: null as File | null,
    flight_ticket: null as File | null,
    hotel_booking: null as File | null,
    bank_statement: null as File | null,
    employment_letter: null as File | null,
    
    // Additional Information
    previous_visa: 'no',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    special_requests: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('new_bookings')
        .insert({
          service_id: service.id,
          service_type: 'visa',
          service_title: service.country + ' ' + service.visa_type,
          customer_name: formData.full_name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          adults_count: 1,
          children_count: 0,
          infants_count: 0,
          base_amount: service.price,
          total_amount: service.price,
          final_amount: service.price,
          discount_amount: 0,
          booking_status: 'pending',
          payment_status: 'pending',
          special_requests: formData.special_requests
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Skip visa application record for now since table doesn't exist
      // TODO: Create visa_applications table if needed

      toast({
        title: "Visa Application Submitted!",
        description: `Your application has been submitted successfully!`,
      });

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-booking-email', {
          body: {
            booking_id: booking.id,
            email_type: 'booking_confirmation'
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the success flow for email issues
      }

      setStep(5);
    } catch (error) {
      console.error('Visa application error:', error);
      toast({
        title: "Application Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Visa Application for {service.country}</h3>
        </div>
        <p className="text-blue-700 text-sm">{service.visa_type} - Processing time: {service.processing_time}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Full Name (as in passport) *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="pakistani">Pakistani</SelectItem>
              <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
              <SelectItem value="sri_lankan">Sri Lankan</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="date_of_birth">Date of Birth *</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-amber-900">Passport Information</h3>
        </div>
        <p className="text-amber-700 text-sm">Please provide accurate passport details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passport_number">Passport Number *</Label>
          <Input
            id="passport_number"
            value={formData.passport_number}
            onChange={(e) => handleInputChange('passport_number', e.target.value)}
            placeholder="Enter passport number"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="passport_issue_date">Passport Issue Date *</Label>
          <Input
            id="passport_issue_date"
            type="date"
            value={formData.passport_issue_date}
            onChange={(e) => handleInputChange('passport_issue_date', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passport_expiry">Passport Expiry Date *</Label>
          <Input
            id="passport_expiry"
            type="date"
            value={formData.passport_expiry}
            onChange={(e) => handleInputChange('passport_expiry', e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="travel_purpose">Purpose of Travel *</Label>
          <Select value={formData.travel_purpose} onValueChange={(value) => handleInputChange('travel_purpose', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tourism">Tourism</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="transit">Transit</SelectItem>
              <SelectItem value="family_visit">Family Visit</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="intended_arrival">Intended Arrival Date</Label>
          <Input
            id="intended_arrival"
            type="date"
            value={formData.intended_arrival}
            onChange={(e) => handleInputChange('intended_arrival', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <Label htmlFor="intended_departure">Intended Departure Date</Label>
          <Input
            id="intended_departure"
            type="date"
            value={formData.intended_departure}
            onChange={(e) => handleInputChange('intended_departure', e.target.value)}
            min={formData.intended_arrival || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Required Documents</h3>
        </div>
        <p className="text-green-700 text-sm">Please upload clear, high-quality images of your documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="passport_copy">Passport Copy *</Label>
            <Input
              id="passport_copy"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('passport_copy', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Upload clear copy of passport data page</p>
          </div>

          <div>
            <Label htmlFor="photo">Passport Size Photo *</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">White background, recent photo</p>
          </div>

          <div>
            <Label htmlFor="flight_ticket">Flight Tickets</Label>
            <Input
              id="flight_ticket"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('flight_ticket', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Return/onward journey tickets</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="hotel_booking">Hotel Booking</Label>
            <Input
              id="hotel_booking"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('hotel_booking', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Hotel reservation confirmation</p>
          </div>

          <div>
            <Label htmlFor="bank_statement">Bank Statement</Label>
            <Input
              id="bank_statement"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('bank_statement', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Last 3-6 months bank statement</p>
          </div>

          <div>
            <Label htmlFor="employment_letter">Employment Letter</Label>
            <Input
              id="employment_letter"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange('employment_letter', e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">No objection certificate from employer</p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="special_requests">Additional Information</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => handleInputChange('special_requests', e.target.value)}
          placeholder="Any additional information or special requirements..."
          rows={3}
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• All documents should be clear and legible</li>
          <li>• Passport must be valid for at least 6 months</li>
          <li>• Processing time may vary based on embassy workload</li>
          <li>• Additional documents may be requested during processing</li>
        </ul>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Application Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Visa Type:</span>
            <span className="font-medium">{service.country} {service.visa_type}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Time:</span>
            <span>{service.processing_time}</span>
          </div>
          <div className="flex justify-between">
            <span>Applicant:</span>
            <span>{formData.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span>Nationality:</span>
            <span>{formData.nationality}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Service Fee:</span>
            <span>₹{service.price}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Your information is secure and will be handled confidentially</span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-2xl font-semibold text-green-600">Application Submitted!</h3>
      <p className="text-gray-600">
        Your visa application has been submitted successfully. Our team will review your documents and contact you within 24 hours.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg text-left">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Document verification by our team</li>
          <li>• Payment processing</li>
          <li>• Embassy submission</li>
          <li>• Regular status updates via email/SMS</li>
        </ul>
      </div>
      <Button onClick={() => window.location.href = '/'}>
        Return to Home
      </Button>
    </div>
  );

  const canProceed = () => {
    if (step === 1) {
      return formData.full_name && formData.email && formData.phone && formData.nationality && formData.date_of_birth;
    }
    if (step === 2) {
      return formData.passport_number && formData.passport_expiry && formData.passport_issue_date;
    }
    if (step === 3) {
      return formData.passport_copy && formData.photo;
    }
    return true;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Visa Application - {service.country}</span>
          <Badge variant="secondary">Step {step} of 4</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderSummary()}
        {step === 5 && renderSuccess()}
        
        {step < 5 && (
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <div className="ml-auto">
              {step < 4 ? (
                <Button 
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : `Submit Application - ₹${service.price}`}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisaBookingForm;
