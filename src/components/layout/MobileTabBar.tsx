import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, FileText, Ticket, User } from 'lucide-react';

const MobileTabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Tours', path: '/tours', icon: MapPin },
    { name: 'Visas', path: '/visas', icon: FileText },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;