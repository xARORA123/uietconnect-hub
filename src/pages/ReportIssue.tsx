import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Send } from 'lucide-react';

const ReportIssue = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback.",
        variant: "destructive"
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide a detailed description (at least 10 characters).",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          user_id: user.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        }]);

      if (error) throw error;

      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for your feedback. We'll review it shortly."
      });

      // Reset form
      setFormData({ ...formData, message: '' });
      
      // Navigate back to dashboard after a delay
      setTimeout(() => navigate('/user/dashboard'), 1500);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Report an Issue</CardTitle>
            </div>
            <CardDescription>
              Let us know about any problems, suggestions, or feedback you have. We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message / Issue Description</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe the issue or provide your feedback in detail..."
                  required
                  disabled={loading}
                  rows={8}
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters. Be as detailed as possible.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/user/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;