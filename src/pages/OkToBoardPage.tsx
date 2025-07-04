import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import EnhancedFooter from '@/components/layout/EnhancedFooter';
import EnhancedMobileTabBar from '@/components/layout/EnhancedMobileTabBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plane, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OkToBoardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Passenger Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    
    // Flight Details
    airline: '',
    flightNumber: '',
    departureDate: '',
    departureTime: '',
    departureAirport: '',
    arrivalAirport: '',
    
    // Contact Information
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Special Requirements
    specialAssistance: '',
    medicalConditions: '',
    dietaryRequirements: '',
    
    // Documents
    passportCopy: null,
    visa: null,
    covidCertificate: null,
    additionalDocs: null
  });

  const airlines = [
    'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India',
    'Emirates', 'Qatar Airways', 'Etihad', 'Singapore Airlines', 'Turkish Airlines',
    'Lufthansa', 'British Airways', 'KLM', 'Air France', 'Thai Airways'
  ];

  const genderOptions = ['Male', 'Female', 'Other'];
  const specialAssistanceOptions = [
    'None', 'Wheelchair', 'Blind/Visually Impaired', 'Deaf/Hearing Impaired',
    'Elderly Assistance', 'Unaccompanied Minor', 'Pregnant', 'Medical Equipment'
  ];

  const steps = [
    { number: 1, title: 'Passenger Details', icon: '👤' },
    { number: 2, title: 'Flight Information', icon: '✈️' },
    { number: 3, title: 'Contact & Emergency', icon: '📞' },
    { number: 4, title: 'Documents Upload', icon: '📄' },
    { number: 5, title: 'Review & Payment', icon: '💳' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Ok to Board Request Submitted!",
      description: "We'll process your request within 24 hours and send confirmation to your email.",
    });
    
    // Redirect to payment or confirmation page
    navigate('/booking-confirmation');
  };

  const renderProgressBar = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep >= step.number 
                ? 'bg-blue-600 text-white shadow-lg scale-110' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className="text-xs mt-2 text-center max-w-16">{step.title}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Passenger Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="As per passport"
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="As per passport"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 z-50">
              {genderOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            placeholder="Indian"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="passportNumber">Passport Number *</Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => handleInputChange('passportNumber', e.target.value)}
            placeholder="A1234567"
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="passportExpiry">Passport Expiry *</Label>
          <Input
            id="passportExpiry"
            type="date"
            value={formData.passportExpiry}
            onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">✈️ Flight Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="airline">Airline *</Label>
          <Select value={formData.airline} onValueChange={(value) => handleInputChange('airline', value)}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300 z-50">
              {airlines.map((airline) => (
                <SelectItem key={airline} value={airline}>{airline}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="flightNumber">Flight Number *</Label>
          <Input
            id="flightNumber"
            value={formData.flightNumber}
            onChange={(e) => handleInputChange('flightNumber', e.target.value)}
            placeholder="AI101"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departureDate">Departure Date *</Label>
          <Input
            id="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="departureTime">Departure Time *</Label>
          <Input
            id="departureTime"
            type="time"
            value={formData.departureTime}
            onChange={(e) => handleInputChange('departureTime', e.target.value)}
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departureAirport">Departure Airport *</Label>
          <Input
            id="departureAirport"
            value={formData.departureAirport}
            onChange={(e) => handleInputChange('departureAirport', e.target.value)}
            placeholder="DEL - Delhi"
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="arrivalAirport">Arrival Airport *</Label>
          <Input
            id="arrivalAirport"
            value={formData.arrivalAirport}
            onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
            placeholder="DXB - Dubai"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📞 Contact & Emergency Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your@email.com"
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+91 9876543210"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            placeholder="Contact person name"
            required
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
          <Input
            id="emergencyPhone"
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
            placeholder="+91 9876543210"
            required
            className="bg-white border-gray-300"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specialAssistance">Special Assistance Required</Label>
        <Select value={formData.specialAssistance} onValueChange={(value) => handleInputChange('specialAssistance', value)}>
          <SelectTrigger className="bg-white border-gray-300">
            <SelectValue placeholder="Select if any special assistance needed" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-300 z-50">
            {specialAssistanceOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medicalConditions">Medical Conditions</Label>
          <Textarea
            id="medicalConditions"
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
            placeholder="Any medical conditions we should know about"
            className="bg-white border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
          <Textarea
            id="dietaryRequirements"
            value={formData.dietaryRequirements}
            onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
            placeholder="Vegetarian, Vegan, Halal, etc."
            className="bg-white border-gray-300"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Document Upload</h3>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload clear, high-quality images or PDFs. Supported formats: PDF, JPG, PNG (Max size: 5MB per file)
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <Label htmlFor="passportCopy" className="text-sm font-medium text-gray-700 cursor-pointer">
            Passport Copy * (First & Last Page)
          </Label>
          <Input
            id="passportCopy"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('passportCopy', e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <Label htmlFor="visa" className="text-sm font-medium text-gray-700 cursor-pointer">
            Visa Copy (if applicable)
          </Label>
          <Input
            id="visa"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('visa', e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <Label htmlFor="covidCertificate" className="text-sm font-medium text-gray-700 cursor-pointer">
            COVID-19 Vaccination Certificate
          </Label>
          <Input
            id="covidCertificate"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('covidCertificate', e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <Label htmlFor="additionalDocs" className="text-sm font-medium text-gray-700 cursor-pointer">
            Additional Documents
          </Label>
          <Input
            id="additionalDocs"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('additionalDocs', e.target.files?.[0] || null)}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Review & Payment</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4">✅ Service Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ok to Board Service:</span>
            <span className="font-semibold">₹2,999</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span className="font-semibold">₹199</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%):</span>
            <span className="font-semibold">₹576</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold text-blue-900">
            <span>Total Amount:</span>
            <span>₹3,774</span>
          </div>
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Please submit your Ok to Board request at least 48 hours before your flight departure time. 
          Late submissions may result in processing delays.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-semibold mb-2">📋 What's Included:</h5>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Complete Ok to Board verification</li>
          <li>• Document validation and processing</li>
          <li>• Airline coordination and confirmation</li>
          <li>• 24/7 support until boarding</li>
          <li>• SMS/Email updates on status</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Contact Bar */}
      <div className="bg-blue-600 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>📞 +91-9125009662</span>
            <span>📧 info@triphabibi.com</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-600 rounded text-xs">✅ SSL Secure</span>
            <span className="px-2 py-1 bg-orange-600 rounded text-xs">🕒 48hr Processing</span>
          </div>
        </div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Plane className="h-8 w-8" />
              <h1 className="text-3xl md:text-5xl font-bold">
                Ok to Board Service
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-6">
              Complete airline clearance verification for hassle-free travel
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-green-600 text-white px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                48 Hour Processing
              </Badge>
              <Badge variant="secondary" className="bg-orange-600 text-white px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                99% Success Rate
              </Badge>
              <Badge variant="secondary" className="bg-purple-600 text-white px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                24/7 Support
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="text-2xl text-center text-blue-900">
                Ok to Board Application Form
              </CardTitle>
              <p className="text-center text-gray-600">
                Submit at least 48 hours before your flight departure
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              {renderProgressBar()}
              
              <div className="min-h-[500px]">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-8"
                >
                  Previous
                </Button>
                
                {currentStep === 5 ? (
                  <Button
                    onClick={handleSubmit}
                    className="px-8 bg-green-600 hover:bg-green-700 animate-pulse"
                  >
                    Submit Ok to Board Request
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="px-8"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
        <div className="bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center">
          <Plane className="h-5 w-5 mr-2" />
          <span className="font-semibold">Submit Ok to Board - ₹3,774</span>
        </div>
      </div>

      <EnhancedFooter />
      <EnhancedMobileTabBar />
    </div>
  );
};

export default OkToBoardPage;