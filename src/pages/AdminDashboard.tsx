
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Truck, Package, DollarSign, Settings, LogOut, AlertTriangle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AdminPanel from './AdminPanel';

const AdminDashboard = () => {
  const { user, loading, signOut } = useAuth();

  // Redirect if not authenticated or not admin
  if (!loading && (!user || (user.role !== 'admin' && user.user_type !== 'admin'))) {
    return <Navigate to="/admin-login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  // Mock admin stats - replace with real data
  const stats = {
    totalUsers: 847,
    activeLoads: 23,
    pendingVerifications: 12,
    monthlyRevenue: 15420,
    platformFeeRate: 3.0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader
        userType="admin"
        userName={user?.name}
        onLogout={handleLogout}
      />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Dashboard Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
        {/* Alert Section */}
        <Card className="mb-8 border-amber-500/20 bg-amber-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <h3 className="font-semibold text-amber-200">Pending Verifications</h3>
                <p className="text-sm text-amber-300">{stats.pendingVerifications} drivers awaiting verification review</p>
              </div>
              <Button size="sm" className="ml-auto bg-amber-600 hover:bg-amber-700">
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-slate-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">Active Loads</CardTitle>
                <Package className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeLoads}</div>
              <p className="text-xs text-slate-400">Currently in transit</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Platform fees collected</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">Commission Rate</CardTitle>
                <Settings className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.platformFeeRate}%</div>
              <p className="text-xs text-slate-400">Current platform fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                User Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage driver and shipper accounts, verification status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {stats.pendingVerifications} pending
                </Badge>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-400" />
                Load Oversight
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor active loads, resolve disputes, track performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                  {stats.activeLoads} active
                </Badge>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Platform Settings
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure fees, pricing, and platform parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {stats.platformFeeRate}% fee
                </Badge>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="users">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
