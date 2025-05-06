import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-10 text-center border border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unauthorize</h1>
      <p className="text-lg text-gray-600 mb-6">
        You are not authorized to access this Session.
      </p>

      {/* go to login */}
      <Link
        to="/login"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Login
      </Link>
    </div>
  );
}

export default Unauthorized;
