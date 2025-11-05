import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AccessDenied = () => {
  const { role } = useAuth();

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'student') return '/user/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center animate-fade-in">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl">Access Denied</CardTitle>
          <CardDescription className="text-lg">Insufficient Permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page. This area is restricted to authorized users only.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            If you believe you should have access, please contact an administrator.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" asChild>
            <Link to={getDashboardLink()}>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
