
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserType = 'shipper' | 'driver' | 'admin' | 'warehouse';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserType;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  verificationStatus?: string;
  emailVerified?: boolean;
  phone?: string;
  companyName?: string;
  profile?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    rating: number;
    totalLoads: number;
    totalRevenue: number;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string, userType: UserType, additionalData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string, requiredRole?: UserType) => Promise<{ error?: any; requiresMFA?: boolean; userId?: string }>;
  verifyMFA: (email: string, code: string) => Promise<{ error?: any }>;
  forgotPassword: (email: string) => Promise<{ error?: any }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Verify token and get user data
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshTokenSilently = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { accessToken, refreshToken: newRefreshToken } = await response.json();
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: UserType, additionalData: any = {}) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role: userType,
          ...additionalData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Registration failed' };
      }

      // Registration successful but requires admin approval
      return { error: undefined };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signIn = async (email: string, password: string, requiredRole?: UserType) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresApproval) {
          return { error: 'Account pending approval. Please wait for admin approval.' };
        }
        return { error: data.error || 'Login failed' };
      }

      if (data.requiresMFA) {
        return { error: undefined, requiresMFA: true, userId: data.userId };
      }

      // Store tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      if (data.tokens.refreshToken) {
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
      }

      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);

      return { error: undefined };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const verifyMFA = async (email: string, code: string) => {
    try {
      const response = await fetch('/api/auth/mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'MFA verification failed' };
      }

      // Store tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      if (data.tokens.refreshToken) {
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
      }

      // Set user data
      setUser(data.user);
      setIsAuthenticated(true);

      return { error: undefined };
    } catch (error) {
      console.error('MFA verification error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Password reset request failed' };
      }

      return { error: undefined };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Password reset failed' };
      }

      return { error: undefined };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Call logout endpoint if available
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return { error: 'No authentication token' };
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Profile update failed' };
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...data.user } : null);

      return { error: undefined };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error: 'Network error occurred' };
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    return refreshTokenSilently();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    verifyMFA,
    forgotPassword,
    resetPassword,
    signOut,
    updateProfile,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
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
