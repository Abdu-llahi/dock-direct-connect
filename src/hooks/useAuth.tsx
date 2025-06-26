
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserType = 'shipper' | 'driver' | 'admin';

interface AuthUser extends User {
  user_type?: UserType;
  role?: UserType;
  name?: string;
  verification_status?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType: UserType, additionalData?: any) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!isMounted) return;

        setSession(session);
        
        if (session?.user) {
          // Fetch user data with timeout to avoid blocking
          setTimeout(async () => {
            if (isMounted) {
              await fetchUserData(session.user);
            }
          }, 0);
        } else {
          setUser(null);
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setSession(session);
          if (session?.user) {
            await fetchUserData(session.user);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      console.log('Fetching user data for:', authUser.id);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, name, verification_status, phone, email')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user data:', error);
        // Set user with auth data only
        setUser(authUser as AuthUser);
      } else if (userData) {
        console.log('User data found:', userData);
        setUser({
          ...authUser,
          user_type: userData.role as UserType,
          role: userData.role as UserType,
          name: userData.name,
          verification_status: userData.verification_status,
          phone: userData.phone
        } as AuthUser);
      } else {
        console.log('No user data found in database, using auth data only');
        setUser(authUser as AuthUser);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setUser(authUser as AuthUser);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, userType: UserType, additionalData: any = {}) => {
    try {
      console.log('Starting signup process for:', email, userType);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType,
            ...additionalData
          }
        }
      });

      if (error) {
        console.error('Supabase auth signup error:', error);
        toast.error(error.message);
        return { error };
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account before signing in.');
        return { error: null };
      }

      if (data.user && data.session) {
        console.log('User signed up and logged in, creating profile');
        
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: name,
              role: userType,
              phone: additionalData.phone || null,
              verification_status: 'pending'
            }
          ]);

        if (userError) {
          console.error('User creation error:', userError);
          toast.warning('Account created but profile setup incomplete. Please try signing in.');
        } else {
          if (additionalData.company_name || additionalData.company || additionalData.license_number) {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert([
                {
                  user_id: data.user.id,
                  company_name: additionalData.company_name || additionalData.company || null,
                  license_number: additionalData.license_number || null,
                  mc_dot_number: additionalData.mc_dot_number || null,
                  business_address: additionalData.business_address || null
                }
              ]);

            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }
          }
          toast.success('Account created successfully!');
        }
      }

      return { error: null };
    } catch (err) {
      console.error('Signup error:', err);
      const error = err as Error;
      toast.error(`Registration failed: ${error.message}`);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast.success('Welcome back!');
      }

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
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error(error.message);
        return { error };
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
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
      session,
      loading,
      signUp,
      signIn,
      signOut,
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
