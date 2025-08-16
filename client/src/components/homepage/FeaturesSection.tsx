
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, DollarSign, Shield, Zap, Smartphone, MapPin } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Instant Connections",
      description: "Post urgent loads and get driver responses within minutes, not hours",
      color: "text-dock-orange"
    },
    {
      icon: DollarSign,
      title: "Better Rates",
      description: "No broker margins means better pay for drivers and lower costs for shippers",
      color: "text-dock-blue"
    },
    {
      icon: Shield,
      title: "Verified Users",
      description: "All shippers and drivers are verified for safety and reliability",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Real-Time Tracking",
      description: "Live location updates and instant notifications throughout delivery",
      color: "text-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Full-featured mobile app for managing loads and communications on the go",
      color: "text-pink-600"
    },
    {
      icon: MapPin,
      title: "Smart Matching",
      description: "AI-powered load matching based on location, preferences, and history",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why Choose DockDirect?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Built for the modern freight industry with cutting-edge technology and user-first design
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <AnimatedCard key={feature.title} delay={index * 100}>
              <CardHeader className="text-center p-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-full flex items-center justify-center mb-6 shadow-md">
                  <IconComponent className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
