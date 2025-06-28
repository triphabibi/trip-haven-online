
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface TourHighlightsProps {
  tour: any;
}

const TourHighlights = ({ tour }: TourHighlightsProps) => {
  if (!tour.highlights || tour.highlights.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden shadow-sm border-gray-100">
      <CardContent className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Highlights</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tour.highlights.slice(0, 8).map((highlight: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TourHighlights;
