import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Truck, Package, MapPin, DollarSign, Clock, Star, MessageSquare, 
  FileText, Plus, LogOut, BarChart3, TrendingUp, Users, AlertCircle, CheckCircle, Navigation
} from "lucide-react";
import AnimatedCard from "@/components/ui/animated-card";
import Logo from "@/components/ui/logo";

interface DriverDashboardProps {
  onLogout: () => void;
}

const DriverDashboard = ({ onLogout }: DriverDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");

  const mockAvailableShipments = [
    {
      id: "1",
      origin: "Los Angeles, CA",
      destination: "New York, NY",
      pallets: 10,
      weight: "5000 lbs",
      rate: 2500,
      urgent: true,
      shipper: "TechCorp Inc.",
      distance: "2,789 miles",
    },
    {
      id: "2",
      origin: "Chicago, IL",
      destination: "Miami, FL",
      pallets: 15,
      weight: "7500 lbs",
      rate: 3200,
      urgent: false,
      shipper: "FoodExpress",
      distance: "1,380 miles",
    },
    {
      id: "3",
      origin: "Seattle, WA",
      destination: "Denver, CO",
      pallets: 8,
      weight: "4000 lbs",
      rate: 1800,
      urgent: false,
      shipper: "Mountain Logistics",
      distance: "1,320 miles",
    },
  ];

  const mockActiveShipments = [
    {
      id: "4",
      origin: "Houston, TX",
      destination: "Phoenix, AZ",
      pallets: 12,
      weight: "6000 lbs",
      rate: 2200,
      status: "in_transit",
      shipper: "OilCo Industries",
      eta: "2 hours",
      progress: 75,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      assigned: { color: "bg-yellow-100 text-yellow-800", text: "Assigned" },
      in_transit: { color: "bg-green-100 text-green-800", text: "In Transit" },
      delivered: { color: "bg-gray-100 text-gray-800", text: "Delivered" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.assigned;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const handleBid = (shipmentId: string) => {
    toast({
      title: "Bid Submitted!",
      description: "Your bid has been sent to the shipper.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo />
              <span className="text-sm text-gray-500">Driver Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Loads</p>
                <p className="text-2xl font-bold text-blue-600">24</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={100}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month's Earnings</p>
                <p className="text-2xl font-bold text-green-600">$8,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={200}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={300}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-purple-600">4.8</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </AnimatedCard>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Loads</TabsTrigger>
            <TabsTrigger value="active">Active Shipments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Shipments</CardTitle>
                <CardDescription>
                  Browse and bid on available loads in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAvailableShipments.map((shipment) => (
                    <AnimatedCard key={shipment.id} className="border p-6 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold">
                              {shipment.origin} → {shipment.destination}
                            </h3>
                            {shipment.urgent && (
                              <Badge variant="destructive" className="animate-pulse">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <strong>Pallets:</strong> {shipment.pallets}
                            </div>
                            <div>
                              <strong>Weight:</strong> {shipment.weight}
                            </div>
                            <div>
                              <strong>Distance:</strong> {shipment.distance}
                            </div>
                            <div>
                              <strong>Shipper:</strong> {shipment.shipper}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${shipment.rate}
                          </div>
                          <Button onClick={() => handleBid(shipment.id)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Place Bid
                          </Button>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>
                  Track your current shipments and delivery progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActiveShipments.map((shipment) => (
                    <AnimatedCard key={shipment.id} className="border p-6 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-lg font-semibold">
                              {shipment.origin} → {shipment.destination}
                            </h3>
                            {getStatusBadge(shipment.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <strong>Pallets:</strong> {shipment.pallets}
                            </div>
                            <div>
                              <strong>Weight:</strong> {shipment.weight}
                            </div>
                            <div>
                              <strong>ETA:</strong> {shipment.eta}
                            </div>
                            <div>
                              <strong>Shipper:</strong> {shipment.shipper}
                            </div>
                          </div>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{shipment.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${shipment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            ${shipment.rate}
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">
                              <Navigation className="h-4 w-4 mr-2" />
                              Update Location
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Shipper
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>
                  View your completed shipments and earnings history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No delivery history yet</p>
                  <p className="text-sm">Completed shipments will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
