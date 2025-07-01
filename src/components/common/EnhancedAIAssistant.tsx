
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, Sparkles, Zap } from 'lucide-react';

const EnhancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      message: '🌟 Hi! I\'m your AI Travel Assistant. I can help you find the perfect tour, package, visa, or ticket based on your preferences. What kind of trip are you planning?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    '🏜️ Dubai tours under ₹30,000',
    '🛂 UAE visa requirements',
    '🇪🇺 Europe packages for couples',
    '🚗 Airport transfers in Dubai',
    '🏗️ Burj Khalifa tickets',
    '🌙 Honeymoon packages',
    '🏖️ Beach destinations',
    '⛷️ Winter vacation deals'
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
        message: generateAIResponse(inputMessage),
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dubai') || lowerQuery.includes('uae')) {
      return '🏜️ Great choice! Dubai & UAE are our most popular destinations. Here are my top recommendations:\n\n🎭 **Dubai City Tour** - ₹2,500 per person\n🏗️ **Burj Khalifa + Dubai Mall** - ₹4,500 per person\n🏜️ **Desert Safari with BBQ** - ₹3,200 per person\n🏨 **Dubai 4N/5D Package** - ₹25,000 per person\n🛂 **UAE Tourist Visa** - ₹8,500 (3-5 days processing)\n\n✨ Would you like me to show you detailed itineraries or help you book directly?';
    }
    
    if (lowerQuery.includes('visa')) {
      return '🛂 I can help you with visa applications! Which country are you planning to visit?\n\n**Popular Destinations:**\n🇦🇪 **UAE Visa** - ₹8,500 (3-5 days)\n🇺🇸 **USA Tourist Visa** - ₹15,000 (15-20 days)\n🇬🇧 **UK Tourist Visa** - ₹12,000 (10-15 days)\n🇨🇦 **Canada Visa** - ₹13,500 (20-25 days)\n🇪🇺 **Schengen Visa** - ₹9,500 (10-15 days)\n\n📋 All visa services include document assistance, application filling, and tracking support. Which one interests you?';
    }
    
    if (lowerQuery.includes('package') || lowerQuery.includes('honeymoon') || lowerQuery.includes('europe')) {
      return '💕 Perfect! Our honeymoon and Europe packages are specially curated for couples:\n\n🇫🇷 **Paris + Switzerland Romance** - ₹85,000 (7 days)\n• 5-star hotels with city views\n• Seine river cruise & Eiffel Tower dinner\n• Swiss Alps cable car experience\n\n🇮🇹 **Italy Grand Romance** - ₹92,000 (8 days)\n• Venice gondola rides\n• Rome historical tours\n• Tuscany wine tasting\n\n🇬🇧 **London + Scotland Highlands** - ₹78,000 (6 days)\n• Thames river cruise\n• Edinburgh castle tour\n• Highlands scenic train\n\n✨ All packages include flights, luxury hotels, daily breakfast, transfers, and romantic surprises! Which destination calls to your heart?';
    }
    
    if (lowerQuery.includes('ticket') || lowerQuery.includes('burj khalifa') || lowerQuery.includes('attraction')) {
      return '🎫 Amazing! Skip-the-line tickets are the best way to save time. Here are our most popular attractions:\n\n🏗️ **Burj Khalifa Dubai**\n• Level 124+125: ₹2,800 per person\n• Level 148 (Premium): ₹4,500 per person\n• At The Top SKY: ₹6,200 per person\n\n🎢 **IMG Worlds of Adventure**: ₹3,500 per person\n🎡 **Dubai Frame**: ₹1,200 per person\n🐠 **Dubai Aquarium**: ₹2,100 per person\n🎪 **Global Village**: ₹800 per person\n\n⚡ All tickets are delivered instantly to your email! Which attraction would you like to experience?';
    }

    if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('under')) {
      return '💰 Great! I love helping travelers find amazing deals within budget. What\'s your preferred budget range?\n\n**Budget-Friendly Options:**\n🎯 **Under ₹15,000**: Dubai day tours, local attractions\n🎯 **₹15,000-30,000**: Dubai 3N/4D packages, visa processing\n🎯 **₹30,000-50,000**: Dubai luxury packages, Europe visas\n🎯 **₹50,000+**: Europe packages, luxury experiences\n\n✨ Tell me your budget range and destination preference, and I\'ll show you the best options that give maximum value for money!';
    }
    
    return '🌟 I\'d love to help you plan the perfect trip! To give you personalized recommendations, could you tell me:\n\n📍 **Destination preference** (Dubai, Europe, USA, etc.)\n💰 **Budget range**\n🗓️ **Travel dates or duration**\n👥 **Number of travelers**\n🎯 **Type of experience** (Adventure, Romance, Family, Luxury)\n\n✨ Based on your preferences, I\'ll suggest the perfect tours, packages, visas, or tickets with special deals and insider tips!';
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-500 group animate-pulse"
        >
          <div className="relative">
            <Bot className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
          </div>
        </Button>
        <div className="absolute -top-3 -left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
          Ask AI! ✨
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  AI Travel Assistant <Zap className="h-4 w-4 text-yellow-300" />
                </CardTitle>
                <p className="text-sm text-blue-100">Plan My Trip with AI ✨</p>
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
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-900 shadow-md border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-2">{msg.time}</p>
                </div>
                {msg.type === 'user' && (
                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-md border">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-xs text-gray-600 mb-3 flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3 text-purple-500" />
                Quick suggestions to get started:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent text-xs transition-all duration-300"
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
                className="flex-1 rounded-full border-2 focus:border-purple-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 rounded-full"
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

export default EnhancedAIAssistant;
