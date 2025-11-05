import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'teacher' | 'student' | null;

interface Profile {
  id: string;
  full_name: string;
  email: string;
  student_id: string | null;
  department: string | null;
  year: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfileAndRole = async (userId: string) => {
    try {
      // Fetch both profile and role in parallel
      const [profileResult, roleResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle()
      ]);

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileResult.error);
      } else {
        setProfile(profileResult.data);
      }

      if (roleResult.error && roleResult.error.code !== 'PGRST116') {
        console.error('Error fetching role:', roleResult.error);
        setRole(null);
      } else {
        // If no role exists, default to 'student' for backwards compatibility
        const userRole = roleResult.data?.role || 'student';
        setRole(userRole);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setProfile(null);
      setRole('student'); // Default fallback
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfileAndRole(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check for existing session first
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfileAndRole(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setLoading(true);
          fetchProfileAndRole(currentSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, role, loading, signOut, refreshProfile }}>
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