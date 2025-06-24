
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'shipper' | 'driver' | 'admin';

interface AuthUser extends User {
  role?: UserRole;
  name?: string;
  verification_status?: string;
  status?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ error?: any }>;
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
          // Fetch user profile data
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from('users')
                .select('role, name, verification_status, status')
                .eq('id', session.user.id)
                .single();

              if (userData && !error) {
                setUser({
                  ...session.user,
                  role: userData.role as UserRole,
                  name: userData.name,
                  verification_status: userData.verification_status,
                  status: userData.status
                } as AuthUser);
              } else {
                setUser({
                  ...session.user,
                  role: undefined,
                  name: undefined,
                  verification_status: undefined,
                  status: undefined
                } as AuthUser);
              }
            } catch (err) {
              console.error('Error fetching user data:', err);
              setUser({
                ...session.user,
                role: undefined,
                name: undefined,
                verification_status: undefined,
                status: undefined
              } as AuthUser);
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
        setUser({
          ...session.user,
          role: undefined,
          name: undefined,
          verification_status: undefined,
          status: undefined
        } as AuthUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name,
              role,
              status: 'pending',
              verification_status: 'pending'
            }
          ]);

        if (userError) {
          console.error('Error creating user record:', userError);
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

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
