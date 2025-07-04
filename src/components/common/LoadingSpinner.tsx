import { Plane, RotateCcw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  type?: 'default' | 'booking' | 'payment';
}

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  type = 'default' 
}: LoadingSpinnerProps) => {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-xl';
      default: return 'text-base';
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case 'booking':
        return (
          <div className="relative">
            <div className={`${getSizeClasses()} text-blue-600 animate-spin`}>
              <RotateCcw className="w-full h-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="relative">
            <div className={`${getSizeClasses()} text-green-600`}>
              <div className="w-full h-full border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="relative">
            <Plane className={`${getSizeClasses()} text-blue-600 animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {renderSpinner()}
      
      {message && (
        <p className={`mt-4 text-gray-600 font-medium ${getTextSize()} text-center animate-pulse`}>
          {message}
        </p>
      )}
      
      {type === 'booking' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Processing your request...
        </div>
      )}
      
      {type === 'payment' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Securing your payment...
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;