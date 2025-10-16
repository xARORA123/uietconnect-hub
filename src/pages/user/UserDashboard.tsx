import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleBadge } from '@/components/auth/RoleBadge';
import { BookOpen, MessageSquare, Briefcase, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UserDashboard = () => {
  const { profile, role } = useAuth();

  const quickActions = [
    { icon: BookOpen, label: 'Browse Classrooms', href: '/classrooms', color: 'text-blue-500' },
    { icon: Search, label: 'Lost & Found', href: '/lostfound', color: 'text-green-500' },
    { icon: Briefcase, label: 'Explore Projects', href: '/projects', color: 'text-purple-500' },
    { icon: MessageSquare, label: 'Announcements', href: '#', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Welcome back, {profile?.full_name}!</CardTitle>
                  <p className="text-muted-foreground mt-1">{profile?.email}</p>
                  {profile?.student_id && (
                    <p className="text-sm text-muted-foreground">Student ID: {profile.student_id}</p>
                  )}
                </div>
                <RoleBadge role={role} />
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link to={action.href} key={index}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <action.icon className={`h-8 w-8 ${action.color}`} />
                  <span className="font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You haven't applied to any projects yet</p>
              <Button asChild>
                <Link to="/projects">Browse Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;