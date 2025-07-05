
import UnifiedTourBooking from './UnifiedTourBooking';
import type { Tour } from '@/types/tourism';

interface ResponsiveTourBookingProps {
  tour: Tour;
}

const ResponsiveTourBooking = ({ tour }: ResponsiveTourBookingProps) => {
  return <UnifiedTourBooking tour={tour} />;
};

export default ResponsiveTourBooking;
