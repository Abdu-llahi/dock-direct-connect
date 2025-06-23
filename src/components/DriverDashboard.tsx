
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, LogOut, MapPin, DollarSign, Clock, Filter } from "lucide-react";

interface DriverDashboardProps {
  onLogout: () => void;
}

const DriverDashboard = ({ onLogout }: DriverDashboardProps) => {
  const [searchRadius, setSearchRadius] = useState("100");
  const [sortBy, setSortBy] = useState("distance");

  // Mock data
  const availableLoads = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      distance: "45 miles",
      pallets: 22,
      weight: "44,000 lbs",
      rate: "$2,400",
      urgent: true,
      postedAt: "2 hours ago",
      pickupTime: "Today 6:00 PM"
    },
    {
      id: 2,
      origin: "Milwaukee, WI",
      destination: "Indianapolis, IN",
      distance: "78 miles",
      pallets: 15,
      weight: "30,000 lbs",
      rate: "$1,950",
      urgent: false,
      postedAt: "4 hours ago",
      pickupTime: "Tomorrow 8:00 AM"
    },
    {
      id: 3,
      origin: "Grand Rapids, MI",
      destination: "Cleveland, OH",
      distance: "92 miles",
      pallets: 18,
      weight: "36,000 lbs",
      rate: "$2,100",
      urgent: false,
      postedAt: "6 hours ago",
      pickupTime: "Tomorrow 2:00 PM"
    }
  ];

  const myLoads = [
    {
      id: 4,
      origin: "Atlanta, GA",
      destination: "Miami, FL",
      status: "in_transit",
      rate: "$1,800",
      deliveryTime: "Tomorrow 10:00 AM"
    }
  ];

  const completedLoads = [
    {
      id: 5,
      origin: "Dallas, TX",
      destination: "Houston, TX",
      rate: "$1,200",
      completedAt: "3 days ago",
      shipper: "Walmart Distribution"
    }
  ];

  const handleAcceptLoad = (loadId: number) => {
    console.log('Accepting load:', loadId);
    // In a real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-dock-orange" />
              <span className="text-2xl font-bold text-dock-orange">DockDirect</span>
              <Badge variant="secondary">Driver</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Current Location: <span className="font-semibold">Chicago, IL</span>
              </div>
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
              <CardTitle className="text-sm font-medium">Available Loads</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Within 100 miles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$18,400</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loads Complete</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <div className="text-yellow-500">⭐</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground">Based on 47 reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Available Loads</TabsTrigger>
            <TabsTrigger value="myloads">My Loads</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Search Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Radius</label>
                    <Select value={searchRadius} onValueChange={setSearchRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 miles</SelectItem>
                        <SelectItem value="100">100 miles</SelectItem>
                        <SelectItem value="200">200 miles</SelectItem>
                        <SelectItem value="500">500 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="rate">Rate (High to Low)</SelectItem>
                        <SelectItem value="urgent">Urgent First</SelectItem>
                        <SelectItem value="recent">Most Recent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Rate</label>
                    <Input placeholder="$0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Loads */}
            <div className="grid gap-4">
              {availableLoads.map((load) => (
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
                        <CardDescription>
                          {load.distance} • Posted {load.postedAt}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{load.rate}</div>
                        <div className="text-sm text-gray-500">Total pay</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div><strong>Pickup:</strong> {load.pickupTime}</div>
                        <div><strong>Load:</strong> {load.pallets} pallets, {load.weight}</div>
                      </div>
                      <div className="flex justify-end items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button 
                          onClick={() => handleAcceptLoad(load.id)}
                          className="bg-dock-orange hover:bg-orange-600"
                          size="sm"
                        >
                          Accept Load
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="myloads">
            <div className="grid gap-4">
              {myLoads.map((load) => (
                <Card key={load.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {load.origin} → {load.destination}
                        </CardTitle>
                        <CardDescription>
                          Delivery: {load.deliveryTime}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-500 text-white">In Transit</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-green-600">{load.rate}</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Upload POD
                        </Button>
                        <Button size="sm" className="bg-dock-blue hover:bg-blue-800">
                          Mark Complete
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
                          Completed {load.completedAt} • Shipper: {load.shipper}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500 text-white">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-green-600">{load.rate}</div>
                      <Button variant="outline" size="sm">
                        View Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboard;
