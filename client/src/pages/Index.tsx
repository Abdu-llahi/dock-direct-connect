
import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/ui/logo";
import HeroSection from "@/components/homepage/HeroSection";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import StatsSection from "@/components/homepage/StatsSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import NextGenSection from "@/components/homepage/NextGenSection";

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

  console.log('Index render - Loading:', loading, 'User:', user?.id, 'Role:', user?.role || user?.user_type);

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
    const userRole = user.role || user.user_type;
    console.log('User detected with role:', userRole);
    
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
                    {!user.role && !user.user_type && (
                      <span className="text-red-600 ml-2 font-medium">
                        (Account setup incomplete - please contact support)
                      </span>
                    )}
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
      <HeroSection onRoleSelect={handleRoleSelect} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Next Gen Features Section */}
      <NextGenSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="text-white mb-4 md:mb-0" />
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 DockDirect. Built for the future of freight.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Connecting shippers and drivers directly.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
