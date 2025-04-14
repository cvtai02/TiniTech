export function Unauthorized() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-10 text-center border border-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Unauthorize</h1>
      <p className="text-lg text-gray-600 mb-6">
        You are not authorized to access this Session.
      </p>
    </div>
  );
}

export default Unauthorized;
