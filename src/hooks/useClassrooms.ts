import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: 'free' | 'occupied';
  occupied_by_id: string | null;
  occupied_by_name: string | null;
  occupied_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassroomHistory {
  id: string;
  classroom_id: string;
  action: 'occupied' | 'vacated';
  by_user_id: string;
  by_user_name: string;
  at: string;
  until: string | null;
  reason: string | null;
}

export const useClassrooms = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all classrooms
  const { data: classrooms, isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms' as any)
        .select('*')
        .order('building', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as unknown as Classroom[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('classrooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classrooms',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['classrooms'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { classrooms, isLoading };
};

export const useClassroomHistory = (classroomId: string) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['classroom-history', classroomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classroom_history' as any)
        .select('*')
        .eq('classroom_id', classroomId)
        .order('at', { ascending: false });

      if (error) throw error;
      return data as unknown as ClassroomHistory[];
    },
  });

  return { history, isLoading };
};

export const useOccupyClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      classroomId,
      occupiedUntil,
      reason,
    }: {
      classroomId: string;
      occupiedUntil: string;
      reason?: string;
    }) => {
      // Update classroom status
      const { error: updateError } = await supabase
        .from('classrooms' as any)
        .update({
          status: 'occupied',
          occupied_by_id: user?.id,
          occupied_by_name: profile?.full_name,
          occupied_until: occupiedUntil,
          notes: reason,
        })
        .eq('id', classroomId);

      if (updateError) throw updateError;

      // Add history entry
      const { error: historyError } = await supabase
        .from('classroom_history' as any)
        .insert({
          classroom_id: classroomId,
          action: 'occupied',
          by_user_id: user?.id,
          by_user_name: profile?.full_name,
          until: occupiedUntil,
          reason,
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast({
        title: 'Classroom marked as occupied',
        description: 'The classroom status has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useVacateClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({ classroomId }: { classroomId: string }) => {
      // Update classroom status
      const { error: updateError } = await supabase
        .from('classrooms' as any)
        .update({
          status: 'free',
          occupied_by_id: null,
          occupied_by_name: null,
          occupied_until: null,
          notes: null,
        })
        .eq('id', classroomId);

      if (updateError) throw updateError;

      // Add history entry
      const { error: historyError } = await supabase
        .from('classroom_history' as any)
        .insert({
          classroom_id: classroomId,
          action: 'vacated',
          by_user_id: user?.id,
          by_user_name: profile?.full_name,
        });

      if (historyError) throw historyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast({
        title: 'Classroom marked as free',
        description: 'The classroom is now available.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
