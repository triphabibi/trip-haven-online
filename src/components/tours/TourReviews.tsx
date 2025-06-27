
import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface TourReviewsProps {
  tourId: string;
  rating: number;
  totalReviews: number;
}

const TourReviews = ({ tourId, rating, totalReviews }: TourReviewsProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely amazing experience! Our guide was knowledgeable and friendly. The views from Burj Khalifa were breathtaking. Highly recommend this tour!",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: "Mohammed Al Rashid",
      rating: 5,
      date: "2024-01-10",
      comment: "Perfect tour for first-time visitors to Dubai. Everything was well organized and on time. The guide shared interesting stories about Dubai's history.",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 4,
      date: "2024-01-05",
      comment: "Good tour overall. The pickup was punctual and the guide was professional. Only wish we had more time at each location.",
      helpful: 5,
      verified: true
    }
  ];

  const ratingBreakdown = [
    { stars: 5, percentage: 75, count: Math.floor(totalReviews * 0.75) },
    { stars: 4, percentage: 15, count: Math.floor(totalReviews * 0.15) },
    { stars: 3, percentage: 7, count: Math.floor(totalReviews * 0.07) },
    { stars: 2, percentage: 2, count: Math.floor(totalReviews * 0.02) },
    { stars: 1, percentage: 1, count: Math.floor(totalReviews * 0.01) },
  ];

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{rating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-600">Based on {totalReviews} reviews</div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span>{item.stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-sm text-gray-600 w-12">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRating === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating(null)}
        >
          All Reviews
        </Button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <Button
            key={rating}
            variant={selectedRating === rating ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRating(rating)}
            className="flex items-center gap-1"
          >
            {rating} <Star className="h-3 w-3" />
          </Button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{review.name}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
};

export default TourReviews;
