
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { useAuth } from '@/hooks/useAuth';

// Admin authentication now uses proper Supabase auth
// Admins must be created through the signup process with role 'admin'

const AdminLogin = () => {
  const { user, loading, signIn } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated as admin
  if (user && (user.role === 'admin' || user.user_type === 'admin')) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (credentials.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(credentials.email, credentials.password);
      
      if (error) {
        toast.error('Invalid admin credentials');
      } else {
        // Check if the logged-in user is actually an admin
        // The useAuth hook will handle the redirect in the component above
        toast.success('Admin access granted');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-orange-50">
      {/* Header matching main site */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border border-red-200 bg-white">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Admin Access Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Secure area - authorized personnel only
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Security Notice</p>
                <p className="text-sm text-amber-700 mt-1">
                  This is a secure admin portal. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Protected by enterprise-grade security
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
