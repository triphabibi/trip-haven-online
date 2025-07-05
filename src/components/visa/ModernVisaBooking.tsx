import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Users, CreditCard, MessageCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisaService {
  id: string;
  country: string;
  visa_type: string;
  price: number;
  processing_time?: string;
  requirements?: string[];
}

interface ModernVisaBookingProps {
  service: VisaService;
}

const ModernVisaBooking = ({ service }: ModernVisaBookingProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Quick booking data
    adults: 1,
    children: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Full form data
    travelers: [
      {
        name: '',
        passport: '',
        nationality: '',
        dateOfBirth: '',
        type: 'adult'
      }
    ],
    travelPurpose: 'tourism',
    arrivalDate: '',
    departureDate: '',
    specialRequests: ''
  });

  const totalTravelers = formData.adults + formData.children;
  const totalAmount = totalTravelers * service.price;

  const handleQuickBooking = () => {
    const message = `Hi! I want to book ${service.country} ${service.visa_type} visa for ${totalTravelers} people. Total: ₹${totalAmount.toLocaleString()}. I'll send documents later.`;
    window.open(`https://wa.me/919125009662?text=${encodeURIComponent(message)}`, '_blank');
    
    toast({
      title: "🚀 Quick Booking Initiated!",
      description: "We'll contact you for document collection.",
    });
  };

  const addTraveler = () => {
    setFormData(prev => ({
      ...prev,
      travelers: [...prev.travelers, {
        name: '',
        passport: '',
        nationality: '',
        dateOfBirth: '',
        type: 'adult'
      }]
    }));
  };

  const updateTraveler = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "✅ Application Submitted!",
        description: "Redirecting to payment...",
      });
      
      setTimeout(() => {
        window.location.href = `/payment?service=${service.id}&amount=${totalAmount}`;
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-booking-form>
      {/* Service Header */}
      <Card className="border-0 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                🌍 {service.country} Visa
              </CardTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {service.visa_type}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {service.processing_time}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">₹{service.price.toLocaleString()}</div>
              <div className="text-white/80">per person</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Booking Option */}
      <Card className="border-2 border-orange-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            ⚡ Too Busy to Fill Forms?
          </CardTitle>
          <p className="text-white/90">Quick book now, send documents later!</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">👥 Adults</Label>
              <div className="flex items-center mt-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                  className="h-10 w-10 p-0"
                >
                  -
                </Button>
                <span className="mx-4 font-bold text-lg">{formData.adults}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                  className="h-10 w-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">👶 Children</Label>
              <div className="flex items-center mt-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                  className="h-10 w-10 p-0"
                >
                  -
                </Button>
                <span className="mx-4 font-bold text-lg">{formData.children}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, children: prev.children + 1 }))}
                  className="h-10 w-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total: {totalTravelers} travelers</span>
              <span className="text-blue-600">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleQuickBooking}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              💳 Quick Pay & Book
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/919125009662', '_blank')}
              className="bg-green-600 hover:bg-green-700 px-4"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Application Form */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle>📋 Complete Visa Application</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">👥 Traveler Information</h3>
              
              {formData.travelers.map((traveler, index) => (
                <Card key={index} className="p-4 border-dashed border-2 border-gray-200">
                  <h4 className="font-medium mb-3">Traveler #{index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">👤 Full Name (as in passport)</Label>
                      <Input
                        placeholder="Full name exactly as in passport"
                        value={traveler.name}
                        onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">📔 Passport Number</Label>
                      <Input
                        placeholder="Passport number"
                        value={traveler.passport}
                        onChange={(e) => updateTraveler(index, 'passport', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">🌍 Nationality</Label>
                      <Input
                        placeholder="Your nationality"
                        value={traveler.nationality}
                        onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">📅 Date of Birth</Label>
                      <Input
                        type="date"
                        value={traveler.dateOfBirth}
                        onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button onClick={addTraveler} variant="outline" className="w-full">
                ➕ Add Another Traveler
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">📞 Contact & Travel Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">📧 Email Address</Label>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">📞 Phone Number</Label>
                  <Input
                    placeholder="+971 50 123 4567"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">🛬 Intended Arrival Date</Label>
                  <Input
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">🛫 Intended Departure Date</Label>
                  <Input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">💬 Special Requests</Label>
                <Textarea
                  placeholder="Any special requests or additional information..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  className="bg-white"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                ← Previous
              </Button>
            )}
            <div className="ml-auto">
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)} className="bg-purple-600 hover:bg-purple-700">
                  Next →
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {loading ? '⏳ Processing...' : `💳 Submit Application - ₹${(formData.travelers.length * service.price).toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernVisaBooking;