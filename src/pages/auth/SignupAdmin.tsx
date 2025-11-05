import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const SignupAdmin = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    adminAccessCode: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const ADMIN_CODE = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'UIET2024ADMIN';

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.adminAccessCode !== ADMIN_CODE) {
      toast({ 
        title: "Invalid Access Code", 
        description: "The admin access code is incorrect. Contact an administrator for access.",
        variant: "destructive" 
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ 
        title: "Password mismatch", 
        description: "Passwords do not match",
        variant: "destructive" 
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({ 
        title: "Weak password", 
        description: "Password must be at least 6 characters",
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          data: { 
            full_name: formData.fullName,
            is_admin: 'true' // Trigger will use this to assign 'admin' role
          }
        }
      });

      if (error) throw error;

      toast({ 
        title: "Admin account created!", 
        description: "Welcome to UIET Connect Admin Panel. Redirecting...",
        duration: 3000
      });
      
      // Small delay for better UX
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Friendly error messages
      if (errorMessage.includes('already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (errorMessage.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast({ 
        title: "Signup failed", 
        description: errorMessage,
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
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Admin Account</CardTitle>
          <CardDescription>
            Requires admin access code for authorization
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Admin access is restricted. You need a valid access code to proceed.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                placeholder="Admin Name"
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                required 
                disabled={loading}
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="admin@uiet.edu"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
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
                placeholder="Create a strong password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                type="password" 
                placeholder="Re-enter your password"
                value={formData.confirmPassword} 
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                required 
                disabled={loading}
                minLength={6}
                autoComplete="new-password"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  Passwords do not match
                </p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminAccessCode">Admin Access Code</Label>
              <Input 
                id="adminAccessCode"
                type="password" 
                value={formData.adminAccessCode} 
                onChange={(e) => setFormData({...formData, adminAccessCode: e.target.value})} 
                placeholder="Enter secret admin code"
                required 
                disabled={loading}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Contact system administrator for access code
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating admin account...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Create Admin Account
                </>
              )}
            </Button>
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default SignupAdmin;
