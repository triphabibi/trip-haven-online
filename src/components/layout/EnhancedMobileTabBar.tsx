import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, FileText, Ticket, User, Phone } from 'lucide-react';

const EnhancedMobileTabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Home', path: '/', icon: Home, emoji: '🏠' },
    { name: 'Tours', path: '/tours', icon: MapPin, emoji: '🎭' },
    { name: 'Visas', path: '/visas', icon: FileText, emoji: '📋' },
    { name: 'Tickets', path: '/tickets', icon: Ticket, emoji: '🎫' },
    { name: 'Support', path: '/contact', icon: Phone, emoji: '💬' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-all duration-300 ${
                isActive
                  ? 'text-blue-600 scale-110'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-100 shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}>
                  <span className="text-lg">{tab.emoji}</span>
                </div>
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedMobileTabBar;