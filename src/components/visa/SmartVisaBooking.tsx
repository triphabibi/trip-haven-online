
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload, Users, CreditCard, User, Mail, Phone, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

interface VisaService {
  id: string;
  country: string;
  visa_type: string;
  price: number;
}

interface SmartVisaBookingProps {
  service: VisaService;
}

interface TravelerData {
  nationality: string;
  fullName: string;
  fatherName: string;
  passportNumber: string;
  dateOfBirth: string;
  passportExpiry: string;
  passportFront: File | null;
  passportSecond: File | null;
  flightTicket: File | null;
  hotelBooking: File | null;
  photo: File | null;
}

const SmartVisaBooking = ({ service }: SmartVisaBookingProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [applicationMethod, setApplicationMethod] = useState<'direct' | 'detailed' | null>(null);
  
  const [totalTravelers, setTotalTravelers] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  const [quickBookingData, setQuickBookingData] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });
  
  const [travelers, setTravelers] = useState<TravelerData[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali', 
    'Filipino', 'Egyptian', 'Jordanian', 'Lebanese', 'Syrian',
    'American', 'British', 'Canadian', 'Australian', 'German',
    'French', 'Italian', 'Spanish', 'Other'
  ];

  const totalAmount = totalTravelers * service.price;

  const initializeTravelers = () => {
    const newTravelers: TravelerData[] = [];
    
    // Add adults
    for (let i = 0; i < adults; i++) {
      newTravelers.push({
        nationality: '',
        fullName: '',
        fatherName: '',
        passportNumber: '',
        dateOfBirth: '',
        passportExpiry: '',
        passportFront: null,
        passportSecond: null,
        flightTicket: null,
        hotelBooking: null,
        photo: null
      });
    }
    
    // Add children
    for (let i = 0; i < children; i++) {
      newTravelers.push({
        nationality: '',
        fullName: '',
        fatherName: '',
        passportNumber: '',
        dateOfBirth: '',
        passportExpiry: '',
        passportFront: null,
        passportSecond: null,
        flightTicket: null,
        hotelBooking: null,
        photo: null
      });
    }
    
    setTravelers(newTravelers);
  };

  const validateQuickBooking = () => {
    const newErrors: Record<string, string> = {};
    
    if (!quickBookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!quickBookingData.email.trim()) newErrors.email = 'Email is required';
    if (!quickBookingData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailedForm = () => {
    const newErrors: Record<string, string> = {};
    
    travelers.forEach((traveler, index) => {
      if (!traveler.nationality) newErrors[`nationality_${index}`] = 'Nationality is required';
      if (!traveler.fullName.trim()) newErrors[`fullName_${index}`] = 'Full name is required';
      if (!traveler.fatherName.trim()) newErrors[`fatherName_${index}`] = 'Father name is required';
      if (!traveler.passportNumber.trim()) newErrors[`passportNumber_${index}`] = 'Passport number is required';
      if (!traveler.dateOfBirth) newErrors[`dateOfBirth_${index}`] = 'Date of birth is required';
      if (!traveler.passportExpiry) newErrors[`passportExpiry_${index}`] = 'Passport expiry is required';
      if (!traveler.passportFront) newErrors[`passportFront_${index}`] = 'Passport front page is required';
      if (!traveler.photo) newErrors[`photo_${index}`] = 'Photo is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickPayment = () => {
    if (validateQuickBooking()) {
      const queryParams = new URLSearchParams({
        type: 'visa',
        id: service.id,
        method: 'direct',
        travelers: totalTravelers.toString(),
        name: quickBookingData.fullName,
        email: quickBookingData.email,
        mobile: quickBookingData.mobile,
        amount: totalAmount.toString()
      });
      
      navigate(`/booking?${queryParams.toString()}`);
      
      toast({
        title: "Quick Booking Initiated",
        description: "Please email or WhatsApp the documents after payment.",
      });
    }
  };

  const handleDetailedPayment = () => {
    if (validateDetailedForm()) {
      // Here you would typically upload files and create detailed application
      toast({
        title: "Application Submitted",
        description: "Redirecting to payment gateway...",
      });
      
      const queryParams = new URLSearchParams({
        type: 'visa',
        id: service.id,
        method: 'detailed',
        travelers: totalTravelers.toString(),
        amount: totalAmount.toString()
      });
      
      navigate(`/booking?${queryParams.toString()}`);
    }
  };

  const updateTravelerData = (index: number, field: keyof TravelerData, value: string | File | null) => {
    setTravelers(prev => prev.map((traveler, i) => 
      i === index ? { ...traveler, [field]: value } : traveler
    ));
  };

  const updateTravelerCount = (type: 'adults' | 'children', increment: boolean) => {
    if (type === 'adults') {
      const newAdults = increment ? adults + 1 : Math.max(1, adults - 1);
      setAdults(newAdults);
      setTotalTravelers(newAdults + children);
    } else {
      const newChildren = increment ? children + 1 : Math.max(0, children - 1);
      setChildren(newChildren);
      setTotalTravelers(adults + newChildren);
    }
  };

  if (step === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-center">
            🌍 {service.country} Visa Application
          </CardTitle>
          <div className="text-center">
            <div className="text-lg">{service.visa_type}</div>
            <div className="text-2xl font-bold">{formatPrice(service.price)} per person</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-4 block">
              Step 1: Select Number of Travelers
            </Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Adults (18+)</div>
                  <div className="text-sm text-gray-600">{formatPrice(service.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelerCount('adults', false)}
                    disabled={adults <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelerCount('adults', true)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Children (including infants)</div>
                  <div className="text-sm text-gray-600">{formatPrice(service.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelerCount('children', false)}
                    disabled={children <= 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelerCount('children', true)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total: {totalTravelers} travelers</span>
                <span className="text-blue-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => {
              setStep(2);
              initializeTravelers();
            }}
            className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600"
            disabled={totalTravelers === 0}
          >
            Continue to Application Method
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="text-center">
          Choose Application Method - {totalTravelers} Travelers
        </CardTitle>
        <div className="text-center">
          <div className="text-2xl font-bold">Total: {formatPrice(totalAmount)}</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={applicationMethod || ''} onValueChange={(value) => setApplicationMethod(value as 'direct' | 'detailed')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="direct" className="text-sm font-medium">
              🚀 Direct Book & Send Documents
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-sm font-medium">
              📋 Fill Details and Apply
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Quick & Easy Option</h4>
              <p className="text-orange-700 text-sm">Book now and send documents later via email or WhatsApp.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  value={quickBookingData.fullName}
                  onChange={(e) => setQuickBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  className={`h-12 ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              
              <div>
                <Label className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  type="email"
                  value={quickBookingData.email}
                  onChange={(e) => setQuickBookingData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div>
                <Label className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4" />
                  Mobile *
                </Label>
                <Input
                  type="tel"
                  value={quickBookingData.mobile}
                  onChange={(e) => setQuickBookingData(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="Enter mobile number"
                  className={`h-12 ${errors.mobile ? 'border-red-500' : ''}`}
                />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                <strong>After booking:</strong> Please email or WhatsApp the required documents for all {totalTravelers} travelers.
              </p>
            </div>
            
            <Button
              onClick={handleQuickPayment}
              className="w-full h-12 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              💳 Pay & Book - {formatPrice(totalAmount)}
            </Button>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Complete Application</h4>
              <p className="text-blue-700 text-sm">Fill all details and upload documents for each traveler.</p>
            </div>
            
            <div className="space-y-4">
              {travelers.map((traveler, index) => (
                <Collapsible key={index} defaultOpen={index === 0}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-12">
                      <span className="font-medium">
                        {index < adults ? `Adult ${index + 1}` : `Child ${index - adults + 1}`}
                        {traveler.fullName && ` - ${traveler.fullName}`}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-4 p-4 border border-gray-200 rounded-lg mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nationality *</Label>
                        <Select 
                          value={traveler.nationality} 
                          onValueChange={(value) => updateTravelerData(index, 'nationality', value)}
                        >
                          <SelectTrigger className={errors[`nationality_${index}`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem key={nationality} value={nationality}>{nationality}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`nationality_${index}`] && <p className="text-red-500 text-sm">{errors[`nationality_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <Label>Full Name as per Passport *</Label>
                        <Input
                          value={traveler.fullName}
                          onChange={(e) => updateTravelerData(index, 'fullName', e.target.value)}
                          placeholder="Enter full name"
                          className={errors[`fullName_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`fullName_${index}`] && <p className="text-red-500 text-sm">{errors[`fullName_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <Label>Father's Name *</Label>
                        <Input
                          value={traveler.fatherName}
                          onChange={(e) => updateTravelerData(index, 'fatherName', e.target.value)}
                          placeholder="Enter father's name"
                          className={errors[`fatherName_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`fatherName_${index}`] && <p className="text-red-500 text-sm">{errors[`fatherName_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <Label>Passport Number *</Label>
                        <Input
                          value={traveler.passportNumber}
                          onChange={(e) => updateTravelerData(index, 'passportNumber', e.target.value)}
                          placeholder="Enter passport number"
                          className={errors[`passportNumber_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`passportNumber_${index}`] && <p className="text-red-500 text-sm">{errors[`passportNumber_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input
                          type="date"
                          value={traveler.dateOfBirth}
                          onChange={(e) => updateTravelerData(index, 'dateOfBirth', e.target.value)}
                          className={errors[`dateOfBirth_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`dateOfBirth_${index}`] && <p className="text-red-500 text-sm">{errors[`dateOfBirth_${index}`]}</p>}
                      </div>
                      
                      <div>
                        <Label>Passport Expiry Date *</Label>
                        <Input
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => updateTravelerData(index, 'passportExpiry', e.target.value)}
                          className={errors[`passportExpiry_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`passportExpiry_${index}`] && <p className="text-red-500 text-sm">{errors[`passportExpiry_${index}`]}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium">Document Uploads</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Passport Front Page *
                          </Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateTravelerData(index, 'passportFront', e.target.files?.[0] || null)}
                            className={errors[`passportFront_${index}`] ? 'border-red-500' : ''}
                          />
                          {errors[`passportFront_${index}`] && <p className="text-red-500 text-sm">{errors[`passportFront_${index}`]}</p>}
                        </div>
                        
                        <div>
                          <Label>Passport 2nd Page</Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateTravelerData(index, 'passportSecond', e.target.files?.[0] || null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Flight Ticket</Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateTravelerData(index, 'flightTicket', e.target.files?.[0] || null)}
                          />
                        </div>
                        
                        <div>
                          <Label>Hotel Booking</Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => updateTravelerData(index, 'hotelBooking', e.target.files?.[0] || null)}
                          />
                        </div>
                        
                        <div>
                          <Label className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Passport Size Photo *
                          </Label>
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => updateTravelerData(index, 'photo', e.target.files?.[0] || null)}
                            className={errors[`photo_${index}`] ? 'border-red-500' : ''}
                          />
                          {errors[`photo_${index}`] && <p className="text-red-500 text-sm">{errors[`photo_${index}`]}</p>}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
            
            <Button
              onClick={handleDetailedPayment}
              className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              💳 Pay & Book - {formatPrice(totalAmount)}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="px-6"
          >
            ← Back to Traveler Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartVisaBooking;
