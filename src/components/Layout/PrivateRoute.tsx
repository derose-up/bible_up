import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

const PrivateRoute = ({ children, requireAdmin = false, requirePremium = false }: PrivateRouteProps) => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !userData?.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (requirePremium && userData?.status !== 'premium' && !userData?.isAdmin) {
    return <Navigate to="/upgrade" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;