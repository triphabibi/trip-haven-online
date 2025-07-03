import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, MapPin, Shield } from 'lucide-react';

const CompactAnimatedStats = () => {
  const [counters, setCounters] = useState({
    travelers: 0,
    success: 0,
    destinations: 0,
    experience: 0
  });

  const stats = [
    {
      icon: Users,
      emoji: '👥',
      target: 12000,
      suffix: '+',
      label: 'Happy Travelers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Award,
      emoji: '⭐',
      target: 98,
      suffix: '%',
      label: 'Visa Success',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: MapPin,
      emoji: '🌍',
      target: 50,
      suffix: '+',
      label: 'Destinations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      emoji: '🛡️',
      target: 5,
      suffix: '+',
      label: 'Years Experience',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervals = stats.map((stat, index) => {
      const increment = stat.target / (duration / 50);
      return setInterval(() => {
        setCounters(prev => {
          const key = ['travelers', 'success', 'destinations', 'experience'][index] as keyof typeof prev;
          const newValue = Math.min(prev[key] + increment, stat.target);
          return { ...prev, [key]: newValue };
        });
      }, 50);
    });

    setTimeout(() => {
      intervals.forEach(clearInterval);
    }, duration);

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            🎯 Trusted by Thousands
          </h2>
          <p className="text-sm md:text-lg text-gray-600">
            Why travelers choose TripHabibi
          </p>
        </div>

        {/* Desktop: 4 columns */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const value = Math.floor(Object.values(counters)[index]);
            
            return (
              <Card key={stat.label} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl">{stat.emoji}</span>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2 counter-animate`}>
                    {value.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mobile: Compact 2x2 grid - Point 20 */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const value = Math.floor(Object.values(counters)[index]);
            
            return (
              <Card key={stat.label} className="text-center border-0 shadow-md">
                <CardContent className="p-3">
                  <div className="text-lg mb-1">{stat.emoji}</div>
                  <div className={`text-lg font-bold ${stat.color} counter-animate`}>
                    {value.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="text-green-500">✅</span>
            SSL Secured
          </span>
          <span className="flex items-center gap-1">
            <span className="text-blue-500">🛡️</span>
            Licensed Agency
          </span>
          <span className="flex items-center gap-1">
            <span className="text-purple-500">⭐</span>
            5-Star Rated
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-500">📞</span>
            24/7 Support
          </span>
        </div>
      </div>
    </section>
  );
};

export default CompactAnimatedStats;