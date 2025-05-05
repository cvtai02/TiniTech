import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { logout } from '../services/auth';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '' }) => {
  const { auth, setAuth } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setAuth((prev) => {
        prev.logout();
        return prev;
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
