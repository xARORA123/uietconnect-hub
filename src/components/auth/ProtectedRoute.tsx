import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'student';
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true
}: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  // Always show loading spinner while authentication state is being determined
  if (loading) {
    return <LoadingSpinner message="Verifying access..." />;
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    // If role hasn't loaded yet, show loading
    if (role === null) {
      return <LoadingSpinner message="Loading permissions..." />;
    }
    
    // If role doesn't match required role, deny access
    if (role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};