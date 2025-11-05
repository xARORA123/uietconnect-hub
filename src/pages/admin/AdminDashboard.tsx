import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FolderKanban, DoorOpen, Settings, Calendar, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AnnouncementCard } from '@/components/dashboard/AnnouncementCard';
import { EventCard } from '@/components/dashboard/EventCard';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  // Fetch real stats
  const { data: projectsCount = 0 } = useQuery({
    queryKey: ['projects-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('projects' as any)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: classroomsCount = 0 } = useQuery({
    queryKey: ['classrooms-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('classrooms' as any)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: announcementsCount = 0 } = useQuery({
    queryKey: ['announcements-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('announcements' as any)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: eventsCount = 0 } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('events' as any)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch recent announcements
  const { data: announcements = [] } = useQuery({
    queryKey: ['recent-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch recent events
  const { data: events = [] } = useQuery({
    queryKey: ['recent-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);
      if (error) throw error;
      return data || [];
    },
  });

  const stats = [
    { label: 'Active Projects', value: projectsCount.toString(), icon: FolderKanban, color: 'text-primary' },
    { label: 'Classrooms', value: classroomsCount.toString(), icon: DoorOpen, color: 'text-accent' },
    { label: 'Announcements', value: announcementsCount.toString(), icon: Megaphone, color: 'text-info' },
    { label: 'Events', value: eventsCount.toString(), icon: Calendar, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage and oversee UIET Connect</p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-slide-up border-border/50" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/classrooms">
                <DoorOpen className="h-6 w-6" />
                <span>Manage Classrooms</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/projects">
                <FolderKanban className="h-6 w-6" />
                <span>View Projects</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <Link to="/teacher/applications">
                <Users className="h-6 w-6" />
                <span>Project Applications</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Announcements and Events */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Latest updates from the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No announcements yet</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement: any) => (
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
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Recently created events</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events yet</p>
              ) : (
                <div className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
