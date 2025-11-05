import { DoorOpen, AlertCircle, Package, FolderGit2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";




const actions = [
  {
    icon: DoorOpen,
    label: "Mark Classroom",
    description: "Update room status",
    color: "text-primary",
    bg: "bg-primary/10",
    path: "/classrooms",
  },
  {
    icon: AlertCircle,
    label: "Report Issue",
    description: "Maintenance request",
    color: "text-warning",
    bg: "bg-warning/10",
    path: "/maintenance",
  },
  {
    icon: Package,
    label: "Lost & Found",
    description: "Report items",
    color: "text-accent",
    bg: "bg-accent/10",
    path: "/lost-found",
  },
  {
    icon: FolderGit2,
    label: "Projects",
    description: "Browse repository",
    color: "text-info",
    bg: "bg-info/10",
    path: "/projects",
  },
  
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Card
            key={action.label}
            className="p-4 cursor-pointer card-hover group border-border/50"
            onClick={() => navigate(action.path)}
          >
            <div className={`${action.bg} ${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-sm mb-1">{action.label}</h4>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
