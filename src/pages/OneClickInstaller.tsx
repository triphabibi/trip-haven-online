
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OneClickInstaller = () => {
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState([
    { name: 'Database Setup', status: 'pending' },
    { name: 'Sample Data Loading', status: 'pending' },
    { name: 'Configuration Setup', status: 'pending' },
  ]);
  const { toast } = useToast();

  const updateStepStatus = (stepIndex: number, status: 'pending' | 'running' | 'completed' | 'error') => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const runInstaller = async () => {
    setInstalling(true);
    setProgress(0);

    try {
      // Step 1: Database Setup
      updateStepStatus(0, 'running');
      setProgress(10);
      
      // Create sample tours
      const { error: toursError } = await supabase.from('tours').upsert([
        {
          title: 'Dubai City Tour',
          description: 'Explore the magnificent city of Dubai with our comprehensive tour package.',
          price_adult: 2500,
          price_child: 1800,
          price_infant: 0,
          duration: '8 hours',
          category: 'city-tour',
          highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina'],
          whats_included: ['Transportation', 'Tour Guide', 'Entry Tickets', 'Lunch'],
          languages: ['English', 'Hindi', 'Arabic'],
          status: 'active',
          is_featured: true
        }
      ]);

      if (toursError) throw toursError;
      setProgress(25);
      updateStepStatus(0, 'completed');

      // Step 2: Sample Data Loading
      updateStepStatus(1, 'running');
      
      // Create sample packages
      const { error: packagesError } = await supabase.from('tour_packages').upsert([
        {
          title: 'Dubai & Abu Dhabi 3 Days Package',
          description: 'Experience the best of UAE with our 3-day Dubai and Abu Dhabi package.',
          price_adult: 15000,
          price_child: 12000,
          price_infant: 0,
          days: 3,
          nights: 2,
          highlights: ['Dubai City Tour', 'Abu Dhabi City Tour', 'Desert Safari', 'Dhow Cruise'],
          whats_included: ['Hotel Accommodation', 'Daily Breakfast', 'Transportation', 'Tour Guide'],
          status: 'active',
          is_featured: true
        }
      ]);

      if (packagesError) throw packagesError;

      // Create sample attraction tickets
      const { error: ticketsError } = await supabase.from('attraction_tickets').upsert([
        {
          title: 'Burj Khalifa At The Top',
          description: 'Experience breathtaking views from the world\'s tallest building.',
          price_adult: 400,
          price_child: 300,
          price_infant: 0,
          location: 'Downtown Dubai',
          instant_delivery: true,
          is_featured: true,
          status: 'active'
        }
      ]);

      if (ticketsError) throw ticketsError;

      // Create sample visa services
      const { error: visasError } = await supabase.from('visa_services').upsert([
        {
          country: 'UAE',
          visa_type: 'Tourist Visa',
          price: 350,
          processing_time: '3-5 working days',
          description: 'Single entry tourist visa valid for 30 days.',
          requirements: ['Passport copy', 'Photo', 'Flight tickets', 'Hotel booking'],
          is_featured: true,
          status: 'active'
        }
      ]);

      if (visasError) throw visasError;
      
      setProgress(70);
      updateStepStatus(1, 'completed');

      // Step 3: Configuration Setup
      updateStepStatus(2, 'running');
      
      // Create homepage sliders
      const { error: slidersError } = await supabase.from('homepage_sliders').upsert([
        {
          title: 'Welcome to TripHabibi',
          subtitle: 'Your Gateway to Amazing Dubai Experiences',
          image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
          button_text: 'Explore Tours',
          link_url: '/tours',
          display_order: 1,
          is_active: true
        }
      ]);

      if (slidersError) throw slidersError;

      // Create sample site settings
      const { error: settingsError } = await supabase.from('site_settings').upsert([
        {
          setting_key: 'default_currency',
          setting_value: 'INR',
          setting_type: 'text',
          description: 'Default currency for the application'
        },
        {
          setting_key: 'auto_currency_conversion',
          setting_value: 'true',
          setting_type: 'boolean',
          description: 'Enable automatic currency conversion'
        }
      ]);

      if (settingsError) throw settingsError;
      
      setProgress(100);
      updateStepStatus(2, 'completed');

      toast({
        title: "Installation Complete!",
        description: "Your TripHabibi system has been successfully set up.",
      });

    } catch (error) {
      console.error('Installation error:', error);
      toast({
        title: "Installation Failed",
        description: "There was an error during installation. Please try again.",
        variant: "destructive",
      });
      
      // Mark current step as error
      const currentStep = steps.findIndex(step => step.status === 'running');
      if (currentStep !== -1) {
        updateStepStatus(currentStep, 'error');
      }
    } finally {
      setInstalling(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">TripHabibi One-Click Installer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Set up your complete travel booking system with sample data and configurations.
            </p>
            
            {installing && (
              <div className="mb-6">
                <Progress value={progress} className="mb-2" />
                <p className="text-sm text-gray-500">{progress}% Complete</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                {getStepIcon(step.status)}
                <span className={`text-sm ${
                  step.status === 'completed' ? 'text-green-700' :
                  step.status === 'error' ? 'text-red-700' :
                  step.status === 'running' ? 'text-blue-700' :
                  'text-gray-600'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={runInstaller}
              disabled={installing}
              className="w-full"
              size="lg"
            >
              {installing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Installing...
                </>
              ) : (
                'Start Installation'
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>After installation, use these credentials:</p>
            <p><strong>Email:</strong> admin@triphabibi.in</p>
            <p><strong>Password:</strong> admin123</p>
            <p className="mt-2">
              Note: You'll need to create the admin account manually through the signup process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneClickInstaller;
