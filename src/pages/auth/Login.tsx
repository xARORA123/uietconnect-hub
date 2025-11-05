import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student'>('student');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user && role) {
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'student') navigate('/user/dashboard', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        throw new Error('Could not verify user role');
      }

      // Check if role matches expected role
      if (selectedRole === 'admin' && roleData.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied: Admin credentials required');
      }

      if (selectedRole === 'student' && roleData.role === 'admin') {
        await supabase.auth.signOut();
        throw new Error('Please use the Admin login tab');
      }

      toast({ 
        title: "Login successful!", 
        description: `Welcome back${data.user.email ? `, ${data.user.email}` : ''}` 
      });
      
      // Wait a bit for AuthContext to update, then redirect based on role
      setTimeout(() => {
        if (roleData.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (roleData.role === 'teacher') {
          navigate('/', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      }, 100);
    } catch (error: any) {
      toast({ 
        title: "Login failed", 
        description: error.message || "Invalid credentials. Please check your email and password.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to UIET Connect</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as 'admin' | 'student')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="gap-2">
                <User className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder={selectedRole === 'admin' ? 'admin@uiet.edu' : 'student@uiet.edu'}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading}
                  autoComplete="current-password"
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  `Login as ${selectedRole === 'admin' ? 'Admin' : 'Student'}`
                )}
              </Button>
            </form>

            <TabsContent value="student" className="mt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Don't have an account?</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/signup/user">Create Student Account</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Need admin access?</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/signup/admin">Register as Admin</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
