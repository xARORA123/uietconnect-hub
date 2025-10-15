import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function TeacherApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
    fetchProjects();
  }, []);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (data?.role !== "teacher") {
        toast({
          title: "Access Denied",
          description: "Only teachers can view applications",
          variant: "destructive",
        });
        navigate("/projects");
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: projectsData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_applications (
            id,
            message,
            status,
            created_at,
            student_id
          )
        `)
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(projectsData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status}`,
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <h1 className="text-3xl font-bold mb-8">My Project Applications</h1>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                You haven't created any projects yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/projects/create")}
              >
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.domain} • {project.vacancies} vacancies left
                      </p>
                    </div>
                    <Badge>
                      {project.project_applications?.length || 0} Applications
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.project_applications?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No applications yet
                    </p>
                  ) : (
                    <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">
                          Pending (
                          {
                            project.project_applications?.filter(
                              (a: any) => a.status === "pending"
                            ).length
                          }
                          )
                        </TabsTrigger>
                        <TabsTrigger value="accepted">
                          Accepted (
                          {
                            project.project_applications?.filter(
                              (a: any) => a.status === "accepted"
                            ).length
                          }
                          )
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                          Rejected (
                          {
                            project.project_applications?.filter(
                              (a: any) => a.status === "rejected"
                            ).length
                          }
                          )
                        </TabsTrigger>
                      </TabsList>

                      {["pending", "accepted", "rejected"].map((status) => (
                        <TabsContent key={status} value={status} className="space-y-4">
                          {project.project_applications
                            ?.filter((a: any) => a.status === status)
                            .map((application: any) => (
                              <Card key={application.id}>
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Applied on{" "}
                                        {new Date(
                                          application.created_at
                                        ).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm">
                                        {application.message}
                                      </p>
                                    </div>
                                    {status === "pending" && (
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleApplicationStatus(
                                              application.id,
                                              "accepted"
                                            )
                                          }
                                          className="gap-2"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          Accept
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            handleApplicationStatus(
                                              application.id,
                                              "rejected"
                                            )
                                          }
                                          className="gap-2"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
