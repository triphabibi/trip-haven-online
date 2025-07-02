
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="text-2xl font-bold text-blue-400 mb-4">TripHabibi</div>
            <p className="text-gray-300 mb-4">
              Your trusted partner for amazing travel experiences across India and beyond.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
              <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
              <Instagram className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
              <Youtube className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors duration-300" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/tours" className="text-gray-300 hover:text-white transition-colors duration-300">Tours</Link></li>
              <li><Link to="/packages" className="text-gray-300 hover:text-white transition-colors duration-300">Packages</Link></li>
              <li><Link to="/tickets" className="text-gray-300 hover:text-white transition-colors duration-300">Tickets</Link></li>
              <li><Link to="/visas" className="text-gray-300 hover:text-white transition-colors duration-300">Visas</Link></li>
              <li><Link to="/transfers" className="text-gray-300 hover:text-white transition-colors duration-300">Transfers</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Day Tours</span></li>
              <li><span className="text-gray-300">Multi-day Packages</span></li>
              <li><span className="text-gray-300">Attraction Tickets</span></li>
              <li><span className="text-gray-300">Visa Processing</span></li>
              <li><span className="text-gray-300">Airport Transfers</span></li>
              <li><span className="text-gray-300">Custom Itineraries</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-gray-300">+91-9125009662</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-gray-300">info@triphabibi.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Company Info */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-blue-400 mb-2">TripHabibi</div>
            <p className="text-gray-300 text-sm">
              Your trusted partner for amazing travel experiences.
            </p>
          </div>

          {/* 3-Column Layout for Mobile */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">Quick Links</h4>
              <ul className="space-y-1">
                <li><Link to="/tours" className="text-gray-300 hover:text-white">Tours</Link></li>
                <li><Link to="/packages" className="text-gray-300 hover:text-white">Packages</Link></li>
                <li><Link to="/visas" className="text-gray-300 hover:text-white">Visas</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">Services</h4>
              <ul className="space-y-1 text-gray-300">
                <li>Tours</li>
                <li>Packages</li>
                <li>Tickets</li>
                <li>Visas</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">Contact</h4>
              <div className="space-y-1 text-gray-300 text-xs">
                <div>📞 +91-9125009662</div>
                <div>📧 info@triphabibi.com</div>
                <div>📍 Mumbai, India</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mt-6">
            <Facebook className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
            <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
            <Instagram className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
            <Youtube className="h-5 w-5 hover:text-blue-400 cursor-pointer" />
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 TripHabibi. All rights reserved. | 
            <Link to="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-white ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
