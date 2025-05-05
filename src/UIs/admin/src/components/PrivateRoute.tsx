import { useAuthContext } from '../contexts/AuthContext'; // Import the hook
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import Unauthorize from './Unauthorized'; // Import the Unauthorize component
import { useNavigate } from 'react-router-dom';

const PrivateRoute = (params: { requiredRoles: string[] }) => {
  const { auth } = useAuthContext(); // Get authentication state from context

  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  // If the user is not authenticated, redirect to the login page
  if (
    !auth.isAuthenticated() ||
    !params.requiredRoles.some((role) => auth.user.roles.includes(role))
  ) {
    // return <Unauthorize />;
  }
  navigate('/login', { replace: true }); // Redirect to login page

  // If authenticated, render the child components
  return <Outlet />;
};

export default PrivateRoute;
