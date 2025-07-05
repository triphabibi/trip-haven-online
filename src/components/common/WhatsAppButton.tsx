
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I would like to know more about your travel services.');
    window.open(`https://wa.me/919125009662?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
      <div className="absolute -top-2 -left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
        WhatsApp
      </div>
    </div>
  );
};

export default WhatsAppButton;
