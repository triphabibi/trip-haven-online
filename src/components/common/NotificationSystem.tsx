import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Users } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'urgent' | 'offer';
  message: string;
  location?: string;
  timestamp: string;
  icon?: string;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  // Sample live booking notifications
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      message: 'A customer from Mumbai just booked Dubai Visa',
      location: 'Mumbai',
      timestamp: '2 mins ago',
      icon: '🇦🇪'
    },
    {
      id: '2',
      type: 'booking',
      message: 'Someone from Delhi booked Thailand Tour Package',
      location: 'Delhi',
      timestamp: '5 mins ago',
      icon: '🇹🇭'
    },
    {
      id: '3',
      type: 'booking',
      message: 'A family from Bangalore booked Singapore Visa',
      location: 'Bangalore',
      timestamp: '8 mins ago',
      icon: '🇸🇬'
    },
    {
      id: '4',
      type: 'urgent',
      message: 'Limited slots remaining for Schengen Visa this month',
      timestamp: '1 hour ago',
      icon: '⚡'
    },
    {
      id: '5',
      type: 'offer',
      message: 'Special discount: 20% off on all UAE Visas',
      timestamp: '2 hours ago',
      icon: '🎉'
    }
  ];

  useEffect(() => {
    setNotifications(sampleNotifications);
    
    // Show first notification after 3 seconds
    const timer = setTimeout(() => {
      showNextNotification();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000); // Show for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  const showNextNotification = () => {
    if (notifications.length > 0) {
      const randomIndex = Math.floor(Math.random() * notifications.length);
      setCurrentNotification(notifications[randomIndex]);
    }
  };

  const hideNotification = () => {
    setCurrentNotification(null);
    
    // Schedule next notification
    const nextTimer = setTimeout(() => {
      showNextNotification();
    }, Math.random() * 30000 + 15000); // Random between 15-45 seconds

    return () => clearTimeout(nextTimer);
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-600 border-blue-700';
      case 'urgent':
        return 'bg-orange-600 border-orange-700';
      case 'offer':
        return 'bg-green-600 border-green-700';
      default:
        return 'bg-gray-600 border-gray-700';
    }
  };

  if (!currentNotification) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-40 animate-slide-in-left">
      <div className={`${getNotificationStyle(currentNotification.type)} text-white rounded-lg shadow-2xl border-2 p-4 relative overflow-hidden`}>
        {/* Close button */}
        <button
          onClick={hideNotification}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Notification content */}
        <div className="pr-8">
          <div className="flex items-start gap-3">
            {currentNotification.icon && (
              <span className="text-2xl flex-shrink-0">
                {currentNotification.icon}
              </span>
            )}
            
            <div className="flex-1">
              <p className="text-sm font-medium leading-tight">
                {currentNotification.message}
              </p>
              
              <div className="flex items-center gap-4 mt-2 text-xs opacity-90">
                {currentNotification.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentNotification.location}
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {currentNotification.timestamp}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
          <div className="h-full bg-white animate-progress-bar"></div>
        </div>

        {/* Pulse effect for booking notifications */}
        {currentNotification.type === 'booking' && (
          <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;