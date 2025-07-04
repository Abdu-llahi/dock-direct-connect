
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Crown, Shield, Zap, Clock } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  currentPlan?: 'free' | 'premium';
}

const PricingModal = ({ isOpen, onClose, userType, currentPlan = 'free' }: PricingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [annualBilling, setAnnualBilling] = useState(false);

  const shipperPlans = [
    {
      id: 'free',
      name: 'Basic',
      price: 0,
      description: 'Standard load posting with 3% platform fee',
      features: [
        'Post unlimited loads',
        '3% platform fee per load',
        'Basic driver matching',
        'Standard support'
      ],
      limitations: [
        'No priority listing',
        'No emergency push',
        'Standard match speed'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: annualBilling ? 107.5 : 129,
      description: 'Priority features with reduced fees',
      features: [
        'Priority load listing',
        'Emergency push notifications',
        'Reduced 2.5% platform fee',
        'Advanced analytics',
        'Priority support',
        'Load insurance options'
      ],
      popular: true
    }
  ];

  const driverPlans = [
    {
      id: 'free',
      name: 'Basic',
      price: 0,
      description: 'Access to all available loads',
      features: [
        'Browse all loads',
        'Basic load alerts',
        'Standard support',
        'Load tracking'
      ],
      limitations: [
        'No priority alerts',
        'No home base optimization',
        'Standard payment terms'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: annualBilling ? 19 : 24,
      description: 'Priority access and advanced features',
      features: [
        'Priority load alerts',
        'Home base route optimization',
        'Instant payment option',
        'Load insurance coverage',
        'Advanced load filters',
        'Priority support'
      ],
      popular: true
    }
  ];

  const plans = userType === 'shipper' ? shipperPlans : driverPlans;

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to ${planId} plan`);
    // Implementation would integrate with payment processor
    setSelectedPlan(planId as 'free' | 'premium');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {userType === 'shipper' ? 'Shipper' : 'Driver'} Plans
          </DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <span className={`text-sm ${!annualBilling ? 'font-medium' : 'text-gray-600'}`}>
              Monthly
            </span>
            <Switch
              checked={annualBilling}
              onCheckedChange={setAnnualBilling}
            />
            <span className={`text-sm ${annualBilling ? 'font-medium' : 'text-gray-600'}`}>
              Annual
            </span>
            {annualBilling && (
              <Badge className="bg-green-100 text-green-800">Save 15%</Badge>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-dock-blue' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-dock-blue text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.id === currentPlan && (
                      <Badge variant="outline">Current</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                   <div className="text-3xl font-bold">
                     ${plan.price}
                     {plan.price > 0 && (
                       <span className="text-base font-normal text-gray-600">
                         /{annualBilling ? 'year' : 'month'}
                       </span>
                     )}
                   </div>
                   {annualBilling && plan.price > 0 && (
                     <p className="text-sm text-green-600 font-medium">
                       ${(plan.price * 12 * 0.15).toFixed(0)} annual savings!
                     </p>
                   )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Included:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations && (
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Limitations:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-2" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className={`w-full ${
                      plan.popular ? 'bg-dock-blue hover:bg-blue-800' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.id === currentPlan}
                  >
                    {plan.id === currentPlan ? 'Current Plan' : 
                     plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="text-center p-4">
              <Shield className="h-8 w-8 text-dock-blue mx-auto mb-2" />
              <h4 className="font-medium mb-1">Load Insurance</h4>
              <p className="text-sm text-gray-600">Optional 2% fee for full load protection</p>
            </Card>
            
            <Card className="text-center p-4">
              <Zap className="h-8 w-8 text-dock-orange mx-auto mb-2" />
              <h4 className="font-medium mb-1">Instant Payment</h4>
              <p className="text-sm text-gray-600">$5 fee for immediate fund release</p>
            </Card>
            
            <Card className="text-center p-4">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Priority Support</h4>
              <p className="text-sm text-gray-600">24/7 dedicated support channel</p>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
