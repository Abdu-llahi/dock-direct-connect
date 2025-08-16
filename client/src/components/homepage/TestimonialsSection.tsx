
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Owner-Operator",
      location: "Texas",
      rating: 5,
      content: "DockDirect eliminated the broker fees that were eating into my profits. I'm making 15% more per load and finding work faster than ever.",
      avatar: "🚛"
    },
    {
      name: "Sarah Chen",
      role: "Logistics Manager",
      location: "California",
      rating: 5,
      content: "We've cut our shipping costs by 20% and improved delivery times. The real-time tracking gives our customers complete visibility.",
      avatar: "📦"
    },
    {
      name: "James Wilson",
      role: "Fleet Owner",
      location: "Florida",
      rating: 5,
      content: "Managing 12 trucks is so much easier now. The mobile app lets me assign loads and track my drivers from anywhere.",
      avatar: "🏢"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from drivers and shippers who've transformed their business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedCard key={testimonial.name} className="h-full" delay={index * 150}>
              <CardContent className="p-8 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-gray-300 mb-4" />
                
                <p className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
