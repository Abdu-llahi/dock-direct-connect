
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Package, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Building, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Smartphone,
  Key,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuthStep = 'login' | 'register' | 'mfa' | 'success' | 'pending-approval';

const Auth = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { signUp, signIn, verifyMFA } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when role changes
  useEffect(() => {
    if (role) {
      setFormData(prev => ({ ...prev }));
      setErrors({});
    }
  }, [role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const result = await signUp(
          formData.email, 
          formData.password, 
          `${formData.firstName} ${formData.lastName}`, 
          (role as 'shipper' | 'driver' | 'admin' | 'warehouse') || 'shipper',
          {
            companyName: formData.company,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        );

        if (result.error) {
          toast.error(result.error);
        } else {
          setPendingEmail(formData.email);
          setCurrentStep('pending-approval');
          toast.success('Registration successful! Your account is pending admin approval.');
        }
      } else {
        const result = await signIn(formData.email, formData.password, role as any);
        
        if (result.error) {
          toast.error(result.error);
        } else if (result.requiresMFA) {
          setCurrentStep('mfa');
          toast.info('Please enter the MFA code sent to your phone');
        } else {
          // Login successful
          const dashboardPath = role === 'shipper' ? '/dashboard/shipper' : 
                               role === 'driver' ? '/dashboard/driver' : 
                               role === 'admin' ? '/dashboard/admin' : '/dashboard/shipper';
          navigate(dashboardPath);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async () => {
    if (mfaCode.some(digit => !digit)) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await verifyMFA(formData.email, mfaCode.join(''));
      
      if (result.error) {
        toast.error(result.error);
      } else {
        // MFA successful, redirect to dashboard
        const dashboardPath = role === 'shipper' ? '/dashboard/shipper' : 
                             role === 'driver' ? '/dashboard/driver' : 
                             role === 'admin' ? '/dashboard/admin' : '/dashboard/shipper';
        navigate(dashboardPath);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'login':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={cn(
                      "pl-10 pr-4 py-3 border-2 transition-all duration-200",
                      errors.email 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    )}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      "pl-10 pr-12 py-3 border-2 transition-all duration-200",
                      errors.password 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-blue-500"
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        );

      case 'register':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={cn(
                    "py-3 border-2 transition-all duration-200",
                    errors.firstName 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={cn(
                    "py-3 border-2 transition-all duration-200",
                    errors.lastName 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "pl-10 pr-4 py-3 border-2 transition-all duration-200",
                    errors.email 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                {role === 'shipper' ? 'Company Name' : 'Fleet/Company Name'}
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={cn(
                    "pl-10 pr-4 py-3 border-2 transition-all duration-200",
                    errors.company 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder={role === 'shipper' ? 'Acme Logistics' : 'Martinez Trucking'}
                />
              </div>
              {errors.company && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.company}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={cn(
                    "pl-10 pr-4 py-3 border-2 transition-all duration-200",
                    errors.phone 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder="(555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="py-3 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
                  placeholder="Chicago"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="py-3 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200"
                  placeholder="IL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "pl-10 pr-12 py-3 border-2 transition-all duration-200",
                    errors.password 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-blue-500"
                  )}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        );

      case 'mfa':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Two-Factor Authentication
              </h3>
              <p className="text-gray-600">
                We've sent a 6-digit code to your phone number. Please enter it below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {mfaCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`mfa-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                ))}
              </div>

              <Button 
                onClick={handleMfaSubmit}
                disabled={isLoading || mfaCode.some(digit => !digit)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Verify Code
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          </div>
        );

      case 'pending-approval':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Account Pending Approval
              </h3>
              <p className="text-gray-600">
                Thank you for registering! Your account is currently pending admin approval. 
                You'll receive an email notification once your account is approved.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Email:</strong> {pendingEmail}
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Home
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'shipper':
        return <Package className="h-8 w-8 text-blue-600" />;
      case 'driver':
        return <Truck className="h-8 w-8 text-orange-600" />;
      case 'admin':
        return <Shield className="h-8 w-8 text-gray-600" />;
      case 'warehouse':
        return <Building className="h-8 w-8 text-green-600" />;
      default:
        return <Package className="h-8 w-8 text-blue-600" />;
    }
  };

  const getRoleName = () => {
    switch (role) {
      case 'shipper':
        return 'Shipper';
      case 'driver':
        return 'Driver';
      case 'admin':
        return 'Admin';
      case 'warehouse':
        return 'Warehouse';
      default:
        return 'User';
    }
  };

  if (currentStep === 'pending-approval') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            {getStepContent()}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getRoleIcon()}
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {currentStep === 'login' && (isSignUp ? 'Create Account' : 'Sign In')}
                {currentStep === 'register' && 'Create Account'}
                {currentStep === 'mfa' && 'Verify Your Account'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getRoleName()} Portal
              </CardDescription>
            </div>
          </div>

          {currentStep !== 'mfa' && currentStep !== 'pending-approval' && (
            <div className="flex space-x-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  !isSignUp 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  isSignUp 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Sign Up
              </button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8 pt-0">
          {getStepContent()}
        </CardContent>

        {currentStep === 'mfa' && (
          <div className="px-8 pb-8">
            <button
              onClick={() => setCurrentStep('login')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth;
