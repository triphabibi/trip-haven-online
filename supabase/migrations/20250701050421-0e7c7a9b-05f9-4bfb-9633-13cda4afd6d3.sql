
-- First, let's add some dummy tours for testing
INSERT INTO tours (title, description, price_adult, price_child, price_infant, duration, highlights, whats_included, image_urls, languages, available_times, category, is_featured) VALUES
('Dubai City Tour', 'Explore the stunning cityscape of Dubai with visits to iconic landmarks including Burj Khalifa, Dubai Mall, and Dubai Fountain.', 299, 199, 0, '8 hours', ARRAY['Burj Khalifa visit', 'Dubai Mall shopping', 'Dubai Fountain show', 'Traditional souks'], ARRAY['Professional guide', 'Transportation', 'Entry tickets', 'Refreshments'], ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'], ARRAY['English', 'Arabic', 'Hindi'], ARRAY['09:00 AM', '02:00 PM'], 'city-tour', true),

('Desert Safari Adventure', 'Experience the thrill of desert dunes with camel riding, sandboarding, and traditional Bedouin dinner under the stars.', 399, 299, 50, '6 hours', ARRAY['Dune bashing', 'Camel riding', 'Sandboarding', 'BBQ dinner', 'Belly dance show'], ARRAY['4WD vehicle', 'Professional driver', 'All activities', 'Dinner & drinks', 'Hotel pickup/drop'], ARRAY['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'], ARRAY['English', 'Arabic'], ARRAY['03:00 PM', '04:00 PM'], 'adventure', true),

('Abu Dhabi Grand Tour', 'Full day tour to UAE capital including Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and Ferrari World.', 449, 349, 0, '10 hours', ARRAY['Sheikh Zayed Mosque', 'Louvre Abu Dhabi', 'Emirates Palace', 'Corniche drive'], ARRAY['Luxury transport', 'Expert guide', 'Entry fees', 'Lunch'], ARRAY['https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'], ARRAY['English', 'Arabic', 'French'], ARRAY['08:00 AM'], 'city-tour', false),

('Dubai Marina Dhow Cruise', 'Romantic dinner cruise along Dubai Marina with buffet dinner and entertainment in traditional wooden dhow.', 199, 149, 0, '2.5 hours', ARRAY['Marina skyline views', 'Buffet dinner', 'Live entertainment', 'Air-conditioned dhow'], ARRAY['Welcome drinks', 'International buffet', 'Entertainment show', 'Hotel transfers'], ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'], ARRAY['English', 'Arabic'], ARRAY['07:30 PM', '08:00 PM'], 'cruise', true),

('Burj Khalifa At The Top', 'Skip-the-line access to worlds tallest building with breathtaking 360-degree views from observation decks.', 599, 399, 0, '2 hours', ARRAY['148th floor access', 'Skip-the-line entry', '360-degree views', 'High-speed elevators'], ARRAY['Fast-track tickets', 'Audio guide', 'Refreshments', 'Souvenir photo'], ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'], ARRAY['English', 'Arabic', 'Hindi', 'French'], ARRAY['10:00 AM', '02:00 PM', '06:00 PM', '08:00 PM'], 'attraction', true);

-- Add dummy visa services
INSERT INTO visa_services (country, visa_type, price, processing_time, requirements, description, image_urls, is_featured) VALUES
('UAE', 'Tourist Visa - 30 Days', 350, '3-5 working days', ARRAY['Valid passport (6 months)', 'Passport photos', 'Flight tickets', 'Hotel booking', 'Bank statement'], 'Single entry tourist visa valid for 30 days stay in UAE. Perfect for leisure travelers and business visits.', ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'], true),

('UAE', 'Tourist Visa - 90 Days', 850, '5-7 working days', ARRAY['Valid passport (6 months)', 'Passport photos', 'Flight tickets', 'Hotel booking', 'Bank statement', 'Employment letter'], 'Multiple entry tourist visa valid for 90 days stay in UAE. Ideal for extended holidays and business trips.', ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'], true),

('Turkey', 'E-Visa', 150, '1-2 working days', ARRAY['Valid passport', 'Passport photo', 'Travel itinerary'], 'Electronic visa for Turkey valid for 30 days. Quick online processing for tourism and business.', ARRAY['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800'], false),

('Egypt', 'Tourist Visa', 250, '5-7 working days', ARRAY['Valid passport (6 months)', 'Passport photos', 'Flight booking', 'Hotel confirmation'], 'Single entry tourist visa for Egypt valid for 30 days. Explore ancient wonders and modern cities.', ARRAY['https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800'], false),

('Jordan', 'Tourist Visa', 180, '3-4 working days', ARRAY['Valid passport', 'Passport photos', 'Travel documents'], 'Tourist visa for Jordan with 30 days validity. Visit Petra, Dead Sea, and other amazing destinations.', ARRAY['https://images.unsplash.com/photo-1544948503-7ad532f516e4?w=800'], true);

-- Add dummy attraction tickets
INSERT INTO attraction_tickets (title, description, location, price_adult, price_child, price_infant, image_urls, is_featured, instant_delivery) VALUES
('Burj Khalifa Tickets', 'Skip-the-line tickets to the worlds tallest building with access to observation decks on 124th and 125th floors.', 'Downtown Dubai', 299, 199, 0, ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'], true, true),

('Dubai Aquarium & Underwater Zoo', 'Walk through the 48-meter tunnel and experience marine life up close in one of the worlds largest aquariums.', 'Dubai Mall', 149, 99, 0, ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'], true, true),

('IMG Worlds of Adventure', 'Worlds largest indoor theme park featuring Marvel, Cartoon Network, and Lost Valley dinosaur zones.', 'City of Arabia', 299, 249, 0, ARRAY['https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?w=800'], false, true),

('Wild Wadi Waterpark', 'Thrilling water park with over 30 rides and attractions including the famous Jumeirah Sceirah waterslide.', 'Jumeirah', 199, 149, 0, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], true, true),

('Dubai Frame Tickets', 'Iconic golden frame offering panoramic views of old and new Dubai from 150 meters high.', 'Zabeel Park', 99, 79, 0, ARRAY['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'], false, true);

-- Add some tour packages
INSERT INTO tour_packages (title, description, days, nights, price_adult, price_child, price_infant, highlights, whats_included, image_urls, is_featured) VALUES
('Dubai Explorer Package', 'Complete 4-day Dubai experience including city tour, desert safari, marina cruise, and Burj Khalifa visit.', 4, 3, 1299, 999, 199, ARRAY['4-star hotel accommodation', 'All major attractions', 'Desert safari with dinner', 'Marina dhow cruise', 'Professional guide'], ARRAY['3 nights hotel', 'Daily breakfast', 'All transfers', 'Attraction tickets', 'Desert safari', 'Dhow cruise dinner'], ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800'], true),

('UAE Grand Tour', 'Comprehensive 7-day UAE tour covering Dubai, Abu Dhabi, Sharjah, and Al Ain with luxury accommodations.', 7, 6, 2499, 1999, 399, ARRAY['5-star hotels', 'Dubai & Abu Dhabi tours', 'Cultural experiences', 'Desert adventures', 'Shopping tours'], ARRAY['6 nights luxury hotels', 'All meals', 'Private transport', 'Professional guide', 'All attraction tickets', 'Cultural shows'], ARRAY['https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'], true),

('Romantic Dubai Getaway', 'Perfect 3-day romantic package for couples with luxury hotel, spa treatments, and intimate dining experiences.', 3, 2, 1899, 0, 0, ARRAY['5-star beachfront hotel', 'Couples spa treatment', 'Private beach dinner', 'Luxury yacht cruise', 'Professional photography'], ARRAY['2 nights luxury suite', 'Daily breakfast', 'Spa treatments', 'Private transfers', 'Romantic dinners', 'Yacht cruise'], ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'], false);
