
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Logo from '@/components/ui/logo';

const Auth = () => {
  const { role } = useParams();
  const { user, loading, signUp, signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    userType: (role as 'shipper' | 'driver') || 'shipper' as 'shipper' | 'driver',
    company: '',
    license_number: '',
    mc_dot_number: '',
    ein_number: '',
    business_address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Logo showText={false} className="mx-auto mb-4" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name || !formData.userType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const additionalData: any = {
      phone: formData.phone
    };

    if (formData.userType === 'shipper') {
      additionalData.company = formData.company;
      additionalData.ein_number = formData.ein_number;
      additionalData.business_address = formData.business_address;
    } else if (formData.userType === 'driver') {
      additionalData.license_number = formData.license_number;
      additionalData.mc_dot_number = formData.mc_dot_number;
    }

    await signUp(formData.email, formData.password, formData.name, formData.userType, additionalData);
    setIsSubmitting(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsSubmitting(true);
    await signIn(formData.email, formData.password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to DockDirect
            </CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a...</Label>
                    <Select 
                      value={formData.userType} 
                      onValueChange={(value: 'shipper' | 'driver') => 
                        setFormData(prev => ({ ...prev, userType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipper">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-700" />
                            Shipper - I need to move freight
                          </div>
                        </SelectItem>
                        <SelectItem value="driver">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-orange-500" />
                            Driver - I haul freight
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional fields based on user type */}
                  {formData.userType === 'shipper' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your Company Name"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_address">Business Address</Label>
                        <Input
                          id="business_address"
                          type="text"
                          placeholder="123 Business St, City, State"
                          value={formData.business_address}
                          onChange={(e) => setFormData(prev => ({ ...prev, business_address: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ein_number">EIN Number (Optional)</Label>
                        <Input
                          id="ein_number"
                          type="text"
                          placeholder="12-3456789"
                          value={formData.ein_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, ein_number: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  {formData.userType === 'driver' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="license_number">CDL License Number</Label>
                        <Input
                          id="license_number"
                          type="text"
                          placeholder="CDL123456789"
                          value={formData.license_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mc_dot_number">MC/DOT Number (Optional)</Label>
                        <Input
                          id="mc_dot_number"
                          type="text"
                          placeholder="MC123456 / DOT123456"
                          value={formData.mc_dot_number}
                          onChange={(e) => setFormData(prev => ({ ...prev, mc_dot_number: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
