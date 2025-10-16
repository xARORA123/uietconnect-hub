import { Badge } from '@/components/ui/badge';
import { Shield, GraduationCap, Users } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'teacher' | 'student' | null;
  size?: 'sm' | 'md';
}

export const RoleBadge = ({ role, size = 'md' }: RoleBadgeProps) => {
  if (!role) return null;

  const config = {
    admin: {
      label: 'Admin',
      icon: Shield,
      className: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    },
    teacher: {
      label: 'Teacher',
      icon: GraduationCap,
      className: 'bg-primary/10 text-primary hover:bg-primary/20',
    },
    student: {
      label: 'Student',
      icon: Users,
      className: 'bg-accent/10 text-accent hover:bg-accent/20',
    },
  };

  const { label, icon: Icon, className } = config[role];
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <Badge variant="outline" className={className}>
      <Icon className={iconSize} />
      <span>{label}</span>
    </Badge>
  );
};
