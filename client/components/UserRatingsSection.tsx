import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Verified, TrendingUp } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  scoreImprovement?: number;
  verified: boolean;
  avatar: string;
  beforeScore?: number;
  afterScore?: number;
}

interface UserRatingsSectionProps {
  title?: string;
  subtitle?: string;
  maxTestimonials?: number;
}

export default function UserRatingsSection({
  title = "What Our Users Say",
  subtitle = "Real stories from people who improved their credit with CreditBridge",
  maxTestimonials = 6,
}: UserRatingsSectionProps) {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Chen",
      location: "San Francisco, CA",
      rating: 5,
      title: "Finally got approved for my first credit card!",
      comment:
        "I had no credit history but CreditBridge used my rent payments and utility bills to show I'm responsible. Got approved for a card with great terms!",
      scoreImprovement: 145,
      verified: true,
      avatar: "SC",
      beforeScore: 0,
      afterScore: 698,
    },
    {
      id: "2",
      name: "Marcus Johnson",
      location: "Atlanta, GA",
      rating: 5,
      title: "Boosted my score when traditional credit couldn't",
      comment:
        "My traditional score was stuck at 620, but CreditBridge recognized my consistent rent and utility payments. Now I qualify for better rates!",
      scoreImprovement: 87,
      verified: true,
      avatar: "MJ",
      beforeScore: 620,
      afterScore: 707,
    },
    {
      id: "3",
      name: "Ana Rodriguez",
      location: "Phoenix, AZ",
      rating: 5,
      title: "Perfect for gig workers like me",
      comment:
        "Traditional banks didn't understand my freelance income, but CreditBridge looked at my banking patterns and payment history. Game changer!",
      scoreImprovement: 112,
      verified: true,
      avatar: "AR",
      beforeScore: 580,
      afterScore: 692,
    },
    {
      id: "4",
      name: "David Kim",
      location: "Seattle, WA",
      rating: 5,
      title: "Transparent and fair scoring",
      comment:
        "I love that I can see exactly what affects my score. The coaching helped me improve my financial habits and my score jumped 95 points!",
      scoreImprovement: 95,
      verified: true,
      avatar: "DK",
      beforeScore: 640,
      afterScore: 735,
    },
    {
      id: "5",
      name: "Jessica Taylor",
      location: "Austin, TX",
      rating: 5,
      title: "Got my dream apartment",
      comment:
        "Landlords now see my CreditBridge score and trust my rental history. Finally got approved for the apartment I wanted in downtown Austin!",
      scoreImprovement: 78,
      verified: true,
      avatar: "JT",
      beforeScore: 665,
      afterScore: 743,
    },
    {
      id: "6",
      name: "Robert Williams",
      location: "Denver, CO",
      rating: 5,
      title: "Auto loan at great rates",
      comment:
        "Even with limited credit cards, my consistent bill payments and employment history got me pre-approved for an auto loan at 4.2% APR!",
      scoreImprovement: 102,
      verified: true,
      avatar: "RW",
      beforeScore: 610,
      afterScore: 712,
    },
    {
      id: "7",
      name: "Maya Patel",
      location: "New York, NY",
      rating: 5,
      title: "International student success story",
      comment:
        "As an international student with no US credit history, CreditBridge gave me a fair chance using my banking and payment data. Amazing!",
      scoreImprovement: 234,
      verified: true,
      avatar: "MP",
      beforeScore: 0,
      afterScore: 689,
    },
    {
      id: "8",
      name: "Chris Anderson",
      location: "Miami, FL",
      rating: 5,
      title: "Small business owner approved",
      comment:
        "Traditional lenders rejected my business loan application, but CreditBridge's alternative scoring helped me get approved for expansion funding!",
      scoreImprovement: 67,
      verified: true,
      avatar: "CA",
      beforeScore: 658,
      afterScore: 725,
    },
  ];

  const displayedTestimonials = testimonials.slice(0, maxTestimonials);
  const overallRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length * 127; // Simulate larger user base
  const averageImprovement = Math.round(
    testimonials.reduce((sum, t) => sum + (t.scoreImprovement || 0), 0) /
      testimonials.length,
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Overall Rating Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex items-center">
              <div className="flex mr-2">
                {renderStars(Math.round(overallRating))}
              </div>
              <span className="text-2xl font-bold text-gray-900 mr-2">
                {overallRating.toFixed(1)}
              </span>
              <span className="text-gray-600">out of 5</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalReviews.toLocaleString()}+
              </div>
              <div className="text-gray-600">Happy users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{averageImprovement}
              </div>
              <div className="text-gray-600">Average score boost</div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        {testimonial.verified && (
                          <Verified className="h-4 w-4 text-blue-500 ml-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {testimonial.title}
                  </h4>
                  <div className="relative">
                    <Quote className="h-4 w-4 text-gray-400 absolute -top-1 -left-1" />
                    <p className="text-gray-600 text-sm pl-3">
                      {testimonial.comment}
                    </p>
                  </div>
                </div>

                {testimonial.scoreImprovement && (
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-700 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />+
                        {testimonial.scoreImprovement} points
                      </Badge>
                      {testimonial.beforeScore !== undefined &&
                        testimonial.afterScore && (
                          <div className="text-xs text-gray-500">
                            {testimonial.beforeScore === 0
                              ? "No credit"
                              : testimonial.beforeScore}{" "}
                            → {testimonial.afterScore}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">87%</div>
              <div className="text-sm text-gray-600">Score Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
