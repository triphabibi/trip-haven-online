
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TourPackage } from '@/types/tourism';

interface PackageDetailsProps {
  pkg: TourPackage;
  isLoading: boolean;
}

const PackageDetails = ({ pkg, isLoading }: PackageDetailsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
        <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>About this package</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              pkg?.description || 'No description available.'
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : pkg?.highlights && pkg.highlights.length > 0 ? (
              <ul className="list-disc pl-5">
                {pkg.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            ) : (
              'No highlights available.'
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="itinerary" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Itinerary</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : pkg?.itinerary ? (
              <div>
                {Array.isArray(pkg.itinerary) ? (
                  pkg.itinerary.map((day: any, index: number) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-600">
                        Day {index + 1}: {day.title || day.day || `Day ${index + 1}`}
                      </h3>
                      {day.description && (
                        <p className="text-gray-600 mb-3">{day.description}</p>
                      )}
                      {day.activities && Array.isArray(day.activities) && (
                        <ul className="list-disc pl-5 space-y-1">
                          {day.activities.map((activity: string, actIndex: number) => (
                            <li key={actIndex} className="text-gray-700">{activity}</li>
                          ))}
                        </ul>
                      )}
                      {day.meals && (
                        <div className="mt-3">
                          <span className="font-medium text-green-600">Meals: </span>
                          <span className="text-gray-700">{day.meals}</span>
                        </div>
                      )}
                      {day.accommodation && (
                        <div className="mt-2">
                          <span className="font-medium text-purple-600">Accommodation: </span>
                          <span className="text-gray-700">{day.accommodation}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : typeof pkg.itinerary === 'object' ? (
                  Object.entries(pkg.itinerary).map(([day, details]: [string, any]) => (
                    <div key={day} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 text-blue-600">
                        {details.title || day}
                      </h3>
                      {details.description && (
                        <p className="text-gray-600 mb-3">{details.description}</p>
                      )}
                      {details.activities && Array.isArray(details.activities) && (
                        <ul className="list-disc pl-5 space-y-1">
                          {details.activities.map((activity: string, index: number) => (
                            <li key={index} className="text-gray-700">{activity}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-gray-700">{JSON.stringify(pkg.itinerary, null, 2)}</pre>
                  </div>
                )}
              </div>
            ) : (
              'Itinerary not available.'
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inclusions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : pkg?.whats_included && pkg.whats_included.length > 0 ? (
              <ul className="list-disc pl-5">
                {pkg.whats_included.map((inclusion, index) => (
                  <li key={index}>{inclusion}</li>
                ))}
              </ul>
            ) : (
              'Inclusions not available.'
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              'Reviews will be displayed here.'
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PackageDetails;
