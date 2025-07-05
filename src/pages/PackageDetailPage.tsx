
import { useParams } from 'react-router-dom';
import { usePackage } from '@/hooks/usePackages';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PackageHero from '@/components/packages/PackageHero';
import ModernPackageBooking from '@/components/packages/ModernPackageBooking';
import PackageDetails from '@/components/packages/PackageDetails';
import AIAssistant from '@/components/common/AIAssistant';

const PackageDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading, error } = usePackage(slug!);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Package</h1>
            <p className="text-gray-600">Unable to load tour package details. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : pkg ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PackageHero pkg={pkg} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-1">
                <ModernPackageBooking pkg={pkg} />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
              <p className="text-gray-600">The package you're looking for doesn't exist.</p>
            </div>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="container mx-auto px-4 py-8">
        {pkg && <PackageDetails pkg={pkg} isLoading={isLoading} />}
      </div>

      <Footer />
      <AIAssistant />
    </div>
  );
};

export default PackageDetailPage;
