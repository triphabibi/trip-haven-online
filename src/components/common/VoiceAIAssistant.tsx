import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, Sparkles, Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VoiceAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      message: '🎤 Hi! I\'m your Voice-Enabled AI Travel Assistant. Click the mic to speak or type your travel needs. I can help you book tours, packages, visas, and tickets!',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  const quickSuggestions = [
    '🎤 "Book Dubai desert safari for 2 people"',
    '🎤 "I need UAE visa for family of 4"',
    '🎤 "Show me Europe packages under ₹80k"',
    '🎤 "Burj Khalifa tickets for tomorrow"',
    '🎤 "Plan honeymoon trip to Paris"',
    '🎤 "Book airport transfer in Dubai"'
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        if (event.results[event.resultIndex].isFinal) {
          setInputMessage(transcript);
          setIsListening(false);
          handleVoiceMessage(transcript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Couldn't hear you clearly. Please try again or type your message.",
        });
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input. Please type your message.",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakMessage = (text: string) => {
    if (synthRef.current) {
      // Clean the text for speech (remove emojis and markdown)
      const cleanText = text.replace(/[🎭🏗️🏜️🏨🛂✨💕🇫🇷🇮🇹🇬🇧🎫🏢🌟📍💰🎯]/g, '').replace(/\*\*/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const handleVoiceMessage = async (transcript: string) => {
    const userMessage = {
      type: 'user',
      message: `🎤 ${transcript}`,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI processing and generate smart response
    setTimeout(() => {
      const response = generateSmartResponse(transcript);
      const botMessage = {
        type: 'bot',
        message: response,
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Speak the response
      speakMessage(response);
      
      // Check if we should redirect to booking
      checkForBookingRedirect(transcript);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSmartResponse(currentMessage);
      const botMessage = {
        type: 'bot',
        message: response,
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      checkForBookingRedirect(currentMessage);
    }, 1500);
  };

  const generateSmartResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Desert Safari booking intent
    if (lowerQuery.includes('desert safari') || lowerQuery.includes('safari')) {
      return '🏜️ Perfect! I found our popular Dubai Desert Safari experience:\n\n🎭 **Dubai Desert Safari with BBQ** - ₹3,200 per person\n• Dune bashing, camel riding, BBQ dinner\n• Pickup from hotel included\n• Traditional shows and entertainment\n\n📅 Which date would you prefer? I can redirect you to book directly with all details pre-filled!';
    }
    
    // Visa booking intent
    if (lowerQuery.includes('visa') && (lowerQuery.includes('uae') || lowerQuery.includes('dubai'))) {
      return '🛂 Great choice! UAE visa processing:\n\n**UAE Tourist Visa** - ₹8,500 per person\n• 30-day validity\n• 3-5 days processing\n• 98% approval rate\n• Document assistance included\n\n👨‍👩‍👧‍👦 For a family of 4, total cost would be ₹34,000. Would you like me to start the application process?';
    }
    
    // Europe packages
    if (lowerQuery.includes('europe') || lowerQuery.includes('paris') || lowerQuery.includes('honeymoon')) {
      return '💕 Romantic Europe packages available:\n\n🇫🇷 **Paris + Switzerland Romance** - ₹85,000 (7 days)\n• 5-star hotels with city views\n• Seine river cruise & Eiffel Tower dinner\n• Swiss Alps experience\n\n🇮🇹 **Italy Grand Romance** - ₹92,000 (8 days)\n• Venice gondola rides, Rome tours\n• Tuscany wine tasting\n\nBoth include flights, hotels, and romantic surprises! Which destination calls to your heart?';
    }
    
    // Burj Khalifa tickets
    if (lowerQuery.includes('burj khalifa') || lowerQuery.includes('tickets')) {
      return '🏗️ Burj Khalifa tickets available:\n\n🎫 **Level 124+125** - ₹2,800 per person\n🎫 **Level 148 Premium** - ₹4,500 per person\n🎫 **At The Top SKY** - ₹6,200 per person\n\n⚡ All tickets include skip-the-line access and are delivered instantly! For tomorrow, I recommend booking Level 124+125. Shall I proceed?';
    }
    
    // Airport transfer
    if (lowerQuery.includes('transfer') || lowerQuery.includes('airport')) {
      return '🚗 Dubai Airport Transfer options:\n\n🚙 **Economy Car** - ₹800 (1-3 pax)\n🚐 **SUV** - ₹1,200 (4-6 pax)\n🚌 **Van** - ₹1,800 (7-12 pax)\n\n📍 Please specify pickup and drop-off locations, and I\'ll arrange your comfortable transfer with professional drivers!';
    }
    
    return '🌟 I understand you\'re looking for travel services! To give you the best recommendations, could you tell me:\n\n📍 **Destination** (Dubai, Europe, USA, etc.)\n👥 **Number of travelers**\n📅 **Travel dates**\n💰 **Budget range**\n\n🎤 You can speak these details or type them, and I\'ll find perfect options for you!';
  };

  const checkForBookingRedirect = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Auto-redirect logic for specific services
    if (lowerQuery.includes('book') || lowerQuery.includes('proceed') || lowerQuery.includes('yes')) {
      setTimeout(() => {
        if (lowerQuery.includes('safari')) {
          // Redirect to tours page with safari filter
          window.location.href = '/tours?filter=safari';
        } else if (lowerQuery.includes('visa')) {
          // Redirect to visa page
          window.location.href = '/visas';
        } else if (lowerQuery.includes('burj khalifa')) {
          // Redirect to tickets page
          window.location.href = '/tickets?filter=burj';
        } else if (lowerQuery.includes('europe') || lowerQuery.includes('paris')) {
          // Redirect to packages
          window.location.href = '/packages?filter=europe';
        }
      }, 3000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Remove the mic emoji and quotes from suggestion
    const cleanSuggestion = suggestion.replace('🎤 "', '').replace('"', '');
    setInputMessage(cleanSuggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-500 group animate-pulse"
        >
          <div className="relative">
            <Bot className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
          </div>
        </Button>
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
          🎤 Voice AI ✨
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Voice AI Assistant <Mic className="h-4 w-4 text-yellow-300" />
                </CardTitle>
                <p className="text-sm text-blue-100">🎤 Speak or Type to Book ✨</p>
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

          {/* Voice Status */}
          {(isListening || isSpeaking) && (
            <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border-t">
              <div className="flex items-center gap-2 text-sm">
                {isListening && (
                  <>
                    <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                    <span className="text-red-600 font-medium">Listening...</span>
                  </>
                )}
                {isSpeaking && (
                  <>
                    <Volume2 className="h-4 w-4 text-blue-500 animate-pulse" />
                    <span className="text-blue-600 font-medium">Speaking...</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-xs text-gray-600 mb-3 flex items-center gap-1 font-medium">
                <Sparkles className="h-3 w-3 text-purple-500" />
                Try saying or clicking:
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

          {/* Input with Voice */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                } px-3 rounded-full`}
                disabled={isSpeaking}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Speak or type your travel needs..."
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

export default VoiceAIAssistant;