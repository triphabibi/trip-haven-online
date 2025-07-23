
import React from 'react';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 animate-spin-slow">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            className="animate-pulse"
          />
          
          {/* Inner Circle with Gradient */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="url(#gradient2)"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* Travel Icon - Plane */}
          <path
            d="M25 50 L35 45 L55 35 L65 40 L75 45 L65 50 L55 55 L45 65 L35 55 Z"
            fill="white"
            className="animate-bounce"
            style={{ animationDelay: '1s', animationDuration: '2s' }}
          />
          
          {/* Small Accent Circles */}
          <circle cx="30" cy="30" r="3" fill="url(#gradient3)" className="animate-ping" style={{ animationDelay: '0.2s' }} />
          <circle cx="70" cy="30" r="3" fill="url(#gradient3)" className="animate-ping" style={{ animationDelay: '0.8s' }} />
          <circle cx="70" cy="70" r="3" fill="url(#gradient3)" className="animate-ping" style={{ animationDelay: '1.4s' }} />
          <circle cx="30" cy="70" r="3" fill="url(#gradient3)" className="animate-ping" style={{ animationDelay: '2s' }} />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </radialGradient>
            
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* 3D Shadow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-full transform rotate-3"></div>
    </div>
  );
};

// CSS for custom animations
const logoStyles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = logoStyles;
  document.head.appendChild(styleSheet);
}
