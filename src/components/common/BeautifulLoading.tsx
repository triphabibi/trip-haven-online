import { Plane, MapPin, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';

interface BeautifulLoadingProps {
  type?: 'page' | 'booking' | 'payment' | 'search' | 'upload' | 'success';
  message?: string;
  fullScreen?: boolean;
  progress?: number; // 0-100 for progress indicator
  size?: 'sm' | 'md' | 'lg';
}

const BeautifulLoading = ({ 
  type = 'page', 
  message, 
  fullScreen = false, 
  progress,
  size = 'md' 
}: BeautifulLoadingProps) => {
  
  const getAnimation = () => {
    switch (type) {
      case 'booking':
        return (
          <div className="relative">
            {/* Animated Travel Icons */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="animate-bounce delay-0">
                <Plane className="h-8 w-8 text-blue-500" />
              </div>
              <div className="animate-bounce delay-150">
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
              <div className="animate-bounce delay-300">
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-1000 ease-out animate-pulse"
                style={{ width: `${progress || 60}%` }}
              />
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="relative">
            {/* Secure Payment Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
              
              {/* Security Rings */}
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-300 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 w-16 h-16 mx-auto mt-2 ml-2 border-2 border-green-400 rounded-full animate-ping opacity-40 delay-150" />
              <div className="absolute inset-0 w-12 h-12 mx-auto mt-4 ml-4 border border-green-500 rounded-full animate-ping opacity-60 delay-300" />
            </div>
            
            {/* Encrypted Data Flow */}
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 bg-gradient-to-t from-green-400 to-green-600 rounded animate-pulse`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'search':
        return (
          <div className="relative">
            {/* Search Radar Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
              <div className="absolute inset-2 border-2 border-blue-300 rounded-full" />
              <div className="absolute inset-4 border border-blue-400 rounded-full" />
              
              {/* Radar Sweep */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute top-1/2 origin-left animate-spin" />
              </div>
              
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
            
            {/* Search Dots */}
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        );
        
      case 'upload':
        return (
          <div className="relative">
            {/* Upload Progress Circle */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * (progress || 40)) / 100}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{progress || 40}%</span>
              </div>
            </div>
          </div>
        );
        
      case 'success':
        return (
          <div className="relative">
            {/* Success Animation */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              {/* Success Particles */}
              <div className="absolute inset-0 w-20 h-20 mx-auto">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"
                    style={{
                      top: `${30 + Math.sin(i * 60 * Math.PI / 180) * 25}px`,
                      left: `${30 + Math.cos(i * 60 * Math.PI / 180) * 25}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="relative">
            {/* Default Travel Loading */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" 
                   style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Plane className="h-6 w-6 text-blue-500 animate-pulse" />
              </div>
            </div>
            
            {/* Floating Dots */}
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'booking':
        return 'Processing your booking...';
      case 'payment':
        return 'Securing your payment...';
      case 'search':
        return 'Finding amazing experiences...';
      case 'upload':
        return 'Uploading your files...';
      case 'success':
        return 'Success! Redirecting...';
      default:
        return 'Loading amazing experiences...';
    }
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  const content = (
    <div className={`text-center ${sizeClasses[size]}`}>
      {getAnimation()}
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {message || getDefaultMessage()}
        </h3>
        <p className="text-sm text-gray-600">
          {type === 'payment' ? 'Your transaction is being processed securely' :
           type === 'booking' ? 'Please wait while we confirm your booking' :
           type === 'search' ? 'Searching through thousands of experiences' :
           'Please wait a moment...'}
        </p>
        
        {/* Progress indicator for longer operations */}
        {(type === 'booking' || type === 'payment') && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>This usually takes a few seconds</span>
          </div>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {content}
      </div>
    </div>
  );
};

export default BeautifulLoading;