
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TourFAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What should I wear for the tour?",
      answer: "We recommend comfortable walking shoes and weather-appropriate clothing. During summer months (May-September), light clothing, sunscreen, and a hat are essential. In winter, light layers are recommended as it can be cooler in the morning and evening."
    },
    {
      question: "Is hotel pickup included?",
      answer: "Yes, complimentary hotel pickup and drop-off is included for all Dubai hotels and most Sharjah hotels. Please provide your hotel details when booking. Pickup times may vary depending on your hotel location."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before the tour starts for a full refund. Cancellations made within 24 hours are non-refundable unless due to weather conditions or other circumstances beyond your control."
    },
    {
      question: "Is the tour suitable for children?",
      answer: "Absolutely! Our tours are family-friendly and suitable for children of all ages. Children under 2 years old can join for free (no separate seat required). We provide child-friendly commentary and ensure the pace is comfortable for families."
    },
    {
      question: "What languages are available?",
      answer: "Our tours are primarily conducted in English, but we can arrange guides who speak Arabic, Hindi, Urdu, and other languages upon special request. Please mention your language preference when booking."
    },
    {
      question: "Are meals included in the tour?",
      answer: "Meals are not included in the standard tour price, but we will stop at recommended restaurants where you can purchase food. We can also arrange special dietary requirements with advance notice."
    },
    {
      question: "What happens if the weather is bad?",
      answer: "Dubai has excellent weather year-round, but in case of extreme weather conditions, we may modify the itinerary for safety reasons. If the tour is cancelled due to weather, you'll receive a full refund or can reschedule for another date."
    },
    {
      question: "Can I take photos during the tour?",
      answer: "Yes, photography is encouraged! Our guides are happy to help take photos of you at the best spots. However, please note that some locations may have restrictions on photography, which our guide will inform you about."
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
        <p className="text-gray-600 mb-6">
          Find answers to common questions about this tour experience.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h4 className="font-bold text-blue-900 mb-2">Still have questions?</h4>
        <p className="text-blue-800 mb-4">
          Our customer service team is here to help you 24/7.
        </p>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
          <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            WhatsApp Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourFAQ;
