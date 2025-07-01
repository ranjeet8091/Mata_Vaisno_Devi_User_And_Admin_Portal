import { Link } from "react-router-dom";

const HomePageOfBooking = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Booking Dashboard</h1>

      <div className="space-y-4 w-full max-w-sm">
        <Link
          to="/services"
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow transition duration-300"
        >
          Book Services
        </Link>

        <Link
          to="/ShowBooking"
          className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow transition duration-300"
        >
          Your Booking
        </Link>
      </div>
    </div>
  );
};

export default HomePageOfBooking;
