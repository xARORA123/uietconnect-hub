import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, Users, Clock, History } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { OccupyClassroomDialog } from "./OccupyClassroomDialog";
import { ClassroomHistoryDialog } from "./ClassroomHistoryDialog";
import { useOccupyClassroom, useVacateClassroom } from "@/hooks/useClassrooms";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClassroomCardProps {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: "occupied" | "free";
  occupiedByName?: string | null;
  occupiedUntil?: string | null;
  notes?: string | null;
}

export const ClassroomCard = ({
  id,
  name,
  building,
  floor,
  capacity,
  status,
  occupiedByName,
  occupiedUntil,
  notes,
}: ClassroomCardProps) => {
  const { role } = useAuth();
  const [occupyDialogOpen, setOccupyDialogOpen] = useState(false);
  const [vacateDialogOpen, setVacateDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  const occupyMutation = useOccupyClassroom();
  const vacateMutation = useVacateClassroom();

  const isAdmin = role === 'admin';

  const handleOccupy = (occupiedUntil: string, reason?: string) => {
    occupyMutation.mutate(
      { classroomId: id, occupiedUntil, reason },
      {
        onSuccess: () => setOccupyDialogOpen(false),
      }
    );
  };

  const handleVacate = () => {
    vacateMutation.mutate(
      { classroomId: id },
      {
        onSuccess: () => setVacateDialogOpen(false),
      }
    );
  };

  const getRemainingTime = () => {
    if (!occupiedUntil) return null;
    const until = new Date(occupiedUntil);
    if (until < new Date()) return 'Expired';
    return formatDistanceToNow(until, { addSuffix: true });
  };

  return (
    <>
      <Card className="p-5 card-hover border-border/50" data-testid={`classroom-card-${id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              status === "free" ? "bg-accent/10" : "bg-destructive/10"
            }`}>
              <DoorOpen className={`h-6 w-6 ${
                status === "free" ? "text-accent" : "text-destructive"
              }`} />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{name}</h4>
              <p className="text-sm text-muted-foreground">{building} - Floor {floor}</p>
            </div>
          </div>
          <Badge className={status === "free" ? "status-free" : "status-occupied"}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              status === "free" ? "bg-accent" : "bg-destructive"
            }`} />
            {status === "free" ? "Available" : "Occupied"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Capacity: {capacity}</span>
          </div>
          {occupiedUntil && status === "occupied" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Until: {getRemainingTime()}</span>
            </div>
          )}
          {occupiedByName && status === "occupied" && (
            <div className="text-sm text-muted-foreground">
              Occupied by {occupiedByName}
            </div>
          )}
          {notes && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {notes}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryDialogOpen(true)}
            className="flex-1"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          
          {isAdmin && (
            <>
              {status === "free" ? (
                <Button
                  onClick={() => setOccupyDialogOpen(true)}
                  disabled={occupyMutation.isPending}
                  className="flex-1"
                  data-testid={`btn-occupy-${id}`}
                >
                  Mark Occupied
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setVacateDialogOpen(true)}
                  disabled={vacateMutation.isPending}
                  className="flex-1"
                  data-testid={`btn-vacate-${id}`}
                >
                  Mark Free
                </Button>
              )}
            </>
          )}
        </div>
      </Card>

      {isAdmin && (
        <>
          <OccupyClassroomDialog
            open={occupyDialogOpen}
            onOpenChange={setOccupyDialogOpen}
            classroomName={name}
            onConfirm={handleOccupy}
            isLoading={occupyMutation.isPending}
          />

          <AlertDialog open={vacateDialogOpen} onOpenChange={setVacateDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Vacate Classroom</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark {name} as free?
                  {occupiedByName && ` It was marked occupied by ${occupiedByName}.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleVacate}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      <ClassroomHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        classroomId={id}
        classroomName={name}
      />
    </>
  );
};
