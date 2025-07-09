
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, X, Bot, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StickyMobileCTAProps {
  tour?: any;
  showBooking?: boolean;
  onBookNow?: () => void;
}

const StickyMobileCTA = ({ tour, showBooking = true, onBookNow }: StickyMobileCTAProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showWhatsAppHidden, setShowWhatsAppHidden] = useState(false);
  const [showAIHidden, setShowAIHidden] = useState(false);
  const { toast } = useToast();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello! I'm interested in ${tour?.title || 'your services'}. Can you provide more information?`);
    window.open(`https://wa.me/919125009662?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+919125009662', '_self');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${tour?.title || 'Services'}`);
    const body = encodeURIComponent(`Hello,\n\nI'm interested in learning more about your services. Please provide additional details.\n\nThank you!`);
    window.open(`mailto:info@triphabibi.com?subject=${subject}&body=${body}`, '_self');
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const hideWidget = () => {
    setIsVisible(false);
    sessionStorage.setItem('ctaHidden', 'true');
  };

  const hideWhatsApp = () => {
    setShowWhatsAppHidden(true);
    sessionStorage.setItem('whatsappHidden', 'true');
  };

  const hideAI = () => {
    setShowAIHidden(true);
    setShowAIChat(false);
    sessionStorage.setItem('aiHidden', 'true');
  };

  useEffect(() => {
    const wasHidden = sessionStorage.getItem('ctaHidden');
    const whatsappHidden = sessionStorage.getItem('whatsappHidden');
    const aiHidden = sessionStorage.getItem('aiHidden');
    
    if (wasHidden) setIsVisible(false);
    if (whatsappHidden) setShowWhatsAppHidden(true);
    if (aiHidden) setShowAIHidden(true);

    const handleBeforeUnload = () => {
      sessionStorage.removeItem('ctaHidden');
      sessionStorage.removeItem('whatsappHidden');
      sessionStorage.removeItem('aiHidden');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* AI Chat Button - Right Side */}
      {!showAIHidden && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative">
            <Button
              onClick={hideAI}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-gray-500 hover:bg-gray-600 rounded-full z-10"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => setShowAIChat(!showAIChat)}
              className="bg-purple-600 hover:bg-purple-700 rounded-full w-14 h-14 shadow-lg animate-pulse"
              size="icon"
            >
              <Bot className="h-6 w-6" />
            </Button>
            
            {/* AI Chat Popup */}
            {showAIChat && (
              <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">AI Travel Assistant</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAIChat(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Hi! I'm your AI travel assistant. How can I help you today?</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Find Tours</Button>
                    <Button variant="outline" size="sm">Visa Help</Button>
                    <Button variant="outline" size="sm">Packages</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp Button - Left Side */}
      {!showWhatsAppHidden && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="relative">
            <Button
              onClick={hideWhatsApp}
              className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-gray-500 hover:bg-gray-600 rounded-full z-10"
              size="sm"
            >
              <X className="h-3 w-3" />
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg animate-pulse"
              size="icon"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar - Only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white border-t border-gray-200 shadow-lg">
          
          {/* Minimize/Expand Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMinimize}
              className="rounded-t-lg"
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {!isMinimized && (
            <div className="px-4 py-3">
              
              {/* Hide Button */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Need Help?</span>
                <Button variant="ghost" size="sm" onClick={hideWidget}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  onClick={handleCall}
                  className="flex-1 bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call Now
                </Button>

                <Button
                  size="sm"
                  onClick={handleEmail}
                  className="flex-1 bg-gray-500 border-gray-500 text-white hover:bg-gray-600"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>

              {/* Book Now Button */}
              {showBooking && onBookNow && (
                <Button 
                  onClick={onBookNow}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Book This Experience Now
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for mobile to prevent content overlap */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default StickyMobileCTA;
