import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleBadge } from '@/components/auth/RoleBadge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AnnouncementCard } from '@/components/dashboard/AnnouncementCard';
import { EventCard } from '@/components/dashboard/EventCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

const UserDashboard = () => {
  const { profile, role } = useAuth();

  // Fetch announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's applications
  const { data: applications = [] } = useQuery({
    queryKey: ['user-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_applications' as any)
        .select(`
          *,
          projects:project_id (title, domain)
        `)
        .eq('student_id', profile?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.id,
  });

  // Set up realtime subscriptions
  useEffect(() => {
    const announcementsChannel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          // Refetch announcements
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          // Refetch events
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <Card className="border-border/50">
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

        <QuickActions />

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-4">You haven't applied to any projects yet</p>
                  <Button asChild>
                    <Link to="/projects">Browse Projects</Link>
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="p-4 border border-border/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{app.projects?.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'accepted' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <Button variant="ghost" asChild className="w-full">
                      <Link to="/projects">View All Applications</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Latest Announcements</h3>
              </div>
              {announcements.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">No announcements yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement: any) => (
                    <AnnouncementCard
                      key={announcement.id}
                      title={announcement.title}
                      description={announcement.description}
                      source={announcement.source}
                      timestamp={formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                      sourceType={announcement.source_type}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Upcoming Events</h3>
          </div>
          {events.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">No upcoming events</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  host={event.host}
                  attendees={event.attendees}
                  image={event.image_url}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;