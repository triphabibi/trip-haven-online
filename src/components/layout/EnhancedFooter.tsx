import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const EnhancedFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">TripHabibi</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Your trusted travel companion for unforgettable journeys. We make your dream destinations accessible with expert guidance and premium services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/tours" className="text-gray-300 hover:text-blue-400 transition-colors">Tours</Link></li>
                <li><Link to="/packages" className="text-gray-300 hover:text-blue-400 transition-colors">Packages</Link></li>
                <li><Link to="/visas" className="text-gray-300 hover:text-blue-400 transition-colors">Visas</Link></li>
                <li><Link to="/tickets" className="text-gray-300 hover:text-blue-400 transition-colors">Tickets</Link></li>
                <li><Link to="/transfers" className="text-gray-300 hover:text-blue-400 transition-colors">Transfers</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-300">🎭 Guided Tours</span></li>
                <li><span className="text-gray-300">📦 Holiday Packages</span></li>
                <li><span className="text-gray-300">📋 Visa Processing</span></li>
                <li><span className="text-gray-300">🎫 Attraction Tickets</span></li>
                <li><span className="text-gray-300">🚗 Airport Transfers</span></li>
                <li><span className="text-gray-300">💬 24/7 Support</span></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">+91-9125009662</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">info@triphabibi.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Dubai, UAE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 TripHabibi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Point 19: Compact 3-column layout */}
      <div className="md:hidden">
        <div className="max-w-sm mx-auto px-4 py-8">
          {/* Company Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-400 mb-2">TripHabibi</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted travel companion for unforgettable journeys worldwide.
            </p>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-white">Links</h4>
              <ul className="space-y-1">
                <li><Link to="/tours" className="text-gray-300 text-xs hover:text-blue-400">Tours</Link></li>
                <li><Link to="/visas" className="text-gray-300 text-xs hover:text-blue-400">Visas</Link></li>
                <li><Link to="/tickets" className="text-gray-300 text-xs hover:text-blue-400">Tickets</Link></li>
                <li><Link to="/about" className="text-gray-300 text-xs hover:text-blue-400">About</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-white">Services</h4>
              <ul className="space-y-1">
                <li><span className="text-gray-300 text-xs">🎭 Tours</span></li>
                <li><span className="text-gray-300 text-xs">📋 Visas</span></li>
                <li><span className="text-gray-300 text-xs">🎫 Tickets</span></li>
                <li><span className="text-gray-300 text-xs">💬 Support</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-white">Contact</h4>
              <div className="space-y-1">
                <div className="text-gray-300 text-xs">📞 +91-912500</div>
                <div className="text-gray-300 text-xs">📧 info@trip</div>
                <div className="text-gray-300 text-xs">📍 Dubai, UAE</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
              <Youtube className="h-4 w-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-gray-400 text-xs">© 2025 TripHabibi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;