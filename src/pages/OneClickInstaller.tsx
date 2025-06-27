
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress"

const OneClickInstaller = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationStep, setInstallationStep] = useState('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const installDemoData = async () => {
    setIsInstalling(true);
    setProgress(0);
    
    try {
      // Step 1: Install Tours
      setInstallationStep('Creating demo tours...');
      setProgress(15);
      
      const tourData = [
        {
          title: 'Dubai City Tour with Burj Khalifa',
          description: 'Explore Dubai\'s iconic landmarks including Burj Khalifa, Dubai Mall, and Dubai Fountain. Experience the modern marvels of this incredible city with our expert guide.',
          price_adult: 2500,
          price_child: 1800,
          price_infant: 0,
          duration: '8 hours',
          highlights: [
            'Visit the tallest building in the world - Burj Khalifa',
            'Dubai Mall shopping experience',
            'Dubai Fountain show',
            'Traditional Abra boat ride',
            'Gold and Spice Souks visit',
            'Professional English-speaking guide'
          ],
          whats_included: [
            'Hotel pickup and drop-off',
            'Professional tour guide',
            'Transportation in air-conditioned vehicle',
            'Burj Khalifa Level 124 & 125 tickets',
            'Traditional boat ride',
            'All entrance fees'
          ],
          available_times: ['09:00 AM', '02:00 PM', '06:00 PM'],
          languages: ['English', 'Hindi', 'Arabic'],
          image_urls: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
            'https://images.unsplash.com/photo-1549221987-6c5b6c3f5e91?w=800'
          ],
          instant_confirmation: true,
          free_cancellation: true,
          is_featured: true,
          status: 'active' as const,
          rating: 4.8,
          total_reviews: 156
        },
        {
          title: 'Desert Safari with BBQ Dinner',
          description: 'Experience the thrill of dune bashing, camel riding, and traditional entertainment in the Dubai desert. Enjoy a delicious BBQ dinner under the stars.',
          price_adult: 1800,
          price_child: 1200,
          price_infant: 0,
          duration: '6 hours',
          highlights: [
            'Thrilling dune bashing experience',
            'Camel riding in the desert',
            'Traditional henna painting',
            'Falcon photography',
            'Belly dance and Tanoura shows',
            'Unlimited BBQ dinner buffet'
          ],
          whats_included: [
            'Hotel pickup and drop-off',
            'Dune bashing in 4WD vehicle',
            'Camel riding',
            'Entertainment shows',
            'BBQ dinner buffet',
            'Traditional Arabic coffee and dates'
          ],
          available_times: ['03:30 PM', '04:00 PM'],
          languages: ['English', 'Hindi', 'Arabic'],
          image_urls: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'https://images.unsplash.com/photo-1471919743851-c4df8b6ee462?w=800'
          ],
          instant_confirmation: true,
          free_cancellation: true,
          is_featured: true,
          status: 'active' as const,
          rating: 4.6,
          total_reviews: 234
        },
        {
          title: 'Abu Dhabi City Tour from Dubai',
          description: 'Discover the capital city of UAE with visits to Sheikh Zayed Grand Mosque, Emirates Palace, and Heritage Village. A perfect day trip from Dubai.',
          price_adult: 2200,
          price_child: 1500,
          price_infant: 0,
          duration: '10 hours',
          highlights: [
            'Sheikh Zayed Grand Mosque visit',
            'Emirates Palace exterior photo stop',
            'Heritage Village cultural experience',
            'Corniche waterfront drive',
            'Yas Island drive-by',
            'Traditional lunch included'
          ],
          whats_included: [
            'Hotel pickup and drop-off from Dubai',
            'Professional tour guide',
            'Transportation in luxury coach',
            'Traditional Arabic lunch',
            'All entrance fees',
            'Bottled water'
          ],
          available_times: ['08:00 AM'],
          languages: ['English', 'Hindi', 'Arabic'],
          image_urls: [
            'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800',
            'https://images.unsplash.com/photo-1587632936871-84c4ba8c58e8?w=800'
          ],
          instant_confirmation: true,
          free_cancellation: true,
          is_featured: false,
          status: 'active' as const,
          rating: 4.7,
          total_reviews: 89
        },
        {
          title: 'Sharjah City Tour - Cultural Heritage',
          description: 'Explore the cultural capital of UAE with visits to traditional souks, museums, and historical sites. Perfect for culture enthusiasts.',
          price_adult: 1500,
          price_child: 1000,
          price_infant: 0,
          duration: '6 hours',
          highlights: [
            'Blue Souk (Central Market) shopping',
            'King Faisal Mosque visit',
            'Al Noor Mosque exterior',
            'Traditional Heritage Area',
            'Sharjah Art Museum',
            'Traditional Arabic coffee'
          ],
          whats_included: [
            'Hotel pickup and drop-off',
            'Professional guide',
            'Air-conditioned transportation',
            'Museum entrance fees',
            'Refreshments',
            'Cultural experience'
          ],
          available_times: ['09:00 AM', '02:00 PM'],
          languages: ['English', 'Hindi', 'Arabic'],
          image_urls: [
            'https://images.unsplash.com/photo-1587975570949-d432c2fefc0b?w=800'
          ],
          instant_confirmation: true,
          free_cancellation: true,
          is_featured: false,
          status: 'active' as const,
          rating: 4.4,
          total_reviews: 67
        }
      ];

      for (const tour of tourData) {
        await supabase.from('tours').insert(tour);
      }

      // Step 2: Install Visa Services
      setInstallationStep('Creating visa services...');
      setProgress(30);
      
      const visaData = [
        {
          country: 'UAE',
          visa_type: 'Tourist Visa - 30 Days',
          description: 'Single entry tourist visa valid for 30 days from date of entry. Perfect for short visits and tourism.',
          price: 1200,
          processing_time: '3-5 working days',
          requirements: [
            'Passport with minimum 6 months validity',
            'Passport size photographs (2 copies)',
            'Confirmed flight tickets',
            'Hotel booking confirmation',
            'Bank statement (last 3 months)',
            'Employment certificate'
          ],
          image_urls: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500'
          ],
          is_featured: true,
          status: 'active' as const
        },
        {
          country: 'UAE',
          visa_type: 'Tourist Visa - 90 Days',
          description: 'Multiple entry tourist visa valid for 90 days. Ideal for extended stays and multiple visits.',
          price: 2500,
          processing_time: '5-7 working days',
          requirements: [
            'Passport with minimum 6 months validity',
            'Passport size photographs (2 copies)',
            'Confirmed flight tickets',
            'Hotel booking confirmation',
            'Bank statement (last 6 months)',
            'Employment certificate',
            'Salary certificate'
          ],
          image_urls: [
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500'
          ],
          is_featured: true,
          status: 'active' as const
        },
        {
          country: 'Oman',
          visa_type: 'Tourist Visa - 30 Days',
          description: 'Single entry tourist visa for Oman. Explore the beautiful landscapes and rich culture of Oman.',
          price: 800,
          processing_time: '2-3 working days',
          requirements: [
            'Passport with minimum 6 months validity',
            'Passport size photographs',
            'Flight booking confirmation',
            'Hotel reservation',
            'Bank statement'
          ],
          image_urls: [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
          ],
          is_featured: false,
          status: 'active' as const
        },
        {
          country: 'Saudi Arabia',
          visa_type: 'Tourist Visa - Umrah',
          description: 'Special visa for religious tourism and Umrah pilgrimage. Includes multiple entry facility.',
          price: 1500,
          processing_time: '5-7 working days',
          requirements: [
            'Passport with minimum 6 months validity',
            'Passport photographs',
            'Vaccination certificate',
            'Hotel booking in Saudi Arabia',
            'Flight confirmation',
            'Bank statement',
            'Religious tour confirmation'
          ],
          image_urls: [
            'https://images.unsplash.com/photo-1578643463897-5d2e4d4ab471?w=500'
          ],
          is_featured: true,
          status: 'active' as const
        }
      ];

      for (const visa of visaData) {
        await supabase.from('visa_services').insert(visa);
      }

      // Step 3: Install Attraction Tickets
      setInstallationStep('Creating attraction tickets...');
      setProgress(45);
      
      const ticketData = [
        {
          title: 'Burj Khalifa Level 124 & 125',
          description: 'Skip the line access to the world\'s tallest building. Enjoy breathtaking views from levels 124 and 125.',
          price_adult: 800,
          price_child: 600,
          price_infant: 0,
          location: 'Downtown Dubai',
          image_urls: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500'
          ],
          instant_delivery: true,
          is_featured: true,
          rating: 4.8,
          total_reviews: 1250,
          status: 'active' as const
        },
        {
          title: 'Dubai Aquarium & Underwater Zoo',
          description: 'Explore one of the largest suspended aquariums in the world with over 33,000 aquatic animals.',
          price_adult: 450,
          price_child: 350,
          price_infant: 0,
          location: 'Dubai Mall',
          image_urls: [
            'https://images.unsplash.com/photo-1578569986207-1d09c4b89c30?w=500'
          ],
          instant_delivery: true,
          is_featured: true,
          rating: 4.6,
          total_reviews: 876,
          status: 'active' as const
        },
        {
          title: 'Dubai Frame Tickets',
          description: 'Visit the iconic Dubai Frame and see the city from a unique perspective with panoramic views.',
          price_adult: 300,
          price_child: 200,
          price_infant: 0,
          location: 'Zabeel Park',
          image_urls: [
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500'
          ],
          instant_delivery: true,
          is_featured: false,
          rating: 4.4,
          total_reviews: 324,
          status: 'active' as const
        },
        {
          title: 'Global Village Entry Ticket',
          description: 'Experience cultures from around the world at Dubai\'s most popular family destination.',
          price_adult: 150,
          price_child: 150,
          price_infant: 0,
          location: 'Global Village',
          image_urls: [
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'
          ],
          instant_delivery: true,
          is_featured: false,
          rating: 4.3,
          total_reviews: 567,
          status: 'active' as const
        }
      ];

      for (const ticket of ticketData) {
        await supabase.from('attraction_tickets').insert(ticket);
      }

      // Step 4: Install Tour Packages
      setInstallationStep('Creating tour packages...');
      setProgress(60);
      
      const packageData = [
        {
          title: 'Dubai Explorer - 4 Days 3 Nights',
          description: 'Complete Dubai experience package including city tour, desert safari, and cultural experiences.',
          days: 4,
          nights: 3,
          price_adult: 15000,
          price_child: 10000,
          price_infant: 0,
          highlights: [
            'Dubai City Tour with Burj Khalifa',
            'Desert Safari with BBQ Dinner',
            'Abu Dhabi Day Trip',
            '3-star hotel accommodation',
            'Daily breakfast included',
            'Airport transfers'
          ],
          whats_included: [
            '3 nights hotel accommodation',
            'Daily breakfast',
            'All tours as per itinerary',
            'Airport transfers',
            'Professional guide',
            'All entrance fees'
          ],
          itinerary: {
            "Day 1": {
              "title": "Arrival & Dubai City Tour",
              "activities": [
                "Airport pickup and hotel check-in",
                "Dubai City Tour - Burj Khalifa, Dubai Mall",
                "Dubai Fountain show",
                "Traditional dinner at local restaurant"
              ]
            },
            "Day 2": {
              "title": "Desert Safari Adventure",
              "activities": [
                "Leisure morning at hotel",
                "Desert Safari pickup (3:30 PM)",
                "Dune bashing and camel riding",
                "BBQ dinner with entertainment",
                "Return to hotel"
              ]
            },
            "Day 3": {
              "title": "Abu Dhabi Day Trip",
              "activities": [
                "Early morning pickup for Abu Dhabi",
                "Sheikh Zayed Grand Mosque visit",
                "Emirates Palace photo stop",
                "Traditional lunch",
                "Heritage Village visit",
                "Return to Dubai"
              ]
            },
            "Day 4": {
              "title": "Departure",
              "activities": [
                "Hotel checkout",
                "Last minute shopping (optional)",
                "Airport transfer for departure"
              ]
            }
          },
          image_urls: [
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
          ],
          is_featured: true,
          status: 'active' as const,
          rating: 4.7,
          total_reviews: 89
        },
        {
          title: 'UAE Grand Tour - 7 Days 6 Nights',
          description: 'Comprehensive UAE experience covering Dubai, Abu Dhabi, and Sharjah with luxury accommodations.',
          days: 7,
          nights: 6,
          price_adult: 28000,
          price_child: 18000,
          price_infant: 0,
          highlights: [
            'Complete Dubai exploration',
            'Abu Dhabi city and culture',
            'Sharjah heritage tour',
            '4-star hotel stays',
            'All meals included',
            'Luxury transportation'
          ],
          whats_included: [
            '6 nights 4-star hotel accommodation',
            'All meals (breakfast, lunch, dinner)',
            'All tours and excursions',
            'Airport transfers',
            'Professional guide throughout',
            'All entrance fees and permits'
          ],
          itinerary: {
            "Day 1": "Arrival in Dubai, hotel check-in, welcome dinner",
            "Day 2": "Dubai City Tour, Burj Khalifa, Dubai Mall",
            "Day 3": "Desert Safari, cultural evening",
            "Day 4": "Abu Dhabi day trip, Grand Mosque",
            "Day 5": "Sharjah cultural tour",
            "Day 6": "Free day for shopping and relaxation",
            "Day 7": "Departure"
          },
          image_urls: [
            'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800'
          ],
          is_featured: true,
          status: 'active' as const,
          rating: 4.9,
          total_reviews: 45
        }
      ];

      for (const pkg of packageData) {
        await supabase.from('tour_packages').insert(pkg);
      }

      // Step 5: Site Settings
      setInstallationStep('Configuring site settings...');
      setProgress(80);
      
      const siteSettings = [
        { setting_key: 'site_name', setting_value: 'TripHabibi', description: 'Website name' },
        { setting_key: 'contact_email', setting_value: 'info@triphabibi.com', description: 'Contact email' },
        { setting_key: 'contact_phone', setting_value: '+91-9125009662', description: 'Contact phone' },
        { setting_key: 'whatsapp_number', setting_value: '919125009662', description: 'WhatsApp number' },
        { setting_key: 'company_address', setting_value: 'Dubai, United Arab Emirates', description: 'Company address' },
        { setting_key: 'default_currency', setting_value: 'INR', description: 'Default currency' },
        { setting_key: 'timezone', setting_value: 'Asia/Dubai', description: 'Default timezone' }
      ];

      for (const setting of siteSettings) {
        await supabase.from('site_settings').upsert(setting, { onConflict: 'setting_key' });
      }

      // Step 6: Promo Codes
      setInstallationStep('Creating promo codes...');
      setProgress(90);
      
      const promoCodes = [
        {
          code: 'WELCOME10',
          discount_type: 'percentage',
          discount_value: 10,
          max_uses: 100,
          current_uses: 0,
          applicable_to: ['tour', 'package'],
          is_active: true,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        },
        {
          code: 'FIRST500',
          discount_type: 'fixed',
          discount_value: 500,
          max_uses: 50,
          current_uses: 0,
          applicable_to: ['tour', 'package', 'visa'],
          is_active: true,
          valid_from: new Date().toISOString(),
          valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now
        }
      ];

      for (const promo of promoCodes) {
        await supabase.from('new_promo_codes').insert(promo);
      }

      setProgress(100);
      setInstallationStep('Installation completed successfully!');
      
      toast({
        title: "Installation Complete!",
        description: "Demo data has been successfully installed. You can now explore all features.",
      });

    } catch (error) {
      console.error('Installation error:', error);
      toast({
        title: "Installation Failed",
        description: "There was an error installing demo data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">One-Click Demo Installer</h1>
      <p className="text-gray-600 mb-8">
        This will populate your database with demo data for tours, visas, tickets, and packages.
      </p>

      {isInstalling ? (
        <div className="w-full max-w-md">
          <p className="text-lg font-semibold mb-2">{installationStep}</p>
          <Progress value={progress} className="mb-4" />
        </div>
      ) : (
        <Button onClick={installDemoData} disabled={isInstalling}>
          Install Demo Data
        </Button>
      )}
    </div>
  );
};

export default OneClickInstaller;
