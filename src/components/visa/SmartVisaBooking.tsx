
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Upload, Users, User, Mail, Phone, FileText, Calendar, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';

interface SmartVisaBookingProps {
  visa: {
    id: string;
    country: string;
    visa_type: string;
    price: number;
  };
}

const SmartVisaBooking = ({ visa }: SmartVisaBookingProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [bookingData, setBookingData] = useState({
    // Primary Contact
    fullName: '',
    email: '',
    mobile: '',
    
    // Visa Details
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    passportExpiry: '',
    passportIssueDate: '',
    placeOfBirth: '',
    
    // Travel Information
    purposeOfVisit: '',
    intendedTravelDate: '',
    durationOfStay: '',
    previousVisits: '',
    
    // Additional Information
    occupation: '',
    employer: '',
    monthlyIncome: '',
    maritalStatus: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: '',
    
    // Documents
    hasPassportCopy: false,
    hasPhotograph: false,
    hasFinancialDocs: false,
    additionalDocuments: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalTravelers = travelers.adults + travelers.children;
  const totalPrice = totalTravelers * visa.price;

  const nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali', 'Afghan',
    'American', 'British', 'Canadian', 'Australian', 'German', 'French',
    'Italian', 'Spanish', 'Russian', 'Chinese', 'Japanese', 'Korean',
    'Filipino', 'Indonesian', 'Malaysian', 'Thai', 'Vietnamese', 'Other'
  ];

  const purposeOptions = [
    'Tourism', 'Business', 'Family Visit', 'Medical Treatment', 
    'Conference/Meeting', 'Education', 'Transit', 'Other'
  ];

  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!bookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!bookingData.email.trim()) newErrors.email = 'Email is required';
    if (!bookingData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!bookingData.nationality) newErrors.nationality = 'Nationality is required';
    if (!bookingData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!bookingData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!bookingData.passportExpiry) newErrors.passportExpiry = 'Passport expiry is required';
    if (!bookingData.purposeOfVisit) newErrors.purposeOfVisit = 'Purpose of visit is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = () => {
    if (validateForm()) {
      const queryParams = new URLSearchParams({
        type: 'visa',
        id: visa.id,
        adults: travelers.adults.toString(),
        children: travelers.children.toString(),
        name: bookingData.fullName,
        email: bookingData.email,
        mobile: bookingData.mobile,
        nationality: bookingData.nationality,
        passport: bookingData.passportNumber,
        dob: bookingData.dateOfBirth,
        expiry: bookingData.passportExpiry,
        purpose: bookingData.purposeOfVisit,
        amount: totalPrice.toString()
      });

      navigate(`/booking?${queryParams.toString()}`);
      
      toast({
        title: "Processing Visa Application",
        description: "Redirecting to payment gateway...",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4">
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl text-center font-bold">
            Apply for {visa.country} {visa.visa_type}
          </CardTitle>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{formatPrice(totalPrice)}</div>
            <div className="text-white/80 text-xs sm:text-sm">Total for {totalTravelers} travelers</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white max-h-96 sm:max-h-none overflow-y-auto">
          {/* Travelers Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 font-medium text-gray-700 text-sm sm:text-base">
              <Users className="h-4 w-4" />
              Number of Travelers
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Adults</div>
                  <div className="text-xs sm:text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                    disabled={travelers.adults <= 1}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base">{travelers.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: prev.adults + 1 }))}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Children</div>
                  <div className="text-xs sm:text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={travelers.children <= 0}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center font-medium text-gray-900 text-sm sm:text-base">{travelers.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: prev.children + 1 }))}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white border-gray-300"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Contact Information */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Primary Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                  Full Name *
                </Label>
                <Input
                  value={bookingData.fullName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name as per passport"
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                  Mobile Number *
                </Label>
                <Input
                  type="tel"
                  value={bookingData.mobile}
                  onChange={(e) => setBookingData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter mobile number"
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.mobile ? 'border-red-500' : ''}`}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </div>

          {/* Passport & Personal Details */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Passport & Personal Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Nationality *</Label>
                <Select 
                  value={bookingData.nationality} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, nationality: value }))}
                >
                  <SelectTrigger className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.nationality ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto z-50">
                    {nationalities.map((nat) => (
                      <SelectItem key={nat} value={nat} className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-2 px-3 text-xs sm:text-base">
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Passport Number *</Label>
                <Input
                  value={bookingData.passportNumber}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="Enter passport number"
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.passportNumber ? 'border-red-500' : ''}`}
                />
                {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Date of Birth *</Label>
                <Input
                  type="date"
                  value={bookingData.dateOfBirth}
                  onChange={(e) => setBookingData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Passport Expiry *</Label>
                <Input
                  type="date"
                  value={bookingData.passportExpiry}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportExpiry: e.target.value }))}
                  className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.passportExpiry ? 'border-red-500' : ''}`}
                />
                {errors.passportExpiry && <p className="text-red-500 text-xs mt-1">{errors.passportExpiry}</p>}
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Travel Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Purpose of Visit *</Label>
                <Select 
                  value={bookingData.purposeOfVisit} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, purposeOfVisit: value }))}
                >
                  <SelectTrigger className={`h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base ${errors.purposeOfVisit ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto z-50">
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose} className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-2 px-3 text-xs sm:text-base">
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.purposeOfVisit && <p className="text-red-500 text-xs mt-1">{errors.purposeOfVisit}</p>}
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Intended Travel Date</Label>
                <Input
                  type="date"
                  value={bookingData.intendedTravelDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, intendedTravelDate: e.target.value }))}
                  className="h-10 sm:h-12 bg-white border-gray-300 text-xs sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs sm:text-sm font-medium text-gray-700">Special Requests or Notes</Label>
            <Textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requirements, additional information, or questions..."
              className="min-h-16 sm:min-h-20 bg-white border-gray-300 text-xs sm:text-base"
            />
          </div>

          {/* Document Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-xs sm:text-sm">
              📧 Required documents will be collected via email/WhatsApp after booking confirmation. 
              Our visa experts will guide you through the complete process.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleBooking}
            className="w-full h-10 sm:h-12 md:h-14 text-xs sm:text-base md:text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            Apply Now - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartVisaBooking;
