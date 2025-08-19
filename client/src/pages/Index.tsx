
import { useState, lazy, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Play, 
  Package, 
  TrendingUp, 
  FileText, 
  Shield, 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Globe,
  Award,
  MessageCircle,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/ui/logo";
import Footer from "@/components/Footer";
import AnimatedCard from "@/components/ui/animated-card";

import ShipperDashboard from "@/pages/ShipperDashboard";
import DriverDashboard from "@/pages/DriverDashboard";

const AdminDashboard = lazy(() => import("@/components/AdminDashboard"));

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleRoleSelect = (role: "shipper" | "driver") => {
    navigate(`/auth/${role}`);
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dock Direct Connect</h2>
          <p className="text-gray-600">Revolutionizing logistics...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solutions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Solutions</a>
              <a href="#resources" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Resources</a>
              <a href="#company" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Company</a>
              <a href="#support" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Support</a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 font-medium">
                    Welcome, {user.name || user.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRoleSelect("shipper")} 
                    className="hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200"
                  >
                    Shipper Login
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRoleSelect("driver")} 
                    className="hover:bg-orange-50 hover:text-orange-700 font-medium transition-all duration-200"
                  >
                    Driver Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/demo')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="px-4 space-y-3">
              <a href="#solutions" className="block py-2 text-gray-700 hover:text-blue-600">Solutions</a>
              <a href="#resources" className="block py-2 text-gray-700 hover:text-blue-600">Resources</a>
              <a href="#company" className="block py-2 text-gray-700 hover:text-blue-600">Company</a>
              <a href="#support" className="block py-2 text-gray-700 hover:text-blue-600">Support</a>
              <div className="pt-4 space-y-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleRoleSelect("shipper")} 
                  className="w-full justify-start"
                >
                  Shipper Login
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleRoleSelect("driver")} 
                  className="w-full justify-start"
                >
                  Driver Login
                </Button>
                <Button 
                  onClick={() => navigate('/demo')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="scroll-animate opacity-0 transform translate-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                Haul with us.
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed">
                Harness the industry-leading combination of <span className="text-blue-600 font-semibold">technology</span>, 
                <span className="text-orange-600 font-semibold"> partnership</span>, and <span className="text-green-600 font-semibold">capacity</span> 
                to drive big results.
              </p>
            </div>
            
            <div className="scroll-animate opacity-0 transform translate-y-8" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/demo')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Open Live Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Talk to Us
                </Button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="scroll-animate opacity-0 transform translate-y-8" style={{ animationDelay: '0.4s' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">2,847</div>
                  <div className="text-gray-600 font-medium">Active Drivers</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98.2%</div>
                  <div className="text-gray-600 font-medium">On-Time Rate</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">23min</div>
                  <div className="text-gray-600 font-medium">Avg Pickup</div>
                </div>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">$2.4M</div>
                  <div className="text-gray-600 font-medium">Monthly Volume</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="scroll-animate opacity-0 transform translate-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Solutions for Every Player
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're a shipper looking for capacity or a driver seeking loads, 
                we have the tools to revolutionize your logistics.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Shipper Solution */}
            <div className="scroll-animate opacity-0 transform translate-x-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 p-3 rounded-2xl mr-4">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Shippers</h3>
                    <p className="text-blue-600 font-medium">Instant Capacity Access</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">AI-powered load optimization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Real-time driver matching</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Automated contract generation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Live tracking & analytics</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleRoleSelect("shipper")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                  Get Started as Shipper
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Driver Solution */}
            <div className="scroll-animate opacity-0 transform -translate-x-8">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-600 p-3 rounded-2xl mr-4">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Drivers</h3>
                    <p className="text-orange-600 font-medium">More Loads, Better Rates</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Access to premium loads</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Competitive bidding system</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Instant payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Route optimization tools</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleRoleSelect("driver")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
                >
                  Get Started as Driver
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="scroll-animate opacity-0 transform translate-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Revolutionary Technology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From shipment posting to final delivery, we handle the entire process with 
                AI-powered efficiency and enterprise-grade security.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCard className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" delay={100}>
              <div className="bg-blue-100 p-4 rounded-2xl mb-6 w-fit">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Shipment Posting</h3>
              <p className="text-gray-600 mb-6">AI-optimized load descriptions with automatic pricing suggestions and real-time market analysis.</p>
              <div className="flex items-center text-blue-600 font-semibold">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" delay={200}>
              <div className="bg-green-100 p-4 rounded-2xl mb-6 w-fit">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Live Bidding System</h3>
              <p className="text-gray-600 mb-6">Real-time driver bidding with instant notifications and automated acceptance workflows.</p>
              <div className="flex items-center text-green-600 font-semibold">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" delay={300}>
              <div className="bg-purple-100 p-4 rounded-2xl mb-6 w-fit">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Contracts</h3>
              <p className="text-gray-600 mb-6">Automated contract generation with legal compliance and instant digital signatures.</p>
              <div className="flex items-center text-purple-600 font-semibold">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </AnimatedCard>

            <AnimatedCard className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105" delay={400}>
              <div className="bg-orange-100 p-4 rounded-2xl mb-6 w-fit">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Compliance Automation</h3>
              <p className="text-gray-600 mb-6">Built-in regulatory compliance, insurance verification, and safety monitoring.</p>
              <div className="flex items-center text-orange-600 font-semibold">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="scroll-animate opacity-0 transform translate-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See what shippers and drivers are saying about Dock Direct Connect.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="scroll-animate opacity-0 transform translate-y-8" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Dock Direct Connect revolutionized our logistics. We've reduced our shipping costs by 23% and improved delivery times significantly."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">John Davis</div>
                    <div className="text-gray-600">Logistics Manager, TechCorp</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate opacity-0 transform translate-y-8" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "As an owner-operator, this platform has been a game-changer. I'm getting better rates and more consistent loads than ever before."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">SM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Martinez</div>
                    <div className="text-gray-600">Owner-Operator</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-animate opacity-0 transform translate-y-8" style={{ animationDelay: '0.6s' }}>
              <div className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The real-time tracking and automated contracts save us hours every week. This is exactly what the industry needed."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">MW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mike Wilson</div>
                    <div className="text-gray-600">Fleet Manager, TransCorp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="scroll-animate opacity-0 transform translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join thousands of shippers and drivers who are already using Dock Direct Connect 
              to streamline their operations and increase their profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/demo')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-3 h-6 w-6" />
                Try Demo Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default Index;
