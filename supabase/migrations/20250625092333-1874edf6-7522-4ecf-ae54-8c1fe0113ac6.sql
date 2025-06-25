
-- Insert sample data for tour packages
INSERT INTO public.tour_packages (title, description, nights, days, price_adult, price_child, price_infant, highlights, whats_included, itinerary, is_featured, status, rating, total_reviews, image_urls) VALUES
('Golden Triangle Classic', 'Experience India''s most iconic destinations - Delhi, Agra, and Jaipur in this comprehensive 6-day tour package covering historical monuments, cultural experiences, and local cuisine.', 5, 6, 45000.00, 35000.00, 5000.00, 
ARRAY['Visit to Taj Mahal at sunrise', 'Explore Red Fort and Jama Masjid', 'Amber Fort elephant ride', 'Local bazaar shopping', 'Cultural performances'], 
ARRAY['5 nights hotel accommodation', 'Daily breakfast and dinner', 'Private AC transportation', 'Professional guide', 'All monument entry fees', 'Airport transfers'],
'{"day1": {"title": "Arrival in Delhi", "activities": ["Airport pickup", "Hotel check-in", "Red Fort visit", "Jama Masjid exploration"]}, "day2": {"title": "Delhi Sightseeing", "activities": ["India Gate", "Raj Ghat", "Humayun Tomb", "Qutub Minar"]}, "day3": {"title": "Delhi to Agra", "activities": ["Drive to Agra", "Taj Mahal visit", "Agra Fort exploration"]}, "day4": {"title": "Agra to Jaipur", "activities": ["Fatehpur Sikri", "Drive to Jaipur", "City Palace visit"]}, "day5": {"title": "Jaipur Sightseeing", "activities": ["Amber Fort", "Hawa Mahal", "Jantar Mantar", "Local markets"]}, "day6": {"title": "Departure", "activities": ["Hotel checkout", "Airport transfer"]}}',
true, 'active', 4.5, 127, 
ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 'https://images.unsplash.com/photo-1599661046289-e31897846e50?w=800']),

('Kerala Backwaters Escape', 'Immerse yourself in the serene backwaters of Kerala with houseboat stays, Ayurvedic treatments, and traditional cuisine in this relaxing 4-day package.', 3, 4, 28000.00, 20000.00, 3000.00,
ARRAY['Traditional houseboat stay', 'Ayurvedic spa treatments', 'Kathakali dance performance', 'Spice plantation tour', 'Sunset cruise'],
ARRAY['3 nights accommodation (2 nights houseboat + 1 night resort)', 'All meals included', 'Ayurvedic treatments', 'Guided tours', 'Airport transfers', 'Traditional performances'],
'{"day1": {"title": "Arrival in Kochi", "activities": ["Airport pickup", "Check-in to resort", "Kathakali show", "Chinese fishing nets"]}, "day2": {"title": "Alleppey Houseboat", "activities": ["Drive to Alleppey", "Houseboat check-in", "Backwater cruise", "Traditional lunch"]}, "day3": {"title": "Backwaters & Spa", "activities": ["Morning cruise", "Ayurvedic spa", "Spice plantation visit", "Sunset viewing"]}, "day4": {"title": "Departure", "activities": ["Morning leisure", "Check-out", "Airport transfer"]}}',
true, 'active', 4.3, 89, 
ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'https://images.unsplash.com/photo-1567307647728-41c1b2fafa96?w=800']),

('Rajasthan Royal Heritage', 'Discover the royal heritage of Rajasthan with palace stays, camel safaris, and cultural experiences in Jaipur, Jodhpur, and Jaisalmer.', 7, 8, 65000.00, 45000.00, 8000.00,
ARRAY['Stay in heritage palaces', 'Camel safari in Thar Desert', 'Folk music and dance', 'Royal cuisine experiences', 'Vintage car rides'],
ARRAY['7 nights heritage accommodation', 'All meals', 'Desert camping', 'Camel safari', 'Cultural performances', 'Private transportation', 'Professional guide'],
'{"day1": {"title": "Arrival in Jaipur", "activities": ["Airport pickup", "Palace hotel check-in", "City orientation"]}, "day2": {"title": "Jaipur Exploration", "activities": ["Amber Fort", "City Palace", "Hawa Mahal", "Local markets"]}, "day3": {"title": "Jaipur to Jodhpur", "activities": ["Drive to Jodhpur", "Mehrangarh Fort", "Jaswant Thada"]}, "day4": {"title": "Jodhpur to Jaisalmer", "activities": ["Morning sightseeing", "Drive to Jaisalmer", "Evening at leisure"]}, "day5": {"title": "Jaisalmer Fort & Desert", "activities": ["Fort exploration", "Desert safari", "Camel ride", "Desert camping"]}, "day6": {"title": "Jaisalmer to Jodhpur", "activities": ["Morning leisure", "Drive back", "Cultural show"]}, "day7": {"title": "Jodhpur to Jaipur", "activities": ["Return journey", "Shopping", "Farewell dinner"]}, "day8": {"title": "Departure", "activities": ["Hotel checkout", "Airport transfer"]}}',
false, 'active', 4.7, 203, 
ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e50?w=800', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800']),

