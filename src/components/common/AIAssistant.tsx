
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      message: 'Hi! I\'m your travel assistant. I can help you find the perfect tour, package, visa, or ticket. What are you looking for?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    'Dubai tour under ₹30,000',
    'UAE visa requirements',
    'Europe packages',
    'Airport transfers',
    'Burj Khalifa tickets'
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        message: generateResponse(inputMessage),
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dubai') && lowerQuery.includes('tour')) {
      return 'I found several Dubai tours for you! Here are some popular options:\n\n🏗️ Dubai City Tour - ₹2,500 per person\n🏢 Burj Khalifa + Dubai Mall - ₹4,500 per person\n🏜️ Desert Safari - ₹3,200 per person\n\nWould you like me to show you more details or help you book one of these?';
    }
    
    if (lowerQuery.includes('visa')) {
      return 'I can help you with visa applications! Which country are you planning to visit? We offer visa services for:\n\n🇦🇪 UAE - ₹8,500 (3-5 days)\n🇺🇸 USA - ₹15,000 (15-20 days)\n🇬🇧 UK - ₹12,000 (10-15 days)\n🇨🇦 Canada - ₹13,500 (20-25 days)\n\nLet me know your destination!';
    }
    
    if (lowerQuery.includes('package') || lowerQuery.includes('europe')) {
      return 'Great choice! Our Europe packages are very popular. Here are some amazing options:\n\n🇫🇷 Paris + Switzerland - ₹85,000 (7 days)\n🇮🇹 Italy Grand Tour - ₹92,000 (8 days)\n🇬🇧 UK + Scotland - ₹78,000 (6 days)\n\nAll packages include flights, hotels, transfers, and daily tours. Which one interests you?';
    }
    
    if (lowerQuery.includes('ticket') || lowerQuery.includes('burj khalifa')) {
      return 'Perfect! Here are the available Burj Khalifa tickets:\n\n🎫 Level 124 + 125 - ₹2,800 per person\n🎫 Level 148 (Premium) - ₹4,500 per person\n🎫 At The Top SKY - ₹6,200 per person\n\nAll tickets include skip-the-line access. Would you like to book now?';
    }
    
    return 'I\'d be happy to help you find the perfect travel option! Could you tell me more about:\n\n• Your destination preference\n• Your budget range\n• Type of service (Tour, Package, Visa, or Tickets)\n• Travel dates\n\nThis will help me provide more personalized recommendations for you.';
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-2 -right-2">
          <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Travel Assistant</CardTitle>
                <p className="text-sm text-blue-100">Powered by AI</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
                {msg.type === 'user' && (
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 text-xs"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about travel..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
