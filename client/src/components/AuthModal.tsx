
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Package } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'shipper' | 'driver';
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onClose, userType, onLogin }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Auth attempt:', { userType, isSignUp, formData });
    onLogin();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {userType === 'shipper' ? (
              <Package className="h-5 w-5 text-dock-blue" />
            ) : (
              <Truck className="h-5 w-5 text-dock-orange" />
            )}
            <span>
              {isSignUp ? 'Sign Up' : 'Sign In'} as {userType === 'shipper' ? 'Shipper' : 'Driver'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">
                  {userType === 'shipper' ? 'Company Name' : 'Fleet/Company Name'}
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className={`w-full ${
              userType === 'shipper' 
                ? 'bg-dock-blue hover:bg-blue-800' 
                : 'bg-dock-orange hover:bg-orange-600'
            }`}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
