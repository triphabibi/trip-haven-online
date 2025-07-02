import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { MapPin, Calendar, Users, Clock, CreditCard } from 'lucide-react';

interface EnhancedBookingFormProps {
  serviceType: 'tour' | 'visa' | 'ticket' | 'package';
  serviceId: string;
  serviceName: string;
  basePrice: number;
}

const EnhancedBookingForm = ({ serviceType, serviceId, serviceName, basePrice }: EnhancedBookingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    
    // Travel Details
    travelDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    
    // Tour specific
    pickupLocation: '',
    pickupTime: '',
    language: 'English',
    
    // Special requests
    specialRequests: ''
  });

  const totalSteps = serviceType === 'visa' ? 4 : 3;
  const progressValue = (currentStep / totalSteps) * 100;

  const calculateTotal = () => {
    return basePrice * (formData.adults + formData.children * 0.8 + formData.infants * 0.1);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">👋 Personal Information</h3>
              <p className="text-gray-600">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  👤 Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  📧 Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  📱 Phone Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">📅 Travel Details</h3>
              <p className="text-gray-600">When and how many travelers?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  📅 Travel Date *
                </Label>
                <Input
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  👥 Number of Travelers
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Adults</Label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                        className="h-10 w-10"
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center py-2">{formData.adults}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, adults: formData.adults + 1 })}
                        className="h-10 w-10"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Children</Label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                        className="h-10 w-10"
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center py-2">{formData.children}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, children: formData.children + 1 })}
                        className="h-10 w-10"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Infants</Label>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                        className="h-10 w-10"
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center py-2">{formData.infants}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, infants: formData.infants + 1 })}
                        className="h-10 w-10"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {(serviceType === 'tour' || serviceType === 'package') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    📍 Pickup Location *
                  </Label>
                  <Select value={formData.pickupLocation} onValueChange={(value) => setFormData({ ...formData, pickupLocation: value })}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Select pickup point" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="dubai-mall">Dubai Mall</SelectItem>
                      <SelectItem value="burj-khalifa">Burj Khalifa</SelectItem>
                      <SelectItem value="marina">Dubai Marina</SelectItem>
                      <SelectItem value="bur-dubai">Bur Dubai</SelectItem>
                      <SelectItem value="deira">Deira</SelectItem>
                      <SelectItem value="airport">Dubai Airport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    🕐 Pickup Time *
                  </Label>
                  <Select value={formData.pickupTime} onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="08:00">08:00 AM</SelectItem>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    🗣️ Language
                  </Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Russian">Russian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">💬 Additional Information</h3>
              <p className="text-gray-600">Any special requests or requirements?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ✨ Special Requests (Optional)
                </Label>
                <Textarea
                  placeholder="Any dietary restrictions, accessibility needs, or special occasions?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="min-h-24 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">💳 Payment & Confirmation</h3>
              <p className="text-gray-600">Review your booking and proceed to payment</p>
            </div>
            
            {/* Booking Summary */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">📋 Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{formData.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span className="font-medium">
                    {formData.adults} Adults
                    {formData.children > 0 && `, ${formData.children} Children`}
                    {formData.infants > 0 && `, ${formData.infants} Infants`}
                  </span>
                </div>
                {formData.pickupLocation && (
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span className="font-medium">{formData.pickupLocation} at {formData.pickupTime}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4" data-booking-form>
      <Card className="shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              🎯 Book Your {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
            </CardTitle>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={progressValue} className="w-full mt-2 bg-white/20" />
        </CardHeader>
        
        <CardContent className="p-6">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 hover:scale-105 transition-all duration-300"
            >
              ← Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
              >
                Next →
              </Button>
            ) : (
              <Button
                className="px-8 py-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 pulse-cta"
              >
                💳 Proceed to Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBookingForm;