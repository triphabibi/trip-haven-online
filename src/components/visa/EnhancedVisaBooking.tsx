import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Users, CreditCard, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedVisaBookingProps {
  service: {
    id: string;
    country: string;
    visa_type: string;
    price: number;
    processing_time: string;
    requirements?: string[];
  };
}

const EnhancedVisaBooking = ({ service }: EnhancedVisaBookingProps) => {
  const [activeTab, setActiveTab] = useState('normal');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Point 9 & 11: Support for multiple travelers
  const [travelers, setTravelers] = useState([
    { type: 'adult', name: '', passport: '', nationality: '', dateOfBirth: '' }
  ]);
  
  const [formData, setFormData] = useState({
    customer_email: '',
    customer_phone: '',
    adults_count: 1,
    children_count: 0,
    travel_purpose: 'tourism',
    intended_arrival: '',
    intended_departure: '',
    special_requests: ''
  });

  const addTraveler = (type: 'adult' | 'child') => {
    setTravelers(prev => [...prev, {
      type,
      name: '',
      passport: '',
      nationality: '',
      dateOfBirth: ''
    }]);
    
    if (type === 'adult') {
      setFormData(prev => ({ ...prev, adults_count: prev.adults_count + 1 }));
    } else {
      setFormData(prev => ({ ...prev, children_count: prev.children_count + 1 }));
    }
  };

  const updateTraveler = (index: number, field: string, value: string) => {
    setTravelers(prev => prev.map((traveler, i) => 
      i === index ? { ...traveler, [field]: value } : traveler
    ));
  };

  const handleQuickBooking = () => {
    // Point 11: Quick booking option
    const totalPax = formData.adults_count + formData.children_count;
    const totalAmount = totalPax * service.price;
    
    toast({
      title: "🚀 Quick Booking Initiated!",
      description: `Total: ₹${totalAmount.toLocaleString()} for ${totalPax} travelers. We'll contact you for documents.`,
    });

    // Redirect to payment or WhatsApp
    const message = `Hi! I want to book ${service.country} ${service.visa_type} visa for ${totalPax} people. Total: ₹${totalAmount.toLocaleString()}. I'll send documents later.`;
    window.open(`https://wa.me/919125009662?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleNormalSubmit = async () => {
    setLoading(true);
    try {
      const totalAmount = (formData.adults_count + formData.children_count) * service.price;
      const bookingReference = `VS${Date.now()}${Math.floor(Math.random() * 1000)}`;

      const { error } = await supabase
        .from('new_bookings')
        .insert({
          booking_reference: bookingReference,
          service_id: service.id,
          booking_type: 'visa',
          customer_name: travelers[0]?.name || 'Guest',
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          adults_count: formData.adults_count,
          children_count: formData.children_count,
          total_amount: totalAmount,
          final_amount: totalAmount,
          travel_date: formData.intended_arrival,
          special_requests: formData.special_requests,
          booking_status: 'pending',
          payment_status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "🎉 Visa Application Submitted!",
        description: `Reference: ${bookingReference}. Redirecting to payment...`,
      });

      // Point 8: Redirect to payment
      setTimeout(() => {
        window.location.href = `/payment?ref=${bookingReference}`;
      }, 2000);

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

  const renderQuickBooking = () => (
    <div className="space-y-6" data-booking-form>
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-2xl text-white">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          ⚡ Quick Visa Booking
        </h3>
        <p className="text-white/90">
          Too busy to fill forms? Just select travelers, pay, and send documents later!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-2 text-lg">
            👥 Adults (18+)
          </Label>
          <Input
            type="number"
            min="1"
            value={formData.adults_count}
            onChange={(e) => setFormData(prev => ({ ...prev, adults_count: parseInt(e.target.value) || 1 }))}
            className="text-lg p-4 bg-white border-gray-300 focus:border-green-500"
          />
          <p className="text-sm text-gray-600 mt-1">₹{service.price.toLocaleString()} each</p>
        </div>
        
        <div>
          <Label className="flex items-center gap-2 text-lg">
            👶 Children (0-17)
          </Label>
          <Input
            type="number"
            min="0"
            value={formData.children_count}
            onChange={(e) => setFormData(prev => ({ ...prev, children_count: parseInt(e.target.value) || 0 }))}
            className="text-lg p-4 bg-white border-gray-300 focus:border-green-500"
          />
          <p className="text-sm text-gray-600 mt-1">₹{service.price.toLocaleString()} each</p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">📋 What you'll need to send later:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Passport copies (high-quality PDF/JPG)</li>
          <li>• Photos (white background, recent)</li>
          <li>• Flight bookings (if available)</li>
          <li>• Hotel confirmations</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-bold text-blue-900">Total Amount</h4>
            <p className="text-blue-700">
              {formData.adults_count} Adults + {formData.children_count} Children
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{((formData.adults_count + formData.children_count) * service.price).toLocaleString()}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleQuickBooking}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg py-3"
          >
            💳 Pay Now, Documents Later
          </Button>
          
          <Button 
            onClick={() => window.open('https://wa.me/919125009662', '_blank')}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNormalForm = () => (
    <div className="space-y-6">
      {step === 1 && (
        <div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl text-white mb-6">
            <h3 className="text-xl font-bold mb-2">
              📋 Visa Application - {service.country}
            </h3>
            <p className="text-white/90">{service.visa_type} • {service.processing_time}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              👥 Add All Travelers
            </h4>
            
            {travelers.map((traveler, index) => (
              <Card key={index} className="p-4 border-2 border-dashed border-gray-200">
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  {traveler.type === 'adult' ? '👤' : '👶'} 
                  Traveler #{index + 1} ({traveler.type})
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full name (as in passport)"
                    value={traveler.name}
                    onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    placeholder="Passport number"
                    value={traveler.passport}
                    onChange={(e) => updateTraveler(index, 'passport', e.target.value)}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    placeholder="Nationality"
                    value={traveler.nationality}
                    onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    type="date"
                    placeholder="Date of birth"
                    value={traveler.dateOfBirth}
                    onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
              </Card>
            ))}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => addTraveler('adult')}
                variant="outline"
                className="flex-1"
              >
                ➕ Add Adult
              </Button>
              <Button 
                onClick={() => addTraveler('child')}
                variant="outline"
                className="flex-1"
              >
                ➕ Add Child
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📞 Contact Information</h4>
          </div>
          
          <Input
            type="email"
            placeholder="📧 Email address"
            value={formData.customer_email}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
            className="bg-white border-gray-300 focus:border-blue-500"
          />
          
          <Input
            type="tel"
            placeholder="📞 Phone number"
            value={formData.customer_phone}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
            className="bg-white border-gray-300 focus:border-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Intended arrival"
              value={formData.intended_arrival}
              onChange={(e) => setFormData(prev => ({ ...prev, intended_arrival: e.target.value }))}
              className="bg-white border-gray-300"
            />
            <Input
              type="date"
              placeholder="Intended departure"
              value={formData.intended_departure}
              onChange={(e) => setFormData(prev => ({ ...prev, intended_departure: e.target.value }))}
              className="bg-white border-gray-300"
            />
          </div>

          <Textarea
            placeholder="💬 Special requests or additional information..."
            value={formData.special_requests}
            onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
            className="bg-white border-gray-300"
            rows={3}
          />
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
              onClick={handleNormalSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? '⏳ Processing...' : `💳 Submit Application - ₹${((formData.adults_count + formData.children_count) * service.price).toLocaleString()}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-center">
          🌍 {service.country} Visa Application
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="quick" className="text-sm font-medium">
              ⚡ Quick Booking
            </TabsTrigger>
            <TabsTrigger value="normal" className="text-sm font-medium">
              📋 Full Application
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick">
            {renderQuickBooking()}
          </TabsContent>
          
          <TabsContent value="normal">
            {renderNormalForm()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedVisaBooking;