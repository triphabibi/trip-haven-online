
import { useEffect, useState } from 'react';
import { CheckCircle, Users, Globe, Clock } from 'lucide-react';

const AnimatedStats = () => {
  const [counts, setCounts] = useState({
    destinations: 0,
    bookings: 0,
    visaApproval: 0,
    support: 24
  });

  const finalCounts = {
    destinations: 100,
    bookings: 5000,
    visaApproval: 98,
    support: 24
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = Object.keys(finalCounts).map((key) => {
      const finalValue = finalCounts[key as keyof typeof finalCounts];
      const increment = finalValue / steps;
      let currentValue = 0;

      return setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          currentValue = finalValue;
          clearInterval(intervals.find(i => i));
        }
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }));
      }, stepDuration);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const stats = [
    {
      icon: Globe,
      value: `${counts.destinations}+`,
      label: 'Happy Destinations',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      value: `${counts.bookings}+`,
      label: 'Bookings Completed',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      value: `${counts.visaApproval}%`,
      label: 'Visa Approval Success',
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      value: `${counts.support}/7`,
      label: 'AI Travel Support',
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Travelers
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join our community of happy travelers who trust TripHabibi for their perfect journeys
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-transform duration-300"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                  <IconComponent className={`h-10 w-10 ${stat.color.replace('text-', 'text-')} text-white`} />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
