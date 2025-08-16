
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

type UserType = 'shipper' | 'driver' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserType;
  verificationStatus?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: UserType, additionalData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string, requiredRole?: UserType) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);


  const signUp = async (email: string, password: string, name: string, userType: UserType, additionalData: any = {}) => {
    try {
      console.log('Starting signup process for:', email, userType);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: userType,
          phone: additionalData.phone,
          additionalData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Registration failed');
        return { error: new Error(data.error) };
      }

      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      toast.success('Account created successfully!');
      return { error: null };
    } catch (err) {
      console.error('Signup error:', err);
      const error = err as Error;
      toast.error(`Registration failed: ${error.message}`);
      return { error };
    }
  };

  const signIn = async (email: string, password: string, requiredRole?: UserType) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Sign in failed');
        return { error: new Error(data.error) };
      }

      // Check role if required
      if (requiredRole && data.user.role !== requiredRole) {
        const roleNames = { shipper: 'Shipper', driver: 'Driver', admin: 'Admin' };
        toast.error(`This page is only for ${roleNames[requiredRole]} accounts. Please use the correct login page or go to the home page to select the right portal.`);
        return { error: new Error('Invalid role') };
      }
      
      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      const roleNames = { shipper: 'Shipper', driver: 'Driver', admin: 'Admin' };
      toast.success(`Welcome back, ${requiredRole ? roleNames[requiredRole] : 'User'}!`);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      console.error('Sign in error:', err);
      toast.error(error.message);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('auth_user');
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement password reset functionality
      toast.success('Password reset functionality will be available soon.');
      return { error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      // TODO: Implement profile update functionality
      setUser(prev => prev ? { ...prev, ...updates } : null);
      if (user) {
        localStorage.setItem('auth_user', JSON.stringify({ ...user, ...updates }));
      }
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
