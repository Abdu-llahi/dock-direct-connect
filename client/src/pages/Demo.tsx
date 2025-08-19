import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { 
  Truck, Package, MapPin, DollarSign, Clock, Star, MessageSquare, 
  FileText, CheckCircle, ArrowRight, X, Plus, Users, TrendingUp,
  Map, Navigation, Calendar, AlertCircle
} from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Logo } from "@/components/ui/logo";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  pallets: number;
  weight: string;
  rate: number;
  urgent: boolean;
  status: string;
  bids: Bid[];
}

interface Bid {
  id: string;
  driverName: string;
  amount: number;
  message: string;
  rating: number;
  timeLeft: string;
}

const Demo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Mock data for demo
  useEffect(() => {
    const mockShipments: Shipment[] = [
      {
        id: "1",
        origin: "Los Angeles, CA",
        destination: "New York, NY",
        pallets: 10,
        weight: "5000 lbs",
        rate: 2500,
        urgent: true,
        status: "open",
        bids: [
          {
            id: "1",
            driverName: "Mike Johnson",
            amount: 2400,
            message: "Available immediately, experienced with electronics",
            rating: 4.8,
            timeLeft: "2:34"
          },
          {
            id: "2",
            driverName: "Sarah Williams",
            amount: 2300,
            message: "Best rate guaranteed, clean record",
            rating: 4.9,
            timeLeft: "1:45"
          }
        ]
      },
      {
        id: "2",
        origin: "Chicago, IL",
        destination: "Miami, FL",
        pallets: 15,
        weight: "7500 lbs",
        rate: 3200,
        urgent: false,
        status: "open",
        bids: [
          {
            id: "3",
            driverName: "David Chen",
            amount: 3100,
            message: "Refrigerated trailer ready for perishables",
            rating: 4.7,
            timeLeft: "4:12"
          }
        ]
      }
    ];
    setShipments(mockShipments);
  }, []);

  const handleAcceptBid = (shipmentId: string, bidId: string) => {
    setShipments(prev => prev.map(shipment => 
      shipment.id === shipmentId 
        ? { ...shipment, status: 'assigned' }
        : shipment
    ));
    toast({
      title: "Bid Accepted!",
      description: "Driver has been notified and shipment is now assigned.",
    });
  };

  const handleGenerateContract = () => {
    setShowContractPreview(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo />
              <span className="text-sm text-gray-500">Investor Demo</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <X className="h-4 w-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Shipment Map */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Live Shipment Map
                </CardTitle>
                <CardDescription>
                  Real-time tracking of active shipments and available drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
                    <p className="text-gray-600 mb-4">
                      Shipment pins and driver locations in real-time
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Package className="h-3 w-3 mr-1" />
                        8 Active Shipments
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Truck className="h-3 w-3 mr-1" />
                        47 Available Drivers
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Post Shipment Wizard */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post a Shipment
                </CardTitle>
                <CardDescription>
                  Quick 3-step process to get your load moving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Step 1: Origin/Destination */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="origin">Origin</Label>
                        <Input id="origin" placeholder="Los Angeles, CA" />
                      </div>
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Input id="destination" placeholder="New York, NY" />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setCurrentStep(2)}
                      >
                        Next: Pricing
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Pricing */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pallets">Pallets</Label>
                        <Input id="pallets" type="number" placeholder="10" />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input id="weight" placeholder="5000 lbs" />
                      </div>
                      <div>
                        <Label htmlFor="rate">Rate ($)</Label>
                        <Input id="rate" type="number" placeholder="2500" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="urgent" />
                        <Label htmlFor="urgent">Urgent Load</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setCurrentStep(3)}
                          className="flex-1"
                        >
                          Next: Review
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Shipment Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>Route:</strong> LA → NYC</div>
                          <div><strong>Pallets:</strong> 10</div>
                          <div><strong>Weight:</strong> 5000 lbs</div>
                          <div><strong>Rate:</strong> $2,500</div>
                          <div><strong>Urgent:</strong> Yes</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setCurrentStep(2)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handleGenerateContract}
                          className="flex-1"
                        >
                          Generate Contract
                          <FileText className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Bids Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Bids
                </CardTitle>
                <CardDescription>
                  Real-time driver bids on your shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="shipment-1" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="shipment-1">LA → NYC</TabsTrigger>
                    <TabsTrigger value="shipment-2">Chicago → Miami</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="shipment-1" className="space-y-4 mt-4">
                    {shipments[0]?.bids.map((bid) => (
                      <AnimatedCard key={bid.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{bid.driverName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {bid.rating}
                              <Clock className="h-3 w-3" />
                              {bid.timeLeft}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${bid.amount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {bid.amount < shipments[0].rate ? 'Below asking' : 'At asking'}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{bid.message}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAcceptBid(shipments[0].id, bid.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Bid
                        </Button>
                      </AnimatedCard>
                    ))}
                  </TabsContent>

                  <TabsContent value="shipment-2" className="space-y-4 mt-4">
                    {shipments[1]?.bids.map((bid) => (
                      <AnimatedCard key={bid.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{bid.driverName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {bid.rating}
                              <Clock className="h-3 w-3" />
                              {bid.timeLeft}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${bid.amount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {bid.amount < shipments[1].rate ? 'Below asking' : 'At asking'}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{bid.message}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAcceptBid(shipments[1].id, bid.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Bid
                        </Button>
                      </AnimatedCard>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contract Preview Dialog */}
      <Dialog open={showContractPreview} onOpenChange={setShowContractPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Smart Contract Preview</DialogTitle>
            <DialogDescription>
              AI-generated contract with all terms and conditions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Rate Confirmation</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Shipper:</strong> Demo Company Inc.</div>
                <div><strong>Driver:</strong> [To be assigned]</div>
                <div><strong>Origin:</strong> Los Angeles, CA</div>
                <div><strong>Destination:</strong> New York, NY</div>
                <div><strong>Rate:</strong> $2,500</div>
                <div><strong>Payment Terms:</strong> Quick Pay (2 days)</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Terms & Conditions</h4>
              <div className="text-sm space-y-2">
                <p>• Driver must arrive within 2 hours of scheduled pickup time</p>
                <p>• Shipper responsible for loading, driver for unloading</p>
                <p>• Payment processed within 2 business days of delivery</p>
                <p>• Insurance coverage up to $100,000 included</p>
                <p>• Dispute resolution through Dock Direct Connect platform</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowContractPreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowContractPreview(false);
                toast({
                  title: "Contract Generated!",
                  description: "Smart contract has been created and is ready for signature.",
                });
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Generate Contract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Demo;
