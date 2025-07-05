
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Upload, Users, User, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/hooks/useCurrency';
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
  
  const [step, setStep] = useState(1);
  const [travelers, setTravelers] = useState({ adults: 1, children: 0 });
  const [bookingMethod, setBookingMethod] = useState<'direct' | 'detailed' | null>(null);
  const [expandedTraveler, setExpandedTraveler] = useState<number | null>(0);
  
  const [directBookingData, setDirectBookingData] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });

  const [detailedBookingData, setDetailedBookingData] = useState({
    travelers: [] as Array<{
      type: 'adult' | 'child';
      nationality: string;
      fullName: string;
      fatherName: string;
      passportNumber: string;
      dateOfBirth: string;
      passportExpiry: string;
      documents: {
        passportFront: File | null;
        passportSecond: File | null;
        flightTicket: File | null;
        hotelBooking: File | null;
        photo: File | null;
      };
    }>()
  });

  const totalTravelers = travelers.adults + travelers.children;
  const totalPrice = totalTravelers * visa.price;

  const nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali', 'Afghan',
    'American', 'British', 'Canadian', 'Australian', 'German', 'French',
    'Italian', 'Spanish', 'Russian', 'Chinese', 'Japanese', 'Korean',
    'Filipino', 'Indonesian', 'Malaysian', 'Thai', 'Vietnamese', 'Other'
  ];

  const initializeDetailedBooking = () => {
    const newTravelers = [];
    for (let i = 0; i < travelers.adults; i++) {
      newTravelers.push({
        type: 'adult' as const,
        nationality: '',
        fullName: '',
        fatherName: '',
        passportNumber: '',
        dateOfBirth: '',
        passportExpiry: '',
        documents: {
          passportFront: null,
          passportSecond: null,
          flightTicket: null,
          hotelBooking: null,
          photo: null,
        }
      });
    }
    for (let i = 0; i < travelers.children; i++) {
      newTravelers.push({
        type: 'child' as const,
        nationality: '',
        fullName: '',
        fatherName: '',
        passportNumber: '',
        dateOfBirth: '',
        passportExpiry: '',
        documents: {
          passportFront: null,
          passportSecond: null,
          flightTicket: null,
          hotelBooking: null,
          photo: null,
        }
      });
    }
    setDetailedBookingData({ travelers: newTravelers });
  };

  const handleDirectBooking = () => {
    if (!directBookingData.fullName || !directBookingData.email || !directBookingData.mobile) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const queryParams = new URLSearchParams({
      type: 'visa',
      id: visa.id,
      adults: travelers.adults.toString(),
      children: travelers.children.toString(),
      name: directBookingData.fullName,
      email: directBookingData.email,
      mobile: directBookingData.mobile,
      amount: totalPrice.toString(),
      method: 'direct'
    });

    navigate(`/booking?${queryParams.toString()}`);
    
    toast({
      title: "Booking Initiated",
      description: "Please email or WhatsApp documents after booking completion.",
    });
  };

  const handleDetailedBooking = () => {
    const queryParams = new URLSearchParams({
      type: 'visa',
      id: visa.id,
      adults: travelers.adults.toString(),
      children: travelers.children.toString(),
      amount: totalPrice.toString(),
      method: 'detailed',
      data: JSON.stringify(detailedBookingData)
    });

    navigate(`/booking?${queryParams.toString()}`);
    
    toast({
      title: "Booking Initiated",
      description: "Redirecting to payment gateway...",
    });
  };

  const updateTravelerData = (index: number, field: string, value: string) => {
    setDetailedBookingData(prev => ({
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const handleFileUpload = (index: number, docType: string, file: File | null) => {
    setDetailedBookingData(prev => ({
      travelers: prev.travelers.map((traveler, i) => 
        i === index 
          ? { 
              ...traveler, 
              documents: { ...traveler.documents, [docType]: file }
            } 
          : traveler
      )
    }));
  };

  if (step === 1) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4">
            <CardTitle className="text-lg md:text-xl text-center font-bold">
              {visa.country} - {visa.visa_type}
            </CardTitle>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{formatPrice(totalPrice)}</div>
              <div className="text-white/80 text-sm">Total for {totalTravelers} travelers</div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4 bg-white">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Number of Travelers
              </Label>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Adults</div>
                  <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                    disabled={travelers.adults <= 1}
                    className="h-8 w-8 p-0 bg-white border-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-gray-900">{travelers.adults}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, adults: prev.adults + 1 }))}
                    className="h-8 w-8 p-0 bg-white border-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Children (including infants)</div>
                  <div className="text-sm text-gray-600">{formatPrice(visa.price)} each</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                    disabled={travelers.children <= 0}
                    className="h-8 w-8 p-0 bg-white border-gray-300"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-gray-900">{travelers.children}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTravelers(prev => ({ ...prev, children: prev.children + 1 }))}
                    className="h-8 w-8 p-0 bg-white border-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Choose Application Method</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setBookingMethod('direct');
                    setStep(2);
                  }}
                  className="w-full h-auto p-4 bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-base">Direct Book & Send Documents</div>
                    <div className="text-sm text-blue-100 mt-1">Quick booking - send documents later</div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    setBookingMethod('detailed');
                    initializeDetailedBooking();
                    setStep(2);
                  }}
                  variant="outline"
                  className="w-full h-auto p-4 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900"
                >
                  <div className="text-left w-full">
                    <div className="font-semibold text-base">Fill Details and Apply</div>
                    <div className="text-sm text-gray-600 mt-1">Complete application with documents</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2 && bookingMethod === 'direct') {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <CardTitle className="text-lg md:text-xl text-center font-bold">Quick Booking</CardTitle>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{formatPrice(totalPrice)}</div>
              <div className="text-white/80 text-sm">For {totalTravelers} travelers</div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4 bg-white">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                value={directBookingData.fullName}
                onChange={(e) => setDirectBookingData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
                className="h-10 md:h-12 bg-white border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                type="email"
                value={directBookingData.email}
                onChange={(e) => setDirectBookingData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="h-10 md:h-12 bg-white border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Mobile Number *
              </Label>
              <Input
                type="tel"
                value={directBookingData.mobile}
                onChange={(e) => setDirectBookingData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="Enter mobile number"
                className="h-10 md:h-12 bg-white border-gray-300"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                📧 Please email or WhatsApp the required documents after booking completion.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 bg-white border-gray-300 text-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleDirectBooking}
                className="flex-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Pay & Book - {formatPrice(totalPrice)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2 && bookingMethod === 'detailed') {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-4">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4">
            <CardTitle className="text-lg md:text-xl text-center font-bold">Complete Application</CardTitle>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold">{formatPrice(totalPrice)}</div>
              <div className="text-white/80 text-sm">For {totalTravelers} travelers</div>
            </div>
          </CardHeader>
        </Card>

        {detailedBookingData.travelers.map((traveler, index) => (
          <Card key={index} className="shadow-lg border border-gray-200 bg-white">
            <CardHeader 
              className="p-3 bg-gray-50 cursor-pointer"
              onClick={() => setExpandedTraveler(expandedTraveler === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {traveler.type === 'adult' ? 'Adult' : 'Child'} {index + 1}
                  {traveler.fullName && ` - ${traveler.fullName}`}
                </CardTitle>
                {expandedTraveler === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardHeader>
            
            {expandedTraveler === index && (
              <CardContent className="p-4 space-y-3 bg-white">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nationality *</Label>
                    <Select 
                      value={traveler.nationality} 
                      onValueChange={(value) => updateTravelerData(index, 'nationality', value)}
                    >
                      <SelectTrigger className="h-10 bg-white border-gray-300">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-50">
                        {nationalities.map((nat) => (
                          <SelectItem key={nat} value={nat} className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-2">
                            {nat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Full Name as per Passport *</Label>
                    <Input
                      value={traveler.fullName}
                      onChange={(e) => updateTravelerData(index, 'fullName', e.target.value)}
                      placeholder="Enter full name"
                      className="h-10 bg-white border-gray-300"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Father's Name *</Label>
                    <Input
                      value={traveler.fatherName}
                      onChange={(e) => updateTravelerData(index, 'fatherName', e.target.value)}
                      placeholder="Enter father's name"
                      className="h-10 bg-white border-gray-300"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Passport Number *</Label>
                    <Input
                      value={traveler.passportNumber}
                      onChange={(e) => updateTravelerData(index, 'passportNumber', e.target.value)}
                      placeholder="Enter passport number"
                      className="h-10 bg-white border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Date of Birth *</Label>
                      <Input
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) => updateTravelerData(index, 'dateOfBirth', e.target.value)}
                        className="h-10 bg-white border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Passport Expiry *</Label>
                      <Input
                        type="date"
                        value={traveler.passportExpiry}
                        onChange={(e) => updateTravelerData(index, 'passportExpiry', e.target.value)}
                        className="h-10 bg-white border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Document Uploads</Label>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                        <span className="text-sm text-gray-700">Passport Front *</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(index, 'passportFront', e.target.files?.[0] || null)}
                          className="hidden"
                          id={`passport-front-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`passport-front-${index}`)?.click()}
                          className="h-8 text-xs bg-white border-gray-300"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                        <span className="text-sm text-gray-700">Passport Photo *</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(index, 'photo', e.target.files?.[0] || null)}
                          className="hidden"
                          id={`photo-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`photo-${index}`)?.click()}
                          className="h-8 text-xs bg-white border-gray-300"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => setStep(1)}
            variant="outline"
            className="flex-1 bg-white border-gray-300 text-gray-700"
          >
            Back
          </Button>
          <Button
            onClick={handleDetailedBooking}
            className="flex-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            Pay & Book - {formatPrice(totalPrice)}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SmartVisaBooking;
