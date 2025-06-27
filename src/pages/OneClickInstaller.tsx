
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
          title: 'Dubai City Tour with Burj Khalifa',
          description: 'Explore the magnificent city of Dubai with our comprehensive tour package including Burj Khalifa visit.',
          price_adult: 2500,
          price_child: 1800,
          price_infant: 0,
          duration: '8 hours',
          category: 'city-tour',
          highlights: ['Burj Khalifa At The Top', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Marina', 'Gold & Spice Souks'],
          whats_included: ['Transportation', 'Professional Tour Guide', 'Burj Khalifa Tickets', 'Hotel Pickup & Drop-off', 'Refreshments'],
          languages: ['English', 'Hindi', 'Arabic'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
          available_times: ['9:00 AM', '2:00 PM', '6:00 PM'],
          instant_confirmation: true,
          free_cancellation: true
        },
        {
          title: 'Desert Safari with BBQ Dinner',
          description: 'Experience the thrill of desert safari with dune bashing, camel riding, and traditional BBQ dinner.',
          price_adult: 1500,
          price_child: 1200,
          price_infant: 0,
          duration: '6 hours',
          category: 'adventure',
          highlights: ['Dune Bashing', 'Camel Riding', 'Sandboarding', 'Henna Painting', 'Traditional Shows', 'BBQ Dinner'],
          whats_included: ['4WD Transportation', 'Dune Bashing', 'Camel Ride', 'BBQ Dinner', 'Traditional Entertainment', 'Hotel Pickup & Drop-off'],
          languages: ['English', 'Hindi', 'Arabic'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1539650116574-75c0c6d73a14?w=800'],
          available_times: ['3:30 PM'],
          instant_confirmation: true,
          free_cancellation: true
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
          description: 'Experience the best of UAE with our 3-day Dubai and Abu Dhabi package including major attractions.',
          price_adult: 15000,
          price_child: 12000,
          price_infant: 0,
          days: 3,
          nights: 2,
          highlights: ['Dubai City Tour', 'Abu Dhabi City Tour', 'Desert Safari', 'Dhow Cruise', 'Sheikh Zayed Mosque'],
          whats_included: ['Hotel Accommodation (4-Star)', 'Daily Breakfast', 'Transportation', 'Professional Tour Guide', 'All Entry Tickets'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800']
        }
      ]);

      if (packagesError) throw packagesError;

      // Create sample attraction tickets
      const { error: ticketsError } = await supabase.from('attraction_tickets').upsert([
        {
          title: 'Burj Khalifa At The Top (Level 124 & 125)',
          description: 'Experience breathtaking views from the world\'s tallest building. Skip the lines with instant digital tickets.',
          price_adult: 400,
          price_child: 300,
          price_infant: 0,
          location: 'Downtown Dubai',
          instant_delivery: true,
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800']
        },
        {
          title: 'Dubai Aquarium & Underwater Zoo',
          description: 'Walk through one of the world\'s largest aquariums and discover marine life from around the globe.',
          price_adult: 250,
          price_child: 200,
          price_infant: 0,
          location: 'Dubai Mall',
          instant_delivery: true,
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800']
        }
      ]);

      if (ticketsError) throw ticketsError;

      // Create sample visa services
      const { error: visasError } = await supabase.from('visa_services').upsert([
        {
          country: 'UAE',
          visa_type: '30 Days Tourist Visa',
          price: 350,
          processing_time: '3-5 working days',
          description: 'Single entry tourist visa valid for 30 days from arrival date.',
          requirements: ['Passport copy (6 months validity)', 'Passport size photo', 'Flight tickets', 'Hotel booking confirmation'],
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
        },
        {
          country: 'India',
          visa_type: 'e-Tourist Visa',
          price: 500,
          processing_time: '5-7 working days',
          description: 'Electronic tourist visa for India valid for 30 days with double entry.',
          requirements: ['Passport copy', 'Digital photo', 'Travel itinerary', 'Bank statements'],
          is_featured: false,
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
          subtitle: 'Your Gateway to Amazing Dubai & UAE Experiences',
          image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
          button_text: 'Explore Tours',
          link_url: '/tours',
          display_order: 1,
          is_active: true
        },
        {
          title: 'Desert Safari Adventures',
          subtitle: 'Experience the Magic of Arabian Desert',
          image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a14?w=1200',
          button_text: 'Book Safari',
          link_url: '/tours',
          display_order: 2,
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
        },
        {
          setting_key: 'site_name',
          setting_value: 'TripHabibi',
          setting_type: 'text',
          description: 'Website name'
        },
        {
          setting_key: 'support_email',
          setting_value: 'support@triphabibi.in',
          setting_type: 'text',
          description: 'Support email address'
        }
      ]);

      if (settingsError) throw settingsError;
      
      setProgress(100);
      updateStepStatus(2, 'completed');

      toast({
        title: "Installation Complete!",
        description: "Your TripHabibi system has been successfully set up with demo data.",
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
