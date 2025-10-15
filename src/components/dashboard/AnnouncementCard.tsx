import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import { useState } from "react";

interface AnnouncementCardProps {
  title: string;
  description: string;
  source: string;
  timestamp: string;
  sourceType: "club" | "faculty" | "admin";
}

export const AnnouncementCard = ({
  title,
  description,
  source,
  timestamp,
  sourceType,
}: AnnouncementCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const badgeVariants = {
    club: "bg-primary/10 text-primary",
    faculty: "bg-accent/10 text-accent",
    admin: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="p-5 card-hover border-border/50">
      <div className="flex items-start justify-between mb-3">
        <Badge className={badgeVariants[sourceType]}>{source}</Badge>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {timestamp}
        </div>
      </div>
      
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      
      <p className={`text-sm text-muted-foreground mb-3 ${!expanded && "line-clamp-3"}`}>
        {description}
      </p>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="text-primary hover:text-primary-hover p-0 h-auto"
      >
        {expanded ? "Show less" : "Read more"}
      </Button>
    </Card>
  );
};
