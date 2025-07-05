
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Users, User, Mail, Phone, FileText, Calendar, Globe, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedVisaBookingProps {
  visa: {
    id: string;
    country: string;
    visa_type: string;
    price: number;
  };
}

const EnhancedVisaBooking = ({ visa }: EnhancedVisaBookingProps) => {
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
    passportIssuePlace: '',
    placeOfBirth: '',
    
    // Travel Information
    purposeOfVisit: '',
    intendedTravelDate: '',
    durationOfStay: '',
    previousVisits: '',
    accommodationDetails: '',
    
    // Personal Information
    occupation: '',
    employer: '',
    monthlyIncome: '',
    maritalStatus: '',
    fatherName: '',
    motherName: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Address Information
    currentAddress: '',
    permanentAddress: '',
    
    // Additional Information
    specialRequests: '',
    
    // Travel History
    visitedCountries: '',
    rejectedVisas: '',
    
    // Financial Information
    bankStatement: false,
    incomeProof: false,
    
    // Documents Checklist
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
    'Conference/Meeting', 'Education', 'Transit', 'Employment', 'Other'
  ];

  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!bookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!bookingData.email.trim()) newErrors.email = 'Email is required';
    if (!bookingData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!bookingData.nationality) newErrors.nationality = 'Nationality is required';
    if (!bookingData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!bookingData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!bookingData.passportExpiry) newErrors.passportExpiry = 'Passport expiry is required';
    if (!bookingData.purposeOfVisit) newErrors.purposeOfVisit = 'Purpose of visit is required';
    if (!bookingData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!bookingData.currentAddress.trim()) newErrors.currentAddress = 'Current address is required';
    
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
        description: "Redirecting to payment options...",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-2xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
          <CardTitle className="text-2xl text-center font-bold">
            Apply for {visa.country} {visa.visa_type}
          </CardTitle>
          <div className="text-center mt-2">
            <div className="text-3xl font-bold">{formatPrice(totalPrice)}</div>
            <div className="text-white/80">Total for {totalTravelers} travelers</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8 bg-white max-h-[80vh] overflow-y-auto">
          {/* Travelers Section */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
              <Users className="h-5 w-5" />
              Number of Travelers
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">Adults (18+)</div>
                  <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                    disabled={travelers.adults <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{travelers.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: prev.adults + 1 }))}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">Children (Under 18)</div>
                  <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={travelers.children <= 0}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{travelers.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: prev.children + 1 }))}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Contact Information */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <User className="h-5 w-5" />
              Primary Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">
                  Full Name (As per Passport) *
                </Label>
                <Input
                  value={bookingData.fullName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name as per passport"
                  className={`h-12 ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">
                  Mobile Number *
                </Label>
                <Input
                  type="tel"
                  value={bookingData.mobile}
                  onChange={(e) => setBookingData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter mobile number with country code"
                  className={`h-12 ${errors.mobile ? 'border-red-500' : ''}`}
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Occupation *</Label>
                <Input
                  value={bookingData.occupation}
                  onChange={(e) => setBookingData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Enter your occupation"
                  className={`h-12 ${errors.occupation ? 'border-red-500' : ''}`}
                />
                {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
              </div>
            </div>
          </div>

          {/* Passport & Personal Details */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Passport & Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Nationality *</Label>
                <Select 
                  value={bookingData.nationality} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, nationality: value }))}
                >
                  <SelectTrigger className={`h-12 ${errors.nationality ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalities.map((nat) => (
                      <SelectItem key={nat} value={nat}>{nat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Passport Number *</Label>
                <Input
                  value={bookingData.passportNumber}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportNumber: e.target.value }))}
                  placeholder="Enter passport number"
                  className={`h-12 ${errors.passportNumber ? 'border-red-500' : ''}`}
                />
                {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Date of Birth *</Label>
                <Input
                  type="date"
                  value={bookingData.dateOfBirth}
                  onChange={(e) => setBookingData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={`h-12 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Passport Expiry Date *</Label>
                <Input
                  type="date"
                  value={bookingData.passportExpiry}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportExpiry: e.target.value }))}
                  className={`h-12 ${errors.passportExpiry ? 'border-red-500' : ''}`}
                />
                {errors.passportExpiry && <p className="text-red-500 text-sm mt-1">{errors.passportExpiry}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Passport Issue Date</Label>
                <Input
                  type="date"
                  value={bookingData.passportIssueDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportIssueDate: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Passport Issue Place</Label>
                <Input
                  value={bookingData.passportIssuePlace}
                  onChange={(e) => setBookingData(prev => ({ ...prev, passportIssuePlace: e.target.value }))}
                  placeholder="Enter passport issue place"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Place of Birth</Label>
                <Input
                  value={bookingData.placeOfBirth}
                  onChange={(e) => setBookingData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                  placeholder="Enter place of birth"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Marital Status</Label>
                <Select 
                  value={bookingData.maritalStatus} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, maritalStatus: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Travel Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Purpose of Visit *</Label>
                <Select 
                  value={bookingData.purposeOfVisit} 
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, purposeOfVisit: value }))}
                >
                  <SelectTrigger className={`h-12 ${errors.purposeOfVisit ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.purposeOfVisit && <p className="text-red-500 text-sm mt-1">{errors.purposeOfVisit}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Intended Travel Date</Label>
                <Input
                  type="date"
                  value={bookingData.intendedTravelDate}
                  onChange={(e) => setBookingData(prev => ({ ...prev, intendedTravelDate: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Duration of Stay</Label>
                <Input
                  value={bookingData.durationOfStay}
                  onChange={(e) => setBookingData(prev => ({ ...prev, durationOfStay: e.target.value }))}
                  placeholder="e.g., 7 days, 2 weeks"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Previous Visits to {visa.country}</Label>
                <Input
                  value={bookingData.previousVisits}
                  onChange={(e) => setBookingData(prev => ({ ...prev, previousVisits: e.target.value }))}
                  placeholder="e.g., First time, 2019, Multiple times"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Current Address *</Label>
                <Textarea
                  value={bookingData.currentAddress}
                  onChange={(e) => setBookingData(prev => ({ ...prev, currentAddress: e.target.value }))}
                  placeholder="Enter your current residential address"
                  className={`min-h-20 ${errors.currentAddress ? 'border-red-500' : ''}`}
                />
                {errors.currentAddress && <p className="text-red-500 text-sm mt-1">{errors.currentAddress}</p>}
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Permanent Address</Label>
                <Textarea
                  value={bookingData.permanentAddress}
                  onChange={(e) => setBookingData(prev => ({ ...prev, permanentAddress: e.target.value }))}
                  placeholder="Enter permanent address (if different from current)"
                  className="min-h-20"
                />
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl">Family Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Father's Full Name</Label>
                <Input
                  value={bookingData.fatherName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, fatherName: e.target.value }))}
                  placeholder="Enter father's full name"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Mother's Full Name</Label>
                <Input
                  value={bookingData.motherName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, motherName: e.target.value }))}
                  placeholder="Enter mother's full name"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Contact Name</Label>
                <Input
                  value={bookingData.emergencyContactName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  placeholder="Emergency contact name"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Contact Phone</Label>
                <Input
                  type="tel"
                  value={bookingData.emergencyContactPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  placeholder="Emergency contact phone"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Relationship</Label>
                <Input
                  value={bookingData.emergencyContactRelation}
                  onChange={(e) => setBookingData(prev => ({ ...prev, emergencyContactRelation: e.target.value }))}
                  placeholder="e.g., Father, Mother, Spouse"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="font-bold text-gray-900 text-xl">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Monthly Income</Label>
                <Input
                  value={bookingData.monthlyIncome}
                  onChange={(e) => setBookingData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  placeholder="Enter monthly income"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700 mb-2 block">Employer/Company</Label>
                <Input
                  value={bookingData.employer}
                  onChange={(e) => setBookingData(prev => ({ ...prev, employer: e.target.value }))}
                  placeholder="Enter employer/company name"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-4 border-t pt-6">
            <Label className="font-semibold text-gray-700 text-lg">Special Requests or Additional Information</Label>
            <Textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requirements, medical conditions, additional travelers, or questions..."
              className="min-h-24"
            />
          </div>

          {/* Document Notice */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Document Collection Process</h4>
            <p className="text-blue-800 text-sm">
              After booking confirmation, our visa experts will contact you via email/WhatsApp with:
            </p>
            <ul className="text-blue-800 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Complete document checklist specific to your visa type</li>
              <li>Document format and size requirements</li>
              <li>Step-by-step application guidance</li>
              <li>Secure document upload links</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleBooking}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg"
          >
            Apply Now - {formatPrice(totalPrice)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVisaBooking;
