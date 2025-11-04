import { Navbar } from "@/components/layout/Navbar";
import { ClassroomCard } from "@/components/classrooms/ClassroomCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useClassrooms } from "@/hooks/useClassrooms";
import { Skeleton } from "@/components/ui/skeleton";

const Classrooms = () => {
  const [filter, setFilter] = useState<"all" | "free" | "occupied">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { classrooms, isLoading } = useClassrooms();

  const filteredClassrooms = useMemo(() => {
    if (!classrooms) return [];
    
    return classrooms.filter((classroom) => {
      const matchesFilter = filter === "all" || classroom.status === filter;
      const matchesSearch = 
        classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classroom.building.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [classrooms, filter, searchQuery]);

  const freeCount = classrooms?.filter((c) => c.status === "free").length || 0;
  const occupiedCount = classrooms?.filter((c) => c.status === "occupied").length || 0;
  const totalCount = classrooms?.length || 0;

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
            <div className="text-2xl font-bold text-foreground">{totalCount}</div>
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
              {totalCount > 0 ? Math.round((freeCount / totalCount) * 100) : 0}%
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map((classroom, index) => (
                <div key={classroom.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ClassroomCard
                    id={classroom.id}
                    name={classroom.name}
                    building={classroom.building}
                    floor={classroom.floor}
                    capacity={classroom.capacity}
                    status={classroom.status}
                    occupiedByName={classroom.occupied_by_name}
                    occupiedUntil={classroom.occupied_until}
                    notes={classroom.notes}
                  />
                </div>
              ))}
            </div>

            {filteredClassrooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No classrooms found matching your filters</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Classrooms;
