import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../../contexts/AuthContext';
import { login } from '../../services/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: (response) => {
      if (response.success) {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + response.expiresIn);

        setAuth((prev) => {
          prev.saveState(response.user, expiresAt);
          return prev;
        });
        navigate('/');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate({ email, password });
  };

  // Display error from mutation
  const error = loginMutation.error
    ? (loginMutation.error as any)?.message || 'Login failed'
    : '';

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-12 bg-white border border-gray-300 rounded-lg shadow-md w-96 "
      >
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          TiniTech Admin Entrance
        </h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-600">
            Username
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-600">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className={`py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loginMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
