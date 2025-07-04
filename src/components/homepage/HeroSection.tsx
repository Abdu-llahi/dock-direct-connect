
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Truck, CheckCircle, Mail } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HeroSectionProps {
  onRoleSelect: (role: "shipper" | "driver") => void;
}

const HeroSection = ({ onRoleSelect }: HeroSectionProps) => {
  const [betaEmail, setBetaEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!betaEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(betaEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('beta_waitlist')
        .insert([{ email: betaEmail }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Email already registered for beta access');
        } else {
          toast.error('Failed to join beta list. Please try again.');
        }
      } else {
        setIsSubmitted(true);
        setBetaEmail('');
        toast.success('Thank you for joining our beta list! We\'ll be in touch soon.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Move freight{" "}
          <span className="bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
            faster.
          </span>
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-orange-500 to-blue-700 bg-clip-text text-transparent">
            Skip the broker fees.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Connect warehouse shippers directly with truck drivers. 
          <br className="hidden md:block" />
          No middlemen, no delays, no unnecessary fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            size="lg"
            className="bg-dock-blue hover:bg-blue-800 text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
            onClick={() => onRoleSelect("shipper")}
          >
            <Package className="mr-3 h-6 w-6" />
            I'm a Shipper
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-dock-orange text-dock-orange hover:bg-dock-orange hover:text-white px-10 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
            onClick={() => onRoleSelect("driver")}
          >
            <Truck className="mr-3 h-6 w-6" />
            I'm a Driver
          </Button>
        </div>

        <AnimatedCard className="max-w-lg mx-auto border-red-200 bg-red-50 shadow-lg mb-12" delay={200}>
          <CardHeader className="pb-4">
            <Badge className="w-fit mx-auto bg-red-500 text-white urgent-pulse text-sm font-semibold px-3 py-1">
              🚨 URGENT LOAD
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-700 font-medium">
              <span className="text-lg font-bold text-gray-900">Chicago, IL → Detroit, MI</span>
              <br />
              22 pallets • <span className="text-green-600 font-bold text-xl">$2,400</span>
              <br />
              <span className="font-bold text-red-600 text-lg">Pickup in 2 hours</span>
            </p>
          </CardContent>
        </AnimatedCard>

        {/* Beta Waitlist Section */}
        <AnimatedCard className="max-w-md mx-auto border-blue-200 bg-blue-50 shadow-lg" delay={400}>
          <CardHeader>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Get Early Access</h3>
            </div>
            <p className="text-gray-600 text-sm text-center">
              Join our beta program and be the first to try these revolutionary features
            </p>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleBetaSignup} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={betaEmail}
                  onChange={(e) => setBetaEmail(e.target.value)}
                  required
                  className="w-full"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Joining...' : 'Join Beta List'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 font-semibold">
                  Thank you for joining our beta list!
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  We'll notify you when early access is available.
                </p>
              </div>
            )}
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default HeroSection;
