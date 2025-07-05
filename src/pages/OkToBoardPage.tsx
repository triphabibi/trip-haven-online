
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plane, User, Mail, Phone, Upload } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const OkToBoardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    flightNumber: '',
    airline: '',
    destination: '',
    ticketCopy: null as File | null,
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const nationalities = [
    'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali', 'Afghan',
    'American', 'British', 'Canadian', 'Australian', 'German', 'French',
    'Italian', 'Spanish', 'Russian', 'Chinese', 'Japanese', 'Korean',
    'Filipino', 'Indonesian', 'Malaysian', 'Thai', 'Vietnamese', 'Other'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, ticketCopy: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!formData.flightNumber.trim()) newErrors.flightNumber = 'Flight number is required';
    if (!formData.airline.trim()) newErrors.airline = 'Airline is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.ticketCopy) newErrors.ticketCopy = 'Ticket copy is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const queryParams = new URLSearchParams({
        type: 'ok-to-board',
        id: 'otb-' + Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        passport: formData.passportNumber,
        flight: formData.flightNumber,
        airline: formData.airline,
        destination: formData.destination,
        amount: '0'
      });

      navigate(`/booking?${queryParams.toString()}`);
      
      toast({
        title: "Application Submitted",
        description: "Your OK to Board application has been submitted successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">OK to Board Application</h1>
          <p className="text-xl text-gray-600">Get your travel clearance quickly and easily</p>
        </div>

        <Card className="shadow-xl bg-white border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl text-center font-bold">Application Form</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className={`h-12 bg-white border-gray-300 ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium text-gray-700">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className={`h-12 bg-white border-gray-300 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-medium text-gray-700">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className={`h-12 bg-white border-gray-300 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Nationality *</Label>
                  <Select value={formData.nationality} onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}>
                    <SelectTrigger className={`h-12 bg-white border-gray-300 ${errors.nationality ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-40 overflow-y-auto z-50">
                      {nationalities.map((nationality) => (
                        <SelectItem key={nationality} value={nationality} className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer py-2">
                          {nationality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Passport Number *</Label>
                  <Input
                    value={formData.passportNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                    placeholder="Enter passport number"
                    className={`h-12 bg-white border-gray-300 ${errors.passportNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.passportNumber && <p className="text-red-500 text-sm">{errors.passportNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Flight Number *</Label>
                  <Input
                    value={formData.flightNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                    placeholder="Enter flight number"
                    className={`h-12 bg-white border-gray-300 ${errors.flightNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.flightNumber && <p className="text-red-500 text-sm">{errors.flightNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Airline *</Label>
                  <Input
                    value={formData.airline}
                    onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                    placeholder="Enter airline name"
                    className={`h-12 bg-white border-gray-300 ${errors.airline ? 'border-red-500' : ''}`}
                  />
                  {errors.airline && <p className="text-red-500 text-sm">{errors.airline}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Destination *</Label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Enter destination"
                    className={`h-12 bg-white border-gray-300 ${errors.destination ? 'border-red-500' : ''}`}
                  />
                  {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-medium text-gray-700">
                  <Upload className="h-4 w-4" />
                  Ticket Copy *
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${errors.ticketCopy ? 'border-red-500' : 'border-gray-300'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> your ticket copy
                      </p>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                      {formData.ticketCopy && (
                        <p className="text-xs text-green-600 mt-2">
                          File selected: {formData.ticketCopy.name}
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
                {errors.ticketCopy && <p className="text-red-500 text-sm">{errors.ticketCopy}</p>}
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">Additional Information</Label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any additional information you'd like to provide..."
                  rows={4}
                  className="bg-white border-gray-300"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OkToBoardPage;
