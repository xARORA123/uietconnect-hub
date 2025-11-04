import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface OccupyClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomName: string;
  onConfirm: (occupiedUntil: string, reason?: string) => void;
  isLoading?: boolean;
}

export const OccupyClassroomDialog = ({
  open,
  onOpenChange,
  classroomName,
  onConfirm,
  isLoading,
}: OccupyClassroomDialogProps) => {
  const [duration, setDuration] = useState<string>('30');
  const [customHours, setCustomHours] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');
  const [reason, setReason] = useState('');

  const calculateOccupiedUntil = () => {
    const now = new Date();
    let minutes = 0;

    if (duration === 'custom') {
      minutes = (parseInt(customHours) || 0) * 60 + (parseInt(customMinutes) || 0);
    } else {
      minutes = parseInt(duration);
    }

    // Validate duration (min 5 minutes, max 7 days)
    if (minutes < 5) minutes = 5;
    if (minutes > 7 * 24 * 60) minutes = 7 * 24 * 60;

    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString();
  };

  const getPreviewTime = () => {
    try {
      const until = calculateOccupiedUntil();
      return new Date(until).toLocaleString();
    } catch {
      return 'Invalid time';
    }
  };

  const handleConfirm = () => {
    const occupiedUntil = calculateOccupiedUntil();
    onConfirm(occupiedUntil, reason || undefined);
    setReason('');
    setDuration('30');
    setCustomHours('');
    setCustomMinutes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Classroom Occupied</DialogTitle>
          <DialogDescription>
            You are about to mark {classroomName} as occupied. This will notify subscribed users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Occupancy Duration</Label>
            <RadioGroup value={duration} onValueChange={setDuration}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15" id="15min" />
                <Label htmlFor="15min" className="font-normal cursor-pointer">
                  15 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="30min" />
                <Label htmlFor="30min" className="font-normal cursor-pointer">
                  30 minutes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="1hour" />
                <Label htmlFor="1hour" className="font-normal cursor-pointer">
                  1 hour
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="120" id="2hours" />
                <Label htmlFor="2hours" className="font-normal cursor-pointer">
                  2 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Custom
                </Label>
              </div>
            </RadioGroup>
          </div>

          {duration === 'custom' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="168"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Scheduled lecture, Lab session"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg">
            <Clock className="h-4 w-4" />
            <div>
              <div className="font-medium">Occupied until:</div>
              <div>{getPreviewTime()}</div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Duration must be between 5 minutes and 7 days.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Confirm & Notify'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
