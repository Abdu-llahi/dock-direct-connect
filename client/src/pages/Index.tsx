
import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/ui/logo";
import Footer from "@/components/Footer";

import ShipperDashboard from "@/components/ShipperDashboard";
import DriverDashboard from "@/components/DriverDashboard";

const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleRoleSelect = (role: "shipper" | "driver") => {
    navigate(`/auth/${role}`);
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading DockDirect...</p>
        </div>
      </div>
    );
  }

  // Show appropriate dashboard if logged in and has role
  if (user) {
    const userRole = user.role;
    
    if (userRole === "shipper") {
      return <ShipperDashboard onLogout={handleLogout} />;
    }
    if (userRole === "driver") {
      return <DriverDashboard onLogout={handleLogout} />;
    }
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
  }

  // Show landing page for non-authenticated users or users without roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRoleSelect("shipper")} 
                    className="hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                  >
                    Shipper Login
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRoleSelect("driver")} 
                    className="hover:bg-orange-50 hover:text-orange-700 font-medium transition-colors"
                  >
                    Driver Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Dock Direct Connect
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              AI-assisted dispatch, instant driver matching. Book, track, and close loads in minutes. 
              Smart contracts, live bids, and compliance—handled.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Open Live Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg"
              >
                Talk to Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Counters */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2,847</div>
              <div className="text-gray-600">Active Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98.2%</div>
              <div className="text-gray-600">On-Time Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">23min</div>
              <div className="text-gray-600">Avg Pickup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to scale your logistics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From shipment posting to final delivery, we handle the entire process with AI-powered efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 mb-4">
                <Package className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Shipment Posting</h3>
              <p className="text-gray-600">AI-optimized load descriptions with automatic pricing suggestions and market analysis.</p>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow" delay={100}>
              <div className="text-green-600 mb-4">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Bidding System</h3>
              <p className="text-gray-600">Real-time driver bidding with instant notifications and automated acceptance workflows.</p>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow" delay={200}>
              <div className="text-purple-600 mb-4">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Contract Previews</h3>
              <p className="text-gray-600">Automated contract generation with legal compliance and instant digital signatures.</p>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow" delay={300}>
              <div className="text-orange-600 mb-4">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compliance Automation</h3>
              <p className="text-gray-600">Built-in regulatory compliance, insurance verification, and safety monitoring.</p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your logistics?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of shippers and drivers who are already using Dock Direct Connect to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/demo')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Demo Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default Index;
