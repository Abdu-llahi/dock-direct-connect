
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, DollarSign, Star, Users, Package, AlertTriangle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  // Mock analytics data
  const loadMatchData = [
    { month: 'Jan', avgTime: 18, loads: 145 },
    { month: 'Feb', avgTime: 15, loads: 189 },
    { month: 'Mar', avgTime: 12, loads: 234 },
    { month: 'Apr', avgTime: 14, loads: 198 },
    { month: 'May', avgTime: 11, loads: 267 },
    { month: 'Jun', avgTime: 9, loads: 298 }
  ];

  const revenueData = [
    { month: 'Jan', platformFees: 2400, subscriptions: 1800, insurance: 600 },
    { month: 'Feb', platformFees: 3200, subscriptions: 2100, insurance: 750 },
    { month: 'Mar', platformFees: 4100, subscriptions: 2400, insurance: 890 },
    { month: 'Apr', platformFees: 3800, subscriptions: 2200, insurance: 720 },
    { month: 'May', platformFees: 4900, subscriptions: 2600, insurance: 1100 },
    { month: 'Jun', platformFees: 5400, subscriptions: 2800, insurance: 1200 }
  ];

  const userTypeData = [
    { name: 'Active Drivers', value: 2847, color: '#f97316' },
    { name: 'Active Shippers', value: 1293, color: '#2563eb' },
    { name: 'Premium Users', value: 456, color: '#16a34a' }
  ];

  const topPerformers = {
    drivers: [
      { name: 'Mike Rodriguez', rating: 4.9, loads: 47, revenue: '$28,400' },
      { name: 'Sarah Chen', rating: 4.8, loads: 42, revenue: '$25,200' },
      { name: 'Carlos Martinez', rating: 4.9, loads: 39, revenue: '$23,400' }
    ],
    shippers: [
      { name: 'Walmart Distribution', rating: 4.7, loads: 156, spent: '$187,200' },
      { name: 'Amazon Fulfillment', rating: 4.9, loads: 98, spent: '$147,600' },
      { name: 'Target Logistics', rating: 4.6, loads: 87, spent: '$104,400' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userType="shipper"
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and revenue metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$42,300</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dock-blue">9 min</div>
              <p className="text-xs text-muted-foreground">Industry avg: 4 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">97.8%</div>
              <p className="text-xs text-muted-foreground">On-time deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dock-orange">4,140</div>
              <p className="text-xs text-muted-foreground">2,847 drivers, 1,293 shippers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="monetization">Monetization</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Load Match Speed Trend</CardTitle>
                  <CardDescription>Average time to match loads with drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={loadMatchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} min`, 'Avg Time']} />
                      <Line type="monotone" dataKey="avgTime" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Load Volume</CardTitle>
                  <CardDescription>Total loads processed per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={loadMatchData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, 'Loads']} />
                      <Bar dataKey="loads" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Monthly revenue by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, '']} />
                      <Bar dataKey="platformFees" fill="#2563eb" name="Platform Fees (3%)" />
                      <Bar dataKey="subscriptions" fill="#16a34a" name="Subscriptions" />
                      <Bar dataKey="insurance" fill="#f97316" name="Insurance Fees" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Active users by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Drivers</CardTitle>
                  <CardDescription>Highest performing drivers this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.drivers.map((driver, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-600">{driver.loads} loads • {driver.revenue}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{driver.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Shippers</CardTitle>
                  <CardDescription>Most active shipping companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.shippers.map((shipper, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{shipper.name}</div>
                          <div className="text-sm text-gray-600">{shipper.loads} loads • {shipper.spent}</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{shipper.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monetization">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Features</CardTitle>
                  <CardDescription>Revenue streams and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Platform Fee</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600">3% fee per completed load</p>
                    <p className="text-lg font-semibold text-green-600">$16,200/month</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Premium Subscriptions</h4>
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600">$29/month for priority listings</p>
                    <p className="text-lg font-semibold text-blue-600">$8,400/month</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Load Insurance</h4>
                      <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600">2% optional insurance fee</p>
                    <p className="text-lg font-semibold text-orange-600">$3,600/month</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Instant Payment</h4>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <p className="text-sm text-gray-600">$5 fee for instant fund release</p>
                    <p className="text-lg font-semibold text-gray-600">$0/month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Important business metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Acquisition Cost</span>
                    <span className="text-lg font-semibold">$12.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Lifetime Value</span>
                    <span className="text-lg font-semibold">$847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Churn Rate</span>
                    <span className="text-lg font-semibold">2.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Premium Conversion Rate</span>
                    <span className="text-lg font-semibold">11.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Revenue Per User</span>
                    <span className="text-lg font-semibold">$23.40</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
