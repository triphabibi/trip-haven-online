
import { useIsMobile } from '@/hooks/use-mobile';
import MobileTourBooking from './MobileTourBooking';
import StreamlinedTourBooking from './StreamlinedTourBooking';
import type { Tour } from '@/types/tourism';

interface ResponsiveTourBookingProps {
  tour: Tour;
}

const ResponsiveTourBooking = ({ tour }: ResponsiveTourBookingProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileTourBooking tour={tour} />;
  }

  return <StreamlinedTourBooking tour={tour} />;
};

export default ResponsiveTourBooking;
