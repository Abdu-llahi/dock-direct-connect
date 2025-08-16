import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, Shield, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-white">DockDirect</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The enterprise logistics platform connecting shippers and drivers directly. 
              Skip the broker fees, reduce delays, increase profits.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Enterprise-grade security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Platform</h3>
            <div className="space-y-2">
              <Link to="/auth/shipper" className="block hover:text-blue-400 transition-colors">
                Shipper Portal
              </Link>
              <Link to="/auth/driver" className="block hover:text-blue-400 transition-colors">
                Driver Portal
              </Link>
              <Link to="/admin-login" className="block hover:text-blue-400 transition-colors">
                Admin Access
              </Link>
              <a href="#features" className="block hover:text-blue-400 transition-colors">
                Features
              </a>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal & Support</h3>
            <div className="space-y-2">
              <Link to="/terms-of-service" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>
              <Link to="/privacy-policy" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
              <a href="mailto:support@dockdirect.com" className="block hover:text-blue-400 transition-colors">
                Support Center
              </a>
              <a href="mailto:legal@dockdirect.com" className="block hover:text-blue-400 transition-colors">
                Legal Inquiries
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:hello@dockdirect.com" className="hover:text-blue-400 transition-colors">
                  hello@dockdirect.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <a href="tel:1-800-DOCK-DIRECT" className="hover:text-blue-400 transition-colors">
                  1-800-DOCK-DIRECT
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <span className="text-slate-400">
                  Enterprise Logistics Hub<br />
                  Available Nationwide
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              &copy; 2024 DockDirect. All rights reserved. 
              <span className="ml-2 px-2 py-1 bg-slate-800 rounded text-xs">
                Enterprise Platform
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400">All systems operational</span>
              </div>
              <div className="text-slate-500">
                SOC 2 Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;