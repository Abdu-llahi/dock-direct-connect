
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  ArrowRight,
  Loader2,
  Smartphone,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  onLogin: () => void;
}

type AuthStep = 'login' | 'register' | 'mfa' | 'success';

const AuthModal = ({ isOpen, onClose, userType, onLogin }: AuthModalProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company: '',
    phone: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('login');
      setIsSignUp(false);
      setFormData({
        email: '',
        password: '',
        company: '',
        phone: '',
        firstName: '',
        lastName: ''
      });
      setErrors({});
      setMfaCode(['', '', '', '', '', '']);
    }
  }, [isOpen]);

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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isSignUp) {
        setCurrentStep('mfa');
      } else {
        setCurrentStep('success');
        setTimeout(() => {
          onLogin();
          onClose();
        }, 1500);
      }
    }, 2000);
  };

  const handleMfaSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('success');
      setTimeout(() => {
        onLogin();
        onClose();
      }, 1500);
    }, 1500);
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
                {userType === 'shipper' ? 'Company Name' : 'Fleet/Company Name'}
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
                  placeholder={userType === 'shipper' ? 'Acme Logistics' : 'Martinez Trucking'}
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

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Dock Direct Connect!
              </h3>
              <p className="text-gray-600">
                Your account has been successfully created and verified.
              </p>
            </div>
            <div className="animate-pulse">
              <div className="text-sm text-gray-500">
                Redirecting to your dashboard...
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-xl",
              userType === 'shipper' ? "bg-blue-100" : "bg-orange-100"
            )}>
              {userType === 'shipper' ? (
                <Package className="h-6 w-6 text-blue-600" />
              ) : (
                <Truck className="h-6 w-6 text-orange-600" />
              )}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {currentStep === 'login' && (isSignUp ? 'Create Account' : 'Sign In')}
                {currentStep === 'register' && 'Create Account'}
                {currentStep === 'mfa' && 'Verify Your Account'}
                {currentStep === 'success' && 'Welcome!'}
              </div>
              <div className="text-sm text-gray-500">
                {userType === 'shipper' ? 'Shipper Portal' : 'Driver Portal'}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {currentStep !== 'success' && currentStep !== 'mfa' && (
          <div className="flex space-x-1 mb-6">
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

        {getStepContent()}

        {currentStep === 'mfa' && (
          <div className="mt-4">
            <button
              onClick={() => setCurrentStep('register')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to registration
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