('Goa Beach Paradise', 'Relax on pristine beaches, enjoy water sports, explore Portuguese heritage, and experience vibrant nightlife in this 3-day Goa getaway.', 2, 3, 18000.00, 12000.00, 2000.00,
ARRAY['Beach resort stay', 'Water sports activities', 'Portuguese heritage tour', 'Sunset cruise', 'Beach parties'],
ARRAY['2 nights beach resort', 'Daily breakfast', 'Water sports', 'Sightseeing tours', 'Airport transfers', 'Welcome drinks'],
'{"day1": {"title": "Arrival in Goa", "activities": ["Airport pickup", "Beach resort check-in", "Baga Beach visit", "Welcome party"]}, "day2": {"title": "Water Sports & Heritage", "activities": ["Water sports at Calangute", "Old Goa churches", "Spice plantation", "Sunset cruise"]}, "day3": {"title": "Departure", "activities": ["Beach leisure", "Shopping at markets", "Airport transfer"]}}',
false, 'active', 4.2, 156, 
ARRAY['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 'https://images.unsplash.com/photo-1570197526499-39035843ce35?w=800', 'https://images.unsplash.com/photo-1559113102-7f5ad4f447b4?w=800']);

-- Insert sample data for attraction tickets
INSERT INTO public.attraction_tickets (title, description, location, price_adult, price_child, price_infant, instant_delivery, is_featured, status, rating, total_reviews, image_urls, ticket_pdf_urls) VALUES
('Taj Mahal Entry Ticket', 'Skip the line entry ticket to the magnificent Taj Mahal, one of the Seven Wonders of the World. Includes access to main mausoleum and gardens.', 'Agra, Uttar Pradesh', 1100.00, 550.00, 0.00, true, true, 'active', 4.8, 2341,
ARRAY['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'],
ARRAY['https://example.com/tickets/taj-mahal-ticket.pdf']),

('Red Fort Delhi Ticket', 'Explore the historic Red Fort (Lal Qila) in Delhi, a UNESCO World Heritage Site and symbol of Mughal power and grandeur.', 'Delhi', 50.00, 25.00, 0.00, true, false, 'active', 4.3, 456,
ARRAY['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', 'https://images.unsplash.com/photo-1586083702768-190ae093d34d?w=800'],
ARRAY['https://example.com/tickets/red-fort-ticket.pdf']),

('Amber Fort Jaipur Entry', 'Visit the majestic Amber Fort with its stunning architecture, mirror work, and panoramic views of Maota Lake and surrounding hills.', 'Jaipur, Rajasthan', 200.00, 100.00, 0.00, true, true, 'active', 4.6, 789,
ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e50?w=800', 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800'],
ARRAY['https://example.com/tickets/amber-fort-ticket.pdf']),

('Kerala Backwater Cruise', 'Enjoy a scenic cruise through the famous backwaters of Alleppey with traditional lunch and refreshments included.', 'Alleppey, Kerala', 2500.00, 1500.00, 500.00, true, false, 'active', 4.4, 234,
ARRAY['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
ARRAY['https://example.com/tickets/backwater-cruise-ticket.pdf']),

('Goa Water Sports Combo', 'Experience thrilling water sports including parasailing, jet skiing, and banana boat rides at the beautiful beaches of North Goa.', 'North Goa', 3500.00, 2500.00, 0.00, true, true, 'active', 4.5, 567,
ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'https://images.unsplash.com/photo-1559113102-7f5ad4f447b4?w=800'],
ARRAY['https://example.com/tickets/goa-watersports-ticket.pdf']),

('Mysore Palace Entry', 'Explore the opulent Mysore Palace, former seat of the Wodeyar dynasty, known for its Indo-Saracenic architecture and royal grandeur.', 'Mysore, Karnataka', 70.00, 35.00, 0.00, true, false, 'active', 4.4, 345,
ARRAY['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800'],
ARRAY['https://example.com/tickets/mysore-palace-ticket.pdf']);

-- Insert sample homepage sliders
INSERT INTO public.homepage_sliders (title, subtitle, image_url, link_url, button_text, display_order, is_active) VALUES
('Discover Incredible India', 'Experience the magic of diverse cultures, heritage, and natural beauty', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200', '/packages', 'Explore Packages', 1, true),
('Golden Triangle Tours', 'Delhi, Agra & Jaipur - The classic Indian experience', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200', '/packages', 'Book Now', 2, true),
('Kerala Backwaters', 'Serene waters, lush landscapes, and peaceful cruises', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200', '/packages', 'Discover Kerala', 3, true);

-- Insert sample reviews
INSERT INTO public.reviews (service_type, service_id, customer_name, rating, review_text, is_verified, is_published) VALUES
('package', (SELECT id FROM public.tour_packages WHERE title = 'Golden Triangle Classic' LIMIT 1), 'Sarah Johnson', 5, 'Amazing experience! The Taj Mahal at sunrise was breathtaking. Our guide was knowledgeable and the accommodations were excellent.', true, true),
('package', (SELECT id FROM public.tour_packages WHERE title = 'Golden Triangle Classic' LIMIT 1), 'Raj Patel', 4, 'Great tour package with good value for money. The itinerary was well planned and we got to see all the major attractions.', true, true),
('package', (SELECT id FROM public.tour_packages WHERE title = 'Kerala Backwaters Escape' LIMIT 1), 'Emily Chen', 5, 'The houseboat experience was magical! The Ayurvedic treatments were so relaxing and the food was delicious.', true, true),
('package', (SELECT id FROM public.tour_packages WHERE title = 'Rajasthan Royal Heritage' LIMIT 1), 'Michael Brown', 5, 'Felt like royalty throughout the trip! The heritage hotels were stunning and the camel safari was unforgettable.', true, true),
('ticket', (SELECT id FROM public.attraction_tickets WHERE title = 'Taj Mahal Entry Ticket' LIMIT 1), 'Anna Kumar', 5, 'Skip the line tickets saved us so much time! The Taj Mahal is even more beautiful in person.', true, true),
('ticket', (SELECT id FROM public.attraction_tickets WHERE title = 'Amber Fort Jaipur Entry' LIMIT 1), 'David Wilson', 4, 'Beautiful architecture and great views. The fort is well preserved and worth visiting.', true, true);
