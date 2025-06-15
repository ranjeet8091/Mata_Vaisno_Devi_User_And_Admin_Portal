import React from "react";
import { Link } from "react-router-dom";

const RegistrationPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Registration Portal
        </h1>
        <Link
          to="/register-trip"
          className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-4"
          aria-label="Register for a trip"
        >
          Register
        </Link>
        <Link
          to="/showRegisters"
          className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          aria-label="View registered trips"
        >
          Show Register
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;