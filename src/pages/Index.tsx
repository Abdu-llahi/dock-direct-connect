
import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Clock, DollarSign, Users, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import ShipperDashboard from "@/components/ShipperDashboard";
import DriverDashboard from "@/components/DriverDashboard";

const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleRoleSelect = (role: "shipper" | "driver" | "admin") => {
    navigate(`/auth`);
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Truck className="h-12 w-12 text-blue-700 mx-auto mb-4" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show appropriate dashboard if logged in
  if (user?.role === "shipper") return <ShipperDashboard onLogout={handleLogout} />;
  if (user?.role === "driver") return <DriverDashboard onLogout={handleLogout} />;
  if (user?.role === "admin") {
    return (
      <Suspense fallback={<div className="text-center py-10">Loading admin dashboard...</div>}>
        <AdminDashboard onLogout={handleLogout} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-700" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
                DockDirect
              </span>
            </div>
            <div className="flex space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => handleRoleSelect("shipper")} className="hover:bg-blue-50">
                    Shipper Login
                  </Button>
                  <Button variant="ghost" onClick={() => handleRoleSelect("driver")} className="hover:bg-orange-50">
                    Driver Login
                  </Button>
                  <Button variant="ghost" onClick={() => handleRoleSelect("admin")} className="hover:bg-gray-50 text-xs">
                    Admin
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Move freight faster.{" "}
            <span className="bg-gradient-to-r from-blue-700 to-orange-500 bg-clip-text text-transparent">
              Skip the broker fees.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect warehouse shippers directly with truck drivers. No middlemen, no delays, no unnecessary fees.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-dock-blue hover:bg-blue-800 text-white px-8 py-4 text-lg"
              onClick={() => handleRoleSelect("shipper")}
            >
              <Package className="mr-2 h-5 w-5" />
              I'm a Shipper
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-dock-orange text-dock-orange hover:bg-dock-orange hover:text-white px-8 py-4 text-lg"
              onClick={() => handleRoleSelect("driver")}
            >
              <Truck className="mr-2 h-5 w-5" />
              I'm a Driver
            </Button>
          </div>

          <Card className="max-w-md mx-auto mb-12 border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <Badge className="w-fit mx-auto bg-red-500 text-white urgent-pulse">URGENT LOAD</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                Chicago, IL → Detroit, MI • 22 pallets • $2,400 •{" "}
                <span className="font-semibold text-red-600">Pickup in 2 hours</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-dock-orange mx-auto mb-4" />
              <CardTitle>Instant Connections</CardTitle>
              <CardDescription>
                Post urgent loads and get driver responses within minutes, not hours
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-dock-blue mx-auto mb-4" />
              <CardTitle>Better Rates</CardTitle>
              <CardDescription>
                No broker margins means better pay for drivers and lower costs for shippers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Verified Users</CardTitle>
              <CardDescription>
                All shippers and drivers are verified for safety and reliability
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center">
          <div>
            <div className="text-3xl font-bold text-dock-blue">2,400+</div>
            <div className="text-gray-600">Active Drivers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-dock-orange">850+</div>
            <div className="text-gray-600">Verified Shippers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">$4.2M</div>
            <div className="text-gray-600">Loads Moved</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">15min</div>
            <div className="text-gray-600">Avg Match Time</div>
          </div>
        </div>

        {/* Coming Soon */}
        <Card className="mt-20 bg-gradient-to-r from-blue-100 to-orange-100 border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Coming Soon</CardTitle>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-dock-blue mb-2">🤖 AI Driver Matching</h4>
                <p className="text-sm text-gray-600">Smart algorithms to match the perfect driver for every load</p>
              </div>
              <div>
                <h4 className="font-semibold text-dock-orange mb-2">💰 Payment Escrow</h4>
                <p className="text-sm text-gray-600">Secure payment protection for both parties</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">🚛 Fleet Management</h4>
                <p className="text-sm text-gray-600">Advanced tools for managing multiple drivers and loads</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Index;
