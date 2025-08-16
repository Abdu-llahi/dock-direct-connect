
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

type UserType = 'shipper' | 'driver' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserType;
  status?: string;
  verificationStatus?: string;
  emailVerified?: boolean;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string, userType: UserType, additionalData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string, requiredRole?: UserType) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for stored tokens
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedAccessToken && storedRefreshToken && storedUser) {
        try {
          setAccessToken(storedAccessToken);
          setRefreshTokenValue(storedRefreshToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching user profile
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedAccessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            // Token might be expired, try to refresh
            const refreshed = await refreshTokenSilently();
            if (!refreshed) {
              clearAuthData();
            }
          } else {
            const data = await response.json();
            setUser(data.user);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          clearAuthData();
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
  
  const refreshTokenSilently = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (!storedRefreshToken) return false;
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      setAccessToken(data.accessToken);
      localStorage.setItem('access_token', data.accessToken);
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };


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

      // Store tokens and user data
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshTokenValue(data.refreshToken);
      
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      
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
      
      // Store tokens and user data
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshTokenValue(data.refreshToken);
      
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      
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
      // Call logout endpoint to revoke refresh token
      if (refreshTokenValue) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });
      }
      
      clearAuthData();
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Sign out error:', err);
      clearAuthData(); // Clear data even if logout request fails
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
      // TODO: Implement server-side profile update
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
  
  const refreshToken = async (): Promise<boolean> => {
    return await refreshTokenSilently();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user && !!accessToken,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      refreshToken
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
