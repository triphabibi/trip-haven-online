import { useEffect, useState } from 'react';
import BeautifulLoading from './BeautifulLoading';

interface LoadingOverlayProps {
  isVisible: boolean;
  type?: 'booking' | 'payment' | 'search' | 'upload' | 'page';
  message?: string;
  progress?: number;
  onComplete?: () => void;
  duration?: number; // Auto-hide after duration (ms)
}

const LoadingOverlay = ({ 
  isVisible, 
  type = 'page', 
  message, 
  progress,
  onComplete,
  duration 
}: LoadingOverlayProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      if (duration) {
        const timer = setTimeout(() => {
          setShow(false);
          onComplete?.();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full mx-4 animate-scale-in">
        <BeautifulLoading 
          type={type} 
          message={message} 
          progress={progress}
          size="lg"
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;