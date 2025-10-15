import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  attendees: number;
  image?: string;
}

export const EventCard = ({
  title,
  date,
  time,
  location,
  host,
  attendees,
  image,
}: EventCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border-border/50">
      {image ? (
        <div className="h-40 bg-gradient-to-br from-primary to-primary-hover" />
      ) : (
        <div className="h-40 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          <Calendar className="h-12 w-12 text-white/50" />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-accent/10 text-accent">{host}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {attendees}
          </div>
        </div>
        
        <h4 className="font-semibold text-lg mb-3">{title}</h4>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {time}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        </div>
        
        <Button className="w-full btn-primary">
          RSVP
        </Button>
      </div>
    </Card>
  );
};
