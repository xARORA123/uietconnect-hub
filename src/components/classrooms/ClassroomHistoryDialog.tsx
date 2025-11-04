import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useClassroomHistory } from '@/hooks/useClassrooms';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ClassroomHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  classroomName: string;
}

export const ClassroomHistoryDialog = ({
  open,
  onOpenChange,
  classroomId,
  classroomName,
}: ClassroomHistoryDialogProps) => {
  const { history, isLoading } = useClassroomHistory(classroomId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>History - {classroomName}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading history...</div>
          ) : history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-border/50 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        entry.action === 'occupied' ? 'status-occupied' : 'status-free'
                      }
                    >
                      {entry.action === 'occupied' ? 'Marked Occupied' : 'Marked Free'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.at), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">by</span>
                    <span className="font-medium">{entry.by_user_name}</span>
                  </div>

                  {entry.until && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">until</span>
                      <span>{new Date(entry.until).toLocaleString()}</span>
                    </div>
                  )}

                  {entry.reason && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {entry.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No history available for this classroom.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
