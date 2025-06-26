
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
                {Object.entries(pkg.itinerary).map(([day, details]: [string, any]) => (
                  <div key={day} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{details.title}</h3>
                    <ul className="list-disc pl-5">
                      {details.activities && details.activities.map((activity: string, index: number) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
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
