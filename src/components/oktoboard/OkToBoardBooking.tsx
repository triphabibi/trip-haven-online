import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, CheckCircle, Upload, FileText } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CountryDropdown from '@/components/common/CountryDropdown';

interface OkToBoardService {
  id: string;
  title: string;
  base_price: number;
  processing_fee: number;
  tax_rate: number;
  processing_time: string;
  requirements: string[];
  features: string[];
}

interface OkToBoardBookingProps {
  service: OkToBoardService;
}

const OkToBoardBooking = ({ service }: OkToBoardBookingProps) => {
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    passengerName: '',
    passportNumber: '',
    nationality: '',
    flightNumber: '',
    departureDate: '',
    airline: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [documents, setDocuments] = useState({
    passportFirstPage: null as File | null,
    passportLastPage: null as File | null,
    visa: null as File | null,
    flightBookingPage1: null as File | null,
    flightBookingPage2: null as File | null
  });

  const totalAmount = service.base_price + service.processing_fee + (service.base_price * service.tax_rate);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['passengerName', 'passportNumber', 'nationality', 'flightNumber', 'departureDate', 'email', 'phone'];
    const formValid = requiredFields.every(field => formData[field].trim() !== '');
    const documentsValid = documents.passportFirstPage && documents.visa && documents.flightBookingPage1;
    return formValid && documentsValid;
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleBooking = async () => {
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload required documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Upload documents
      const uploadedDocs: Record<string, string> = {};
      
      if (documents.passportFirstPage) {
        uploadedDocs.passport_first_page = await handleFileUpload(documents.passportFirstPage);
      }
      if (documents.passportLastPage) {
        uploadedDocs.passport_last_page = await handleFileUpload(documents.passportLastPage);
      }
      if (documents.visa) {
        uploadedDocs.visa = await handleFileUpload(documents.visa);
      }
      if (documents.flightBookingPage1) {
        uploadedDocs.flight_booking_page1 = await handleFileUpload(documents.flightBookingPage1);
      }
      if (documents.flightBookingPage2) {
        uploadedDocs.flight_booking_page2 = await handleFileUpload(documents.flightBookingPage2);
      }

      // Create booking in database
      const { data: booking, error } = await supabase
        .from('new_bookings')
        .insert({
          service_id: service.id,
          service_type: 'ok-to-board',
          service_title: service.title,
          customer_name: formData.passengerName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          travel_date: formData.departureDate,
          adults_count: 1,
          children_count: 0,
          infants_count: 0,
          total_amount: totalAmount,
          final_amount: totalAmount,
          base_amount: service.base_price,
          tax_amount: service.base_price * service.tax_rate,
          booking_status: 'pending',
          payment_status: 'pending',
          special_requests: `Flight: ${formData.flightNumber}, Airline: ${formData.airline}, Passport: ${formData.passportNumber}, Nationality: ${formData.nationality}. ${formData.specialRequests}`.trim(),
          gateway_response: { documents: uploadedDocs }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Created!",
        description: "Documents uploaded successfully. Redirecting to payment...",
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

      // Redirect to payment page
      const bookingParams = new URLSearchParams({
        type: 'ok-to-board',
        id: service.id,
        bookingId: booking.id,
        amount: totalAmount.toString(),
        customerName: formData.passengerName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        serviceTitle: service.title
      });

      window.location.href = `/booking-payment?${bookingParams.toString()}`;
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plane className="h-6 w-6" />
          {service.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Clock className="h-3 w-3 mr-1" />
            {service.processing_time}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Guaranteed Approval
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Service Features */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">What's Included:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-blue-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Passenger Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Passenger Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengerName">Full Name (as per passport) *</Label>
              <Input
                id="passengerName"
                value={formData.passengerName}
                onChange={(e) => handleInputChange('passengerName', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Passport Number *</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                placeholder="A1234567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <CountryDropdown
                value={formData.nationality}
                onValueChange={(value) => handleInputChange('nationality', value)}
                placeholder="Select your nationality"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flightNumber">Flight Number *</Label>
              <Input
                id="flightNumber"
                value={formData.flightNumber}
                onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                placeholder="AI101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date *</Label>
              <Input
                id="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airline">Airline *</Label>
              <Input
                id="airline"
                value={formData.airline}
                onChange={(e) => handleInputChange('airline', e.target.value)}
                placeholder="Air India"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+971 50 123 4567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special requirements or additional information..."
              rows={3}
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-900">Required Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passport-first">Passport Copy (First Page) *</Label>
              <Input
                id="passport-first"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocuments(prev => ({ ...prev, passportFirstPage: file }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passport-last">Passport Copy (Last Page)</Label>
              <Input
                id="passport-last"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocuments(prev => ({ ...prev, passportLastPage: file }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visa">Valid Visa *</Label>
              <Input
                id="visa"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocuments(prev => ({ ...prev, visa: file }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flight-booking">Flight Booking Confirmation *</Label>
              <Input
                id="flight-booking"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocuments(prev => ({ ...prev, flightBookingPage1: file }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flight-booking-2">Flight Booking Page 2 (Optional)</Label>
              <Input
                id="flight-booking-2"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocuments(prev => ({ ...prev, flightBookingPage2: file }));
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Document Requirements</h4>
            </div>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Files must be in JPG, PNG, or PDF format</li>
              <li>• Maximum file size: 5MB per document</li>
              <li>• Documents should be clear and readable</li>
              <li>• All required documents must be uploaded before booking</li>
            </ul>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Service Fee:</span>
            <span>{formatPrice(service.base_price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Processing Fee:</span>
            <span>{formatPrice(service.processing_fee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({(service.tax_rate * 100).toFixed(0)}%):</span>
            <span>{formatPrice(service.base_price * service.tax_rate)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span className="text-blue-600">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={loading || !validateForm()}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
        >
          {loading ? 'Processing...' : `Book Now - ${formatPrice(totalAmount)}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment • 24/7 support • Guaranteed approval within {service.processing_time}
        </p>
      </CardContent>
    </Card>
  );
};

export default OkToBoardBooking;