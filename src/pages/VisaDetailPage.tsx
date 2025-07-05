
import { useParams, Link } from 'react-router-dom';
import { useVisa } from '@/hooks/useVisas';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Globe, FileText, CheckCircle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import Loading from '@/components/common/Loading';
import EnhancedVisaBooking from '@/components/visa/EnhancedVisaBooking';

const VisaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: visa, isLoading, error } = useVisa(slug!);
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <Loading message="Loading visa details..." />
        <Footer />
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <div className="w-full px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Visa Service Not Found</h1>
              <p className="text-gray-600 mb-8 text-lg">The visa service you're looking for doesn't exist.</p>
              <Link to="/visas">
                <Button size="lg" className="px-8">Browse All Visa Services</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      
      <main className="w-full px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            <span>/</span>
            <Link to="/visas" className="hover:text-blue-600 transition-colors font-medium">Visa Services</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{visa.country} {visa.visa_type}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">{visa.country} {visa.visa_type}</h1>
                    {visa.is_featured && (
                      <Badge className="bg-yellow-500 mt-2">Featured Service</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Processing: {visa.processing_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>{visa.requirements?.length || 0} documents required</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b bg-gray-50/50">
                  <TabsList className="h-auto p-0 bg-transparent w-full justify-start rounded-none overflow-x-auto">
                    <TabsTrigger 
                      value="overview" 
                      className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="requirements" 
                      className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      Requirements
                    </TabsTrigger>
                    <TabsTrigger 
                      value="process" 
                      className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                      Process
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-semibold mb-4">About This Visa</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {visa.description || `Get your ${visa.visa_type} visa for ${visa.country} processed quickly and efficiently. Our expert team will handle all the paperwork and ensure your application meets all requirements.`}
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-8 rounded-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <Clock className="h-6 w-6 text-blue-600" />
                            <h4 className="font-semibold text-gray-900 text-lg">Processing Time</h4>
                          </div>
                          <p className="text-gray-700 text-lg">{visa.processing_time}</p>
                        </div>
                        
                        <div className="bg-green-50 p-8 rounded-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <h4 className="font-semibold text-gray-900 text-lg">Service Fee</h4>
                          </div>
                          <p className="text-3xl font-bold text-green-600">{formatPrice(visa.price)}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requirements" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Required Documents</h3>
                        <p className="text-gray-600 mb-8 text-lg">Please prepare the following documents for your visa application:</p>
                      </div>
                      
                      <div className="space-y-4">
                        {visa.requirements?.map((requirement, index) => (
                          <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600 mt-1" />
                            <span className="text-gray-700 text-lg">{requirement}</span>
                          </div>
                        )) || (
                          <div className="text-gray-500 text-center py-12">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Document requirements will be provided after booking.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="process" className="mt-0">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Application Process</h3>
                        <p className="text-gray-600 mb-8 text-lg">Follow these simple steps to get your visa:</p>
                      </div>
                      
                      <div className="space-y-8">
                        {[
                          { step: 1, title: "Submit Application", description: "Fill out the application form and upload required documents" },
                          { step: 2, title: "Document Review", description: "Our experts review your documents for completeness and accuracy" },
                          { step: 3, title: "Embassy Submission", description: "We submit your application to the embassy or consulate" },
                          { step: 4, title: "Visa Processing", description: "Embassy processes your application" },
                          { step: 5, title: "Visa Collection", description: "Collect your approved visa or receive it by courier" }
                        ].map((item) => (
                          <div key={item.step} className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 text-lg">{item.title}</h4>
                              <p className="text-gray-600 text-lg">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <EnhancedVisaBooking visa={visa} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VisaDetailPage;
