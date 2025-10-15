import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Tag } from "lucide-react";

interface LostItemCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  tags?: string[];
  image?: string;
  matchScore?: number;
}

export const LostItemCard = ({
  title,
  description,
  category,
  location,
  date,
  tags,
  image,
  matchScore,
}: LostItemCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border-border/50">
      <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-primary/10 text-primary">{category}</Badge>
          {matchScore && (
            <Badge className="bg-accent/10 text-accent">
              {matchScore}% match
            </Badge>
          )}
        </div>

        <h4 className="font-semibold text-lg mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button className="w-full btn-primary">
          Contact Owner
        </Button>
      </div>
    </Card>
  );
};

const Package = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16.5 9.4 7.55 4.24"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29 7 12 12 20.71 7"/>
    <line x1="12" x2="12" y1="22" y2="12"/>
  </svg>
);
