import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";

interface ClassroomCardProps {
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: "occupied" | "free";
  lastUpdated?: string;
  updatedBy?: string;
}

export const ClassroomCard = ({
  name,
  building,
  floor,
  capacity,
  status,
  lastUpdated,
  updatedBy,
}: ClassroomCardProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentStatus(currentStatus === "occupied" ? "free" : "occupied");
      setIsUpdating(false);
    }, 500);
  };

  return (
    <Card className="p-5 card-hover border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            currentStatus === "free" ? "bg-accent/10" : "bg-destructive/10"
          }`}>
            <DoorOpen className={`h-6 w-6 ${
              currentStatus === "free" ? "text-accent" : "text-destructive"
            }`} />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{name}</h4>
            <p className="text-sm text-muted-foreground">{building} - Floor {floor}</p>
          </div>
        </div>
        <Badge className={currentStatus === "free" ? "status-free" : "status-occupied"}>
          <div className={`w-2 h-2 rounded-full mr-1 ${
            currentStatus === "free" ? "bg-accent" : "bg-destructive"
          }`} />
          {currentStatus === "free" ? "Available" : "Occupied"}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Capacity: {capacity}</span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Updated {lastUpdated}</span>
            {updatedBy && <span>by {updatedBy}</span>}
          </div>
        )}
      </div>

      <Button
        className={`w-full ${currentStatus === "free" ? "btn-accent" : "btn-secondary"}`}
        onClick={handleToggleStatus}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : currentStatus === "free" ? "Mark as Occupied" : "Mark as Free"}
      </Button>
    </Card>
  );
};
