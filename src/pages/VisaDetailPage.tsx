import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVisa } from '@/hooks/useVisas';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VisaBookingForm from '@/components/visa/VisaBookingForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Globe, FileText, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import Loading from '@/components/common/Loading';
import ModernVisaBooking from '@/components/visa/ModernVisaBooking';

const VisaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: visa, isLoading, error } = useVisa(id!);
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading message="Loading visa details..." />
        <Footer />
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Visa Service Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg">The visa service you're looking for doesn't exist.</p>
            <Link to="/visas">
              <Button size="lg" className="px-8">Browse All Visa Services</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{visa.country} {visa.visa_type}</h1>
                  {visa.is_featured && (
                    <Badge className="bg-yellow-500 mt-2">Featured Service</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Processing: {visa.processing_time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{visa.requirements?.length || 0} documents required</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b bg-gray-50/50">
                <TabsList className="h-auto p-0 bg-transparent w-full justify-start rounded-none">
                  <TabsTrigger 
                    value="overview" 
                    className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requirements" 
                    className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                  >
                    Requirements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="process" 
                    className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                  >
                    Process
                  </TabsTrigger>
                  <TabsTrigger 
                    value="apply" 
                    className="px-6 py-4 text-base font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                  >
                    Apply Now
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-8">
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">About This Visa</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {visa.description || `Get your ${visa.visa_type} visa for ${visa.country} processed quickly and efficiently. Our expert team will handle all the paperwork and ensure your application meets all requirements.`}
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Processing Time</h4>
                        </div>
                        <p className="text-gray-700">{visa.processing_time}</p>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Service Fee</h4>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{formatPrice(visa.price)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Required Documents</h3>
                      <p className="text-gray-600 mb-6">Please prepare the following documents for your visa application:</p>
                    </div>
                    
                    <div className="space-y-3">
                      {visa.requirements?.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                          <span className="text-gray-700">{requirement}</span>
                        </div>
                      )) || (
                        <div className="text-gray-500 text-center py-8">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>Document requirements will be provided after booking.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="process" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Application Process</h3>
                      <p className="text-gray-600 mb-6">Follow these simple steps to get your visa:</p>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { step: 1, title: "Submit Application", description: "Fill out the application form and upload required documents" },
                        { step: 2, title: "Document Review", description: "Our experts review your documents for completeness and accuracy" },
                        { step: 3, title: "Embassy Submission", description: "We submit your application to the embassy or consulate" },
                        { step: 4, title: "Visa Processing", description: "Embassy processes your application" },
                        { step: 5, title: "Visa Collection", description: "Collect your approved visa or receive it by courier" }
                      ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {item.step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="apply" className="mt-0">
                  <ModernVisaBooking service={visa} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            {/* Mobile Visa Booking */}
            <div className="md:hidden mb-8 sticky top-4 z-10">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl text-white text-center mb-4 shadow-xl">
                <h3 className="text-lg font-bold mb-2">Apply for {visa.country} Visa</h3>
                <div className="text-2xl font-bold mb-2">{formatPrice(visa.price)}</div>
                <p className="text-white/80 text-sm">Expert assistance included</p>
                <Button 
                  className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  onClick={() => document.querySelector('[data-booking-form]')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </Button>
              </div>
            </div>
            
            {/* Desktop Sidebar */}
            <div className="hidden md:block sticky top-8">
              <Card className="shadow-lg border-gray-200">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{formatPrice(visa.price)}</div>
                    <p className="text-gray-600">per person</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{visa.processing_time}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents Required:</span>
                      <span className="font-medium">{visa.requirements?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Expert assistance included</span>
                    </div>
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      onClick={() => document.querySelector('[data-booking-form]')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VisaDetailPage;
