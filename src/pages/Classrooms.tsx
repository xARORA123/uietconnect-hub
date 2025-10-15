import { Navbar } from "@/components/layout/Navbar";
import { ClassroomCard } from "@/components/classrooms/ClassroomCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const Classrooms = () => {
  const [filter, setFilter] = useState<"all" | "free" | "occupied">("all");

  const classrooms = [
    {
      name: "CSE-101",
      building: "Academic Block A",
      floor: 1,
      capacity: 60,
      status: "free" as const,
      lastUpdated: "10 mins ago",
      updatedBy: "John Doe",
    },
    {
      name: "CSE-201",
      building: "Academic Block A",
      floor: 2,
      capacity: 80,
      status: "occupied" as const,
      lastUpdated: "1 hour ago",
      updatedBy: "Jane Smith",
    },
    {
      name: "ME-101",
      building: "Academic Block B",
      floor: 1,
      capacity: 50,
      status: "free" as const,
      lastUpdated: "5 mins ago",
      updatedBy: "Mike Johnson",
    },
    {
      name: "EE-201",
      building: "Academic Block B",
      floor: 2,
      capacity: 70,
      status: "occupied" as const,
      lastUpdated: "30 mins ago",
      updatedBy: "Sarah Wilson",
    },
    {
      name: "CSE-301",
      building: "Academic Block A",
      floor: 3,
      capacity: 90,
      status: "free" as const,
      lastUpdated: "2 hours ago",
      updatedBy: "Alex Brown",
    },
    {
      name: "LAB-101",
      building: "Lab Complex",
      floor: 1,
      capacity: 40,
      status: "occupied" as const,
      lastUpdated: "15 mins ago",
      updatedBy: "Emily Davis",
    },
  ];

  const filteredClassrooms = classrooms.filter((classroom) => {
    if (filter === "all") return true;
    return classroom.status === filter;
  });

  const freeCount = classrooms.filter((c) => c.status === "free").length;
  const occupiedCount = classrooms.filter((c) => c.status === "occupied").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Classroom Status</h1>
          <p className="text-muted-foreground">Real-time classroom occupancy tracker</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-foreground">{classrooms.length}</div>
            <div className="text-sm text-muted-foreground">Total Rooms</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-accent">{freeCount}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-destructive">{occupiedCount}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">
              {Math.round((freeCount / classrooms.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by room name or building..."
              className="pl-10 rounded-xl border-border/50"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-xl"
            >
              All Rooms
            </Button>
            <Button
              variant={filter === "free" ? "default" : "outline"}
              onClick={() => setFilter("free")}
              className="rounded-xl"
            >
              Available
            </Button>
            <Button
              variant={filter === "occupied" ? "default" : "outline"}
              onClick={() => setFilter("occupied")}
              className="rounded-xl"
            >
              Occupied
            </Button>
          </div>
        </div>

        {/* Classroom Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom, index) => (
            <div key={classroom.name} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ClassroomCard {...classroom} />
            </div>
          ))}
        </div>

        {filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No classrooms found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Classrooms;
