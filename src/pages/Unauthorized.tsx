import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
          <CardTitle className="text-3xl">403 - Unauthorized</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <Button asChild><Link to="/">Go Home</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;