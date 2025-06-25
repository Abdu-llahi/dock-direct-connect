
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls to avoid deadlock
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('role, name, verification_status, phone, email')
                .eq('id', session.user.id)
                .single();

              if (userData && !error) {
                setUser({
                  ...session.user,
                  user_type: userData.role as UserType,
                  role: userData.role as UserType,
                  name: userData.name,
                  verification_status: userData.verification_status,
                  phone: userData.phone
                } as AuthUser);
              } else {
                console.log('User data not found in users table, using auth data only');
                setUser(session.user as AuthUser);
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
              setUser(session.user as AuthUser);
            }
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user as AuthUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: UserType, additionalData: any = {}) => {
    try {
      console.log('Starting signup process for:', email, userType);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
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

      if (data.user) {
        console.log('Auth user created, now creating user record');
        
        // Wait a moment for auth to fully establish
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create user record in our users table with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
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
              console.error(`User creation attempt ${retryCount + 1} failed:`, userError);
              
              if (retryCount === maxRetries - 1) {
                toast.error('Failed to create user profile. Please try again.');
                return { error: userError };
              }
              
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }

            console.log('User record created successfully');
            break;
          } catch (err) {
            console.error(`User creation error on attempt ${retryCount + 1}:`, err);
            retryCount++;
            
            if (retryCount === maxRetries) {
              toast.error('Failed to create user profile. Please try again.');
              return { error: err };
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Create additional profile data if provided
        if (additionalData.company_name || additionalData.company || additionalData.license_number) {
          try {
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
              // Don't fail the whole signup for profile errors
            }
          } catch (err) {
            console.error('Profile creation error:', err);
            // Don't fail the whole signup for profile errors
          }
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
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
      // Log the attempt
      await supabase.from('audit_logs').insert([{
        action: 'login_attempt',
        metadata: { email }
      }]);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log failed attempt
        await supabase.from('audit_logs').insert([{
          action: 'login_failed',
          metadata: { email, error: error.message }
        }]);
        
        toast.error(error.message);
        return { error };
      }

      // Log successful attempt
      await supabase.from('audit_logs').insert([{
        action: 'login_success',
        metadata: { email }
      }]);

      toast.success('Welcome back!');
      return { error: null };
    } catch (err) {
      const error = err as Error;
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

      // Update local user state
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
