import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'reviewing' | 'resolved';
  created_at: string;
}

const ViewFeedback = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feedbackList, isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Feedback[];
    }
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Feedback marked as ${status}.`
      });

      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Feedback deleted",
        description: "The feedback has been removed."
      });

      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      reviewing: { variant: 'default', icon: MessageSquare },
      resolved: { variant: 'default', icon: CheckCircle }
    };

    const { variant, icon: Icon } = variants[status] || variants.pending;

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Student Feedback & Issues
            </CardTitle>
            <CardDescription>
              Manage and respond to feedback submitted by students
            </CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !feedbackList || feedbackList.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No feedback submissions yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {feedbackList.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{feedback.name}</CardTitle>
                      <CardDescription>
                        {feedback.email} • {format(new Date(feedback.created_at), 'PPp')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(feedback.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={feedback.status}
                      onValueChange={(value) => updateStatus(feedback.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFeedback(feedback.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;