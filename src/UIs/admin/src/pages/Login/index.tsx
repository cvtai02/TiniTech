import React, { useState } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });
    // Add login logic here
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleLogin}
        className="flex flex-col p-12 bg-white border border-gray-300 rounded-lg shadow-md w-96 "
      >
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700">
          TiniTech Admin Entrance
        </h2>
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-600">
            Username
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          />
        </label>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
