
import { CheckCircle, XCircle } from 'lucide-react';

interface TourInclusionsProps {
  tour: any;
}

const TourInclusions = ({ tour }: TourInclusionsProps) => {
  const defaultInclusions = [
    "Professional English-speaking guide",
    "Comfortable air-conditioned transportation",
    "Hotel pickup and drop-off",
    "Entry tickets to all attractions",
    "Bottled water during the tour",
    "Professional photography assistance"
  ];

  const defaultExclusions = [
    "Personal expenses",
    "Food and beverages (unless specified)",
    "Gratuities for guide and driver",
    "Travel insurance",
    "Any additional activities not mentioned"
  ];

  const inclusions = tour.whats_included || defaultInclusions;

  return (
    <div className="space-y-8">
      {/* What's Included */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-green-700">What's Included</h3>
        <div className="grid gap-3">
          {inclusions.map((item: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What's Not Included */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-red-700">What's Not Included</h3>
        <div className="grid gap-3">
          {defaultExclusions.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold mb-3">Additional Information</h4>
        <div className="space-y-2 text-gray-700">
          <p>• Confirmation will be received at time of booking</p>
          <p>• Not wheelchair accessible</p>
          <p>• Near public transportation</p>
          <p>• Most travelers can participate</p>
          <p>• This experience requires good weather. If it's canceled due to poor weather, you'll be offered a different date or a full refund</p>
          <p>• This tour/activity will have a maximum of 25 travelers</p>
        </div>
      </div>
    </div>
  );
};

export default TourInclusions;
