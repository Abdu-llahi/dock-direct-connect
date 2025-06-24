
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, CreditCard, Truck2, Bell } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedCard from '@/components/ui/animated-card';

const NextGenSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock newsletter signup
      setIsSubscribed(true);
      toast.success('Thanks for joining our beta list!');
      setEmail('');
    }
  };

  const upcomingFeatures = [
    {
      icon: Brain,
      title: "AI Driver Matching",
      description: "Smart algorithms to match the perfect driver for every load based on route history, performance, and preferences",
      color: "text-dock-blue"
    },
    {
      icon: CreditCard,
      title: "Payment Escrow",
      description: "Secure payment protection for both parties with instant payouts upon delivery confirmation",
      color: "text-dock-orange"
    },
    {
      icon: Truck2,
      title: "Fleet Management",
      description: "Advanced tools for managing multiple drivers and loads with real-time analytics and reporting",
      color: "text-green-600"
    },
    {
      icon: Bell,
      title: "Emergency Alerts",
      description: "Push notifications for urgent loads, route changes, and emergency situations",
      color: "text-red-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <AnimatedCard className="bg-gradient-to-r from-blue-100 to-orange-100 border-0 shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Next-Gen Features
          </CardTitle>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're constantly innovating to make freight logistics smarter, faster, and more profitable
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {upcomingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg mb-2 ${feature.color}`}>
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Get Early Access
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Join our beta program and be the first to try these revolutionary features
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-dock-blue hover:bg-blue-800 text-white px-8 py-2 font-semibold"
                >
                  Join Beta List
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="text-green-600 text-lg font-semibold">✅ You're on the list!</div>
                <p className="text-gray-600 mt-2">We'll notify you when beta access is available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
};

export default NextGenSection;
