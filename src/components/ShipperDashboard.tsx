
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, LogOut, Clock, MapPin, Weight, DollarSign } from "lucide-react";
import LoadPostingModal from "@/components/LoadPostingModal";

interface ShipperDashboardProps {
  onLogout: () => void;
}

const ShipperDashboard = ({ onLogout }: ShipperDashboardProps) => {
  const [showLoadModal, setShowLoadModal] = useState(false);

  // Mock data
  const activeLoads = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      pallets: 22,
      weight: "44,000 lbs",
      rate: "$2,400",
      urgent: true,
      status: "seeking_driver",
      postedAt: "2 hours ago"
    },
    {
      id: 2,
      origin: "Atlanta, GA",
      destination: "Miami, FL",
      pallets: 15,
      weight: "30,000 lbs",
      rate: "$1,800",
      urgent: false,
      status: "driver_assigned",
      postedAt: "1 day ago"
    }
  ];

  const completedLoads = [
    {
      id: 3,
      origin: "Dallas, TX",
      destination: "Houston, TX",
      pallets: 18,
      weight: "36,000 lbs",
      rate: "$1,200",
      completedAt: "3 days ago",
      driver: "Mike Rodriguez"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-dock-blue" />
              <span className="text-2xl font-bold text-dock-blue">DockDirect</span>
              <Badge variant="secondary">Shipper</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowLoadModal(true)} className="bg-dock-blue hover:bg-blue-800">
                <Plus className="mr-2 h-4 w-4" />
                Post Load
              </Button>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 urgent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,600</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18min</div>
              <p className="text-xs text-muted-foreground">Industry avg: 4hrs</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Loads</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="grid gap-4">
              {activeLoads.map((load) => (
                <Card key={load.id} className={load.urgent ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">
                            {load.origin} → {load.destination}
                          </CardTitle>
                          {load.urgent && (
                            <Badge className="bg-red-500 text-white urgent-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <CardDescription>Posted {load.postedAt}</CardDescription>
                      </div>
                      <Badge variant={load.status === 'seeking_driver' ? 'destructive' : 'default'}>
                        {load.status === 'seeking_driver' ? 'Seeking Driver' : 'Driver Assigned'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{load.pallets} pallets</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{load.weight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-green-600">{load.rate}</span>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4">
              {completedLoads.map((load) => (
                <Card key={load.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {load.origin} → {load.destination}
                        </CardTitle>
                        <CardDescription>
                          Completed {load.completedAt} • Driver: {load.driver}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500 text-white">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{load.pallets} pallets</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{load.weight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-green-600">{load.rate}</span>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showLoadModal && (
        <LoadPostingModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
        />
      )}
    </div>
  );
};

export default ShipperDashboard;
