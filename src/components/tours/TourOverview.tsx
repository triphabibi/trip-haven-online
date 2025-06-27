
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Languages, Calendar, CheckCircle } from 'lucide-react';

interface TourOverviewProps {
  tour: any;
}

const TourOverview = ({ tour }: TourOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Quick Facts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Duration</div>
          <div className="text-sm text-gray-600">{tour.duration || 'Full Day'}</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Group Size</div>
          <div className="text-sm text-gray-600">Up to 25 people</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Languages className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Languages</div>
          <div className="text-sm text-gray-600">
            {tour.languages?.join(', ') || 'English'}
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Pickup</div>
          <div className="text-sm text-gray-600">Hotel Pickup</div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xl font-bold mb-4">About This Experience</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {tour.description}
          </p>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-3">Important Information</h4>
        <div className="space-y-2 text-blue-800">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Please arrive 15 minutes before the departure time</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Comfortable walking shoes recommended</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Bring sunscreen and a hat during summer months</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Valid ID required for all participants</span>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold mb-3">Cancellation Policy</h4>
        <div className="text-gray-700 space-y-2">
          <p className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
            <span>Free cancellation up to 24 hours before the experience starts</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
            <span>Full refund if cancelled due to weather conditions</span>
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Cancellations made less than 24 hours before the start time are non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourOverview;
