import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Unauthorized from './Unauthorized';

interface PrivateRouteProps {
  children?: ReactNode;
  requiredRoles?: string[];
}

const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    console.log('PrivateRoute: isAuthenticated:', isAuthenticated);
    console.log('PrivateRoute: user:', user);
  }, [isAuthenticated, user]);

  console.log('isAuthenticated', isAuthenticated);

  // Show loading state if authentication is still being determined
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  // If not authenticated, redirect to login page with return URL
  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  // If role check is required and user doesn't have the required role
  if (user && requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(
      (role) =>
        user.role === role || (user.claims && user.claims.includes(role)),
    );

    if (!hasRequiredRole) {
      return <Unauthorized />;
    }
  }

  // If authenticated and has required roles, render the children or the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
