import { Calendar, Users, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    domain: string;
    skills_required: string[];
    vacancies: number;
    deadline: string | null;
  };
  onClick: () => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <Card className="hover-scale cursor-pointer group" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary">{project.domain}</Badge>
          {project.vacancies > 0 ? (
            <Badge className="bg-accent text-accent-foreground">
              {project.vacancies} {project.vacancies === 1 ? "Vacancy" : "Vacancies"}
            </Badge>
          ) : (
            <Badge variant="destructive">Full</Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.skills_required.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skills_required.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.skills_required.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        {project.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.deadline).toLocaleDateString()}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" className="ml-auto">
          View Details →
        </Button>
      </CardFooter>
    </Card>
  );
};
