import { useAuthContext } from '../contexts/AuthContext'; // Import the hook
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import Unauthorize from './Unauthorized'; // Import the Unauthorize component

const PrivateRoute = (params: { requiredRole: string }) => {
  const { auth } = useAuthContext(); // Get authentication state from context

  // If the user is not authenticated, redirect to the login page
  if (!auth.isAuthenticated() || auth.user.role !== params.requiredRole) {
    return <Unauthorize />;
  }

  // If authenticated, render the child components
  return <Outlet />;
};

export default PrivateRoute;
