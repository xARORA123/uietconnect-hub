import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';

const SignupAdmin = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', adminAccessCode: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify admin access code
      const validCode = import.meta.env.VITE_ADMIN_ACCESS_CODE;
      if (formData.adminAccessCode !== validCode) {
        throw new Error('Invalid admin access code. Unauthorized to register as Admin.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: formData.fullName }
        }
      });

      if (error) throw error;

      // Assign admin role
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: 'admin' });
        
        if (roleError) {
          console.error('Error assigning admin role:', roleError);
          throw new Error('Failed to assign admin role');
        }
      }

      toast({ 
        title: "Admin account created!", 
        description: "Welcome to UIET Connect Admin Panel" 
      });
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({ 
        title: "Signup failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-center">Admin Signup</CardTitle>
          <p className="text-sm text-muted-foreground text-center">Access code required</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Admin Access Code</Label>
              <Input 
                type="password" 
                value={formData.adminAccessCode} 
                onChange={(e) => setFormData({...formData, adminAccessCode: e.target.value})} 
                placeholder="Enter admin access code"
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
            </p>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default SignupAdmin;