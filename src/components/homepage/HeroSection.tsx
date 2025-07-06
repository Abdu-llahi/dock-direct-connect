
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';

interface HeroSectionProps {
  onRoleSelect: (role: "shipper" | "driver") => void;
}

const HeroSection = ({ onRoleSelect }: HeroSectionProps) => {

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

      </div>
    </div>
  );
};

export default HeroSection;
