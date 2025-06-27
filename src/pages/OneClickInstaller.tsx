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
      
      // Create comprehensive sample tours
      const { error: toursError } = await supabase.from('tours').upsert([
        {
          title: 'Dubai City Tour with Burj Khalifa',
          description: 'Explore the magnificent city of Dubai with our comprehensive tour package including Burj Khalifa visit, Dubai Mall, and traditional souks.',
          price_adult: 2500,
          price_child: 1800,
          price_infant: 0,
          duration: '8 hours',
          category: 'city-tour',
          highlights: ['Burj Khalifa At The Top', 'Dubai Mall Shopping', 'Palm Jumeirah Drive', 'Dubai Marina Walk', 'Gold & Spice Souks', 'Photo Stops'],
          whats_included: ['Air-conditioned Transportation', 'Professional English-speaking Guide', 'Burj Khalifa Level 124 Tickets', 'Hotel Pickup & Drop-off', 'Bottled Water', 'Dubai Mall Visit'],
          languages: ['English', 'Hindi', 'Arabic', 'Urdu'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
          available_times: ['9:00 AM', '2:00 PM', '6:00 PM'],
          instant_confirmation: true,
          free_cancellation: true,
          rating: 4.8,
          total_reviews: 145
        },
        {
          title: 'Desert Safari with BBQ Dinner & Entertainment',
          description: 'Experience the thrill of desert safari with dune bashing, camel riding, sandboarding, and traditional BBQ dinner with live entertainment.',
          price_adult: 1500,
          price_child: 1200,
          price_infant: 0,
          duration: '6 hours',
          category: 'adventure',
          highlights: ['Thrilling Dune Bashing', 'Camel Riding Experience', 'Sandboarding Fun', 'Henna Painting', 'Traditional Tanoura & Belly Dance', 'BBQ Dinner Buffet'],
          whats_included: ['4WD Desert Safari', 'Professional Safari Driver', 'Camel Ride', 'Sandboarding', 'BBQ Dinner Buffet', 'Traditional Entertainment Shows', 'Hotel Pickup & Drop-off', 'Soft Drinks & Water'],
          languages: ['English', 'Hindi', 'Arabic'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1539650116574-75c0c6d73a14?w=800'],
          available_times: ['3:30 PM'],
          instant_confirmation: true,
          free_cancellation: true,
          rating: 4.9,
          total_reviews: 289
        },
        {
          title: 'Abu Dhabi City Tour with Sheikh Zayed Mosque',
          description: 'Discover the capital of UAE with visits to Sheikh Zayed Grand Mosque, Emirates Palace, and Corniche Beach.',
          price_adult: 2200,
          price_child: 1600,
          price_infant: 0,
          duration: '10 hours',
          category: 'city-tour',
          highlights: ['Sheikh Zayed Grand Mosque', 'Emirates Palace Hotel', 'Heritage Village', 'Corniche Beach', 'Ferrari World (Outside)', 'Dates Market'],
          whats_included: ['Transportation', 'Professional Guide', 'Mosque Entry', 'Hotel Pickup & Drop-off', 'Lunch', 'Bottled Water'],
          languages: ['English', 'Hindi', 'Arabic'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1578662996442-48f060a43f9d?w=800'],
          available_times: ['8:00 AM'],
          instant_confirmation: true,
          free_cancellation: true,
          rating: 4.7,
          total_reviews: 198
        },
        {
          title: 'Dubai Marina Dhow Cruise with Dinner',
          description: 'Enjoy a romantic evening cruise along Dubai Marina with international buffet dinner and stunning city views.',
          price_adult: 1800,
          price_child: 1400,
          price_infant: 0,
          duration: '3 hours',
          category: 'cruise',
          highlights: ['Traditional Dhow Boat', 'Dubai Marina Views', 'International Buffet Dinner', 'Live Entertainment', 'Welcome Drinks', 'Photo Opportunities'],
          whats_included: ['Marina Dhow Cruise', 'International Buffet Dinner', 'Welcome Drinks', 'Live Entertainment', 'Hotel Pickup & Drop-off', 'Traditional Arabic Coffee'],
          languages: ['English', 'Hindi'],
          status: 'active',
          is_featured: false,
          image_urls: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
          available_times: ['8:00 PM'],
          instant_confirmation: true,
          free_cancellation: true,
          rating: 4.6,
          total_reviews: 167
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
          title: 'Dubai & Abu Dhabi 3 Days Complete Package',
          description: 'Experience the best of UAE with our comprehensive 3-day package covering Dubai city tour, desert safari, Abu Dhabi tour, and dhow cruise.',
          price_adult: 15000,
          price_child: 12000,
          price_infant: 0,
          days: 3,
          nights: 2,
          highlights: ['Dubai City Tour with Burj Khalifa', 'Abu Dhabi City Tour', 'Desert Safari with BBQ', 'Dhow Cruise Dinner', 'Sheikh Zayed Mosque', 'Dubai Mall Shopping'],
          whats_included: ['4-Star Hotel Accommodation', 'Daily Breakfast', 'All Transportation', 'Professional Tour Guide', 'All Entry Tickets', 'Desert Safari', 'Dhow Cruise Dinner', 'Airport Transfers'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
          rating: 4.8,
          total_reviews: 89
        },
        {
          title: 'Dubai Luxury 5 Days Package',
          description: 'Ultimate luxury experience in Dubai with 5-star accommodation, premium tours, and exclusive experiences.',
          price_adult: 35000,
          price_child: 28000,
          price_infant: 0,
          days: 5,
          nights: 4,
          highlights: ['5-Star Luxury Hotel', 'Private City Tours', 'VIP Desert Safari', 'Helicopter Tour', 'Luxury Shopping', 'Fine Dining Experiences'],
          whats_included: ['5-Star Hotel Accommodation', 'All Meals', 'Private Transportation', 'VIP Experiences', 'Helicopter Tour', 'Shopping Credits', 'Spa Treatments'],
          status: 'active',
          is_featured: true,
          image_urls: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
          rating: 4.9,
          total_reviews: 45
        }
      ]);

      if (packagesError) throw packagesError;

      // Create sample attraction tickets
      const { error: ticketsError } = await supabase.from('attraction_tickets').upsert([
        {
          title: 'Burj Khalifa At The Top (Level 124 & 125)',
          description: 'Experience breathtaking 360-degree views from the world\'s tallest building. Skip the lines with instant digital tickets.',
          price_adult: 400,
          price_child: 300,
          price_infant: 0,
          location: 'Downtown Dubai',
          instant_delivery: true,
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
          rating: 4.8,
          total_reviews: 2456
        },
        {
          title: 'Dubai Aquarium & Underwater Zoo',
          description: 'Walk through one of the world\'s largest suspended aquariums and discover over 33,000 marine animals.',
          price_adult: 250,
          price_child: 200,
          price_infant: 0,
          location: 'Dubai Mall',
          instant_delivery: true,
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800'],
          rating: 4.6,
          total_reviews: 1829
        },
        {
          title: 'Dubai Frame Sky Deck Experience',
          description: 'Visit the iconic Dubai Frame and enjoy panoramic views of old and new Dubai from the sky deck.',
          price_adult: 180,
          price_child: 150,
          price_infant: 0,
          location: 'Zabeel Park',
          instant_delivery: true,
          is_featured: false,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
          rating: 4.5,
          total_reviews: 967
        },
        {
          title: 'IMG Worlds of Adventure - Full Day Pass',
          description: 'World\'s largest indoor theme park with thrilling rides and attractions based on Marvel and Cartoon Network characters.',
          price_adult: 850,
          price_child: 750,
          price_infant: 0,
          location: 'City of Arabia, Dubai',
          instant_delivery: true,
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1594736797933-d0c13be44d08?w=800'],
          rating: 4.7,
          total_reviews: 1234
        }
      ]);

      if (ticketsError) throw ticketsError;

      // Create comprehensive visa services
      const { error: visasError } = await supabase.from('visa_services').upsert([
        {
          country: 'UAE',
          visa_type: '30 Days Tourist Visa',
          price: 350,
          processing_time: '3-5 working days',
          description: 'Single entry tourist visa valid for 30 days from arrival date. Perfect for leisure travelers.',
          requirements: ['Passport copy (minimum 6 months validity)', 'Passport size photograph (white background)', 'Confirmed flight tickets', 'Hotel booking confirmation', 'Bank statement (last 3 months)', 'Visa application form'],
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
        },
        {
          country: 'UAE',
          visa_type: '90 Days Multiple Entry Visa',
          price: 850,
          processing_time: '5-7 working days',
          description: 'Multiple entry visa valid for 90 days. Ideal for frequent travelers and business visitors.',
          requirements: ['Passport copy (minimum 6 months validity)', 'Passport size photograph', 'Flight tickets', 'Hotel booking', 'Bank statement', 'Employment letter', 'NOC from employer'],
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
        },
        {
          country: 'India',
          visa_type: 'e-Tourist Visa (30 Days)',
          price: 500,
          processing_time: '3-5 working days',
          description: 'Electronic tourist visa for India valid for 30 days with double entry facility.',
          requirements: ['Passport copy (6 months validity)', 'Digital passport photo', 'Travel itinerary', 'Hotel bookings', 'Bank statements', 'Return flight tickets'],
          is_featured: true,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800']
        },
        {
          country: 'Singapore',
          visa_type: 'Tourist Visa (35 Days)',
          price: 450,
          processing_time: '4-6 working days',
          description: 'Tourist visa for Singapore with 35 days validity and multiple entry option.',
          requirements: ['Passport copy', 'Passport photos', 'Flight bookings', 'Hotel confirmations', 'Bank statements', 'Travel insurance', 'Form 14A completed'],
          is_featured: false,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800']
        },
        {
          country: 'Thailand',
          visa_type: 'Tourist Visa (60 Days)',
          price: 300,
          processing_time: '2-4 working days',
          description: 'Tourist visa for Thailand valid for 60 days with single entry.',
          requirements: ['Passport copy (6 months validity)', '2 passport photos', 'Flight tickets', 'Hotel bookings', 'Bank certificate', 'Visa application form'],
          is_featured: false,
          status: 'active',
          image_urls: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800']
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
        },
        {
          title: 'Worldwide Visa Services',
          subtitle: 'Quick & Reliable Visa Processing',
          image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
          button_text: 'Apply Now',
          link_url: '/visas',
          display_order: 3,
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
          setting_value: 'info@triphabibi.com',
          setting_type: 'text',
          description: 'Support email address'
        },
        {
          setting_key: 'support_phone',
          setting_value: '+91-9125009662',
          setting_type: 'text',
          description: 'Support phone number'
        },
        {
          setting_key: 'office_address',
          setting_value: 'Mumbai, Maharashtra, India',
          setting_type: 'text',
          description: 'Office address'
        }
      ]);

      if (settingsError) throw settingsError;
      
      setProgress(100);
      updateStepStatus(2, 'completed');

      toast({
        title: "Installation Complete!",
        description: "Your TripHabibi system has been successfully set up with comprehensive demo data including tours, visas, tickets, and packages.",
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
              Set up your complete travel booking system with comprehensive demo data including tours, visas, tickets, and packages.
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
            <p>After installation, you can:</p>
            <p><strong>• Create admin account at /auth</strong></p>
            <p><strong>• Email:</strong> admin@triphabibi.in</p>
            <p><strong>• Phone:</strong> +91-9125009662</p>
            <p><strong>• Contact:</strong> info@triphabibi.com</p>
            <p className="mt-2">
              Demo data includes: Tours, Visas, Tickets, Packages, and Site Settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OneClickInstaller;
