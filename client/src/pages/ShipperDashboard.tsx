import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Truck, Package, MapPin, DollarSign, Clock, Star, MessageSquare, 
  FileText, Plus, LogOut, BarChart3, TrendingUp, Users, AlertCircle, CheckCircle
} from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Logo } from "@/components/ui/logo";

interface ShipperDashboardProps {
  onLogout: () => void;
}

const ShipperDashboard = ({ onLogout }: ShipperDashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const mockShipments = [
    {
      id: "1",
      origin: "Los Angeles, CA",
      destination: "New York, NY",
      pallets: 10,
      weight: "5000 lbs",
      rate: 2500,
      status: "open",
      bids: 3,
      urgent: true,
    },
    {
      id: "2",
      origin: "Chicago, IL",
      destination: "Miami, FL",
      pallets: 15,
      weight: "7500 lbs",
      rate: 3200,
      status: "assigned",
      bids: 0,
      urgent: false,
    },
    {
      id: "3",
      origin: "Seattle, WA",
      destination: "Denver, CO",
      pallets: 8,
      weight: "4000 lbs",
      rate: 1800,
      status: "in_transit",
      bids: 0,
      urgent: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: "bg-blue-100 text-blue-800", text: "Open for Bids" },
      assigned: { color: "bg-yellow-100 text-yellow-800", text: "Assigned" },
      in_transit: { color: "bg-green-100 text-green-800", text: "In Transit" },
      delivered: { color: "bg-gray-100 text-gray-800", text: "Delivered" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo />
              <span className="text-sm text-gray-500">Shipper Dashboard</span>
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
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={100}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">$24,500</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={200}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Bids</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </AnimatedCard>

          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg" delay={300}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold text-purple-600">98.2%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </AnimatedCard>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Shipments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Shipments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShipments.slice(0, 3).map((shipment) => (
                      <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-semibold">
                            {shipment.origin} → {shipment.destination}
                          </div>
                          <div className="text-sm text-gray-600">
                            {shipment.pallets} pallets • {shipment.weight}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${shipment.rate}</div>
                          {getStatusBadge(shipment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full justify-start" size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Post New Shipment
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <FileText className="h-4 w-4 mr-2" />
                      View Contracts
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>
                  Manage your shipments and track their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">
                            {shipment.origin} → {shipment.destination}
                          </div>
                          <div className="text-sm text-gray-600">
                            {shipment.pallets} pallets • {shipment.weight} • ${shipment.rate}
                          </div>
                        </div>
                        {shipment.urgent && (
                          <Badge variant="destructive" className="animate-pulse">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(shipment.status)}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Bids</CardTitle>
                <CardDescription>
                  Review and accept driver bids for your shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending bids at the moment</p>
                  <p className="text-sm">Bids will appear here when drivers respond to your shipments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track your shipping performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Detailed performance metrics and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShipperDashboard;
