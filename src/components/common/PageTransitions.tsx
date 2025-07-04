import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionsProps {
  children: React.ReactNode;
}

const PageTransitions = ({ children }: PageTransitionsProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        transitionStage === 'fade-out' ? 'opacity-0' : 'opacity-100'
      }`}
      onTransitionEnd={() => {
        if (transitionStage === 'fade-out') {
          setDisplayLocation(location);
          setTransitionStage('fade-in');
        }
      }}
    >
      {children}
    </div>
  );
};

export default PageTransitions;