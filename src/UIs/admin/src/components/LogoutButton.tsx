import React from 'react';

interface LogoutButtonProps {
  onLogout: () => void;
  isLoading: boolean;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  isLoading,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={isLoading}
      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 ${className}`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
