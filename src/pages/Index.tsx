import { Navbar } from "@/components/layout/Navbar";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { EventCard } from "@/components/dashboard/EventCard";

const Index = () => {
  // Mock data
  const announcements = [
    {
      title: "Mid-Semester Exams Schedule Released",
      description: "The mid-semester examination schedule for all departments has been released. Students are advised to check their respective department notice boards and prepare accordingly. The exams will begin from March 15th and continue till March 25th. All students must carry their university ID cards during examinations.",
      source: "Academic Office",
      sourceType: "admin" as const,
      timestamp: "2h ago",
    },
    {
      title: "Tech Fest 2024 - Register Now!",
      description: "The annual Tech Fest is back with exciting competitions, workshops, and guest lectures from industry experts. Registration is now open for all events including hackathon, coding competitions, robotics, and more. Early bird registrations get special discount!",
      source: "Tech Club",
      sourceType: "club" as const,
      timestamp: "5h ago",
    },
    {
      title: "Guest Lecture on AI & Machine Learning",
      description: "Department of Computer Science is organizing a guest lecture on 'Future of AI and Machine Learning in Industry' by Dr. Sharma from Tech Giants. All students interested in AI/ML are welcome to attend. Date: March 12th, Time: 2 PM, Venue: Auditorium.",
      source: "CSE Department",
      sourceType: "faculty" as const,
      timestamp: "1d ago",
    },
  ];

  const upcomingEvents = [
    {
      title: "Annual Sports Meet",
      date: "March 18-20, 2024",
      time: "9:00 AM onwards",
      location: "University Sports Complex",
      host: "Sports Committee",
      attendees: 450,
    },
    {
      title: "Cultural Night",
      date: "March 25, 2024",
      time: "6:00 PM",
      location: "Main Auditorium",
      host: "Cultural Club",
      attendees: 680,
    },
    {
      title: "Industry Connect Workshop",
      date: "March 28, 2024",
      time: "10:00 AM",
      location: "Conference Hall",
      host: "Placement Cell",
      attendees: 220,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="glass-card rounded-2xl p-8 gradient-primary text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to UIET Connect</h1>
          <p className="text-white/90 text-lg">Your centralized platform for campus life</p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Announcements & Events Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Announcements - takes 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Latest Announcements</h2>
              <a href="#" className="text-primary hover:text-primary-hover text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AnnouncementCard {...announcement} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events - takes 1 column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Upcoming Events</h2>
              <a href="#" className="text-primary hover:text-primary-hover text-sm font-medium">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
