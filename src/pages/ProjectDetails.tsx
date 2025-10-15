import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProject();
    checkUserRole();
    checkApplication();
  }, [id]);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      setUserRole(data?.role || null);
    }
  };

  const checkApplication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && id) {
      const { data } = await supabase
        .from("project_applications")
        .select("id")
        .eq("project_id", id)
        .eq("student_id", user.id)
        .maybeSingle();
      setHasApplied(!!data);
    }
  };

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!applicationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please write a message",
        variant: "destructive",
      });
      return;
    }

    setApplying(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("project_applications")
        .insert({
          project_id: id,
          student_id: user.id,
          message: applicationMessage,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
      setHasApplied(true);
      setDialogOpen(false);
      setApplicationMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{project.domain}</Badge>
              <Badge variant={project.vacancies > 0 ? "default" : "destructive"}>
                {project.vacancies > 0 ? `${project.vacancies} Vacancies` : "Full"}
              </Badge>
            </div>
            <CardTitle className="text-3xl">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-semibold">{project.team_size} members</p>
                </div>
              </div>
              {project.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-semibold">
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills_required.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {project.file_url && (
              <div>
                <h3 className="font-semibold mb-2">Project Document</h3>
                <a
                  href={project.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View Document
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {userRole === "student" && project.vacancies > 0 && (
              <div className="pt-4 border-t">
                {hasApplied ? (
                  <Button disabled className="w-full">
                    Application Submitted
                  </Button>
                ) : (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Apply for this Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply for {project.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="message">Application Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell the teacher why you're interested in this project and what skills you bring..."
                            className="mt-2 min-h-[150px]"
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleApply}
                          disabled={applying}
                          className="w-full"
                        >
                          {applying ? "Submitting..." : "Submit Application"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
