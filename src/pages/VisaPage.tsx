import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AIAssistant from '@/components/common/AIAssistant';

const VisaPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['visa_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visa_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: visas, isLoading: visasLoading } = useQuery({
    queryKey: ['visa_services_by_category', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('visa_services')
        .select(`
          *,
          visa_categories (
            name,
            slug,
            icon_emoji
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('visa_categories.slug', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCategory,
  });

  const isLoading = categoriesLoading || visasLoading;

  if (isLoading && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BeautifulLoading 
          type="search" 
          message="Loading visa categories..." 
          fullScreen 
        />
        <Footer />
      </div>
    );
  }

  // Group visas by country when category is selected
  const groupedVisas = visas?.reduce((acc, visa) => {
    const country = visa.country;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(visa);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedCategory ? (
          // Categories Landing Page
          <>
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Visa Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get your visa processed quickly and hassle-free with expert assistance and guidance
              </p>
            </div>

            {/* 3D Styled Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <Card 
                  key={category.id}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="relative p-8 text-center">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon_emoji}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white transform group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                  
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))}
            </div>
          </>
        ) : (
          // Country/Visa Listing Page
          <>
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2"
              >
                ← Back to Categories
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {categories?.find(c => c.slug === selectedCategory)?.name} Visas
                </h1>
                <p className="text-gray-600">Select your destination country</p>
              </div>
            </div>

            {isLoading ? (
              <BeautifulLoading type="search" message="Loading visas..." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedVisas).map(([country, countryVisas]) => (
                  <Card 
                    key={country}
                    className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => navigate(`/visas/${countryVisas[0]?.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {country.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {country}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {countryVisas.length} visa{countryVisas.length > 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {countryVisas.slice(0, 3).map((visa) => (
                          <div key={visa.id} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            {visa.visa_type}
                          </div>
                        ))}
                        {countryVisas.length > 3 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{countryVisas.length - 3} more...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {Object.keys(groupedVisas).length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No visas found</h3>
                <p className="text-gray-500 text-lg mb-8">No visa services available for this category yet</p>
                <Button onClick={() => setSelectedCategory(null)}>
                  Back to Categories
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <AIAssistant />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .group:hover .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VisaPage;