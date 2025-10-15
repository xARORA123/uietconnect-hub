import { Navbar } from "@/components/layout/Navbar";
import { LostItemCard } from "@/components/lostfound/LostItemCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const LostFound = () => {
  const lostItems = [
    {
      title: "Black Backpack",
      description: "Lost near library, contains textbooks and a blue water bottle",
      category: "Bags",
      location: "Central Library",
      date: "March 10, 2024",
      tags: ["urgent", "reward"],
    },
    {
      title: "iPhone 13 Pro",
      description: "Lost in CSE department, black color with a clear case",
      category: "Electronics",
      location: "CSE Building",
      date: "March 9, 2024",
      tags: ["urgent"],
    },
    {
      title: "Student ID Card",
      description: "ID card with name 'Sarah Wilson', Student ID: CSE2021045",
      category: "Documents",
      location: "Cafeteria",
      date: "March 8, 2024",
      tags: [],
    },
  ];

  const foundItems = [
    {
      title: "Grey Hoodie",
      description: "Found in sports complex, size M, has a small Nike logo",
      category: "Clothing",
      location: "Sports Complex",
      date: "March 11, 2024",
      tags: [],
    },
    {
      title: "Water Bottle",
      description: "Steel water bottle with university sticker, found near gate 2",
      category: "Accessories",
      location: "Main Gate",
      date: "March 10, 2024",
      tags: [],
    },
    {
      title: "Wired Earphones",
      description: "White colored earphones, found in lecture hall 201",
      category: "Electronics",
      location: "Academic Block A",
      date: "March 9, 2024",
      tags: [],
      matchScore: 85,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lost & Found</h1>
            <p className="text-muted-foreground">Report lost items or browse found items</p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Report Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-foreground">{lostItems.length}</div>
            <div className="text-sm text-muted-foreground">Lost Items</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-accent">{foundItems.length}</div>
            <div className="text-sm text-muted-foreground">Found Items</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Reunited</div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">AI Matches</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl">
            <TabsTrigger value="lost" className="rounded-xl">
              Lost Items ({lostItems.length})
            </TabsTrigger>
            <TabsTrigger value="found" className="rounded-xl">
              Found Items ({foundItems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lost" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <LostItemCard {...item} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="found" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <LostItemCard {...item} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LostFound;
