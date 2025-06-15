import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

export const TripHistory = () => {
  const { userDetails } = useContext(AuthContext);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({ completed: [], upcoming: [] }); // Track expanded rows for mobile
  const token = localStorage.getItem("token");
  const currentDate = new Date("2025-06-13"); // Current date: June 13, 2025

  // Fetch registrations from backend
  useEffect(() => {
    const fetchRegistrations = async () => {
      if ( !token) {
        setError("Please log in to view trip history.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/trip/registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const registrations = response.data;

        // Filter trips based on travelDate
        const completed = registrations.filter(
          (reg) => new Date(reg.travelDate) < currentDate
        );
        const upcoming = registrations.filter(
          (reg) => new Date(reg.travelDate) >= currentDate
        );

        setCompletedTrips(completed);
        setUpcomingTrips(upcoming);
        setError("");
      } catch (error) {
        console.error("Error fetching trip history:", error);
        setError(error.response?.data?.message || "Failed to fetch trip history.");
        setCompletedTrips([]);
        setUpcomingTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [userDetails?.email, token]);

  // Toggle expanded row for mobile view
  const toggleRow = (section, index) => {
    setExpandedRows((prev) => {
      const sectionRows = prev[section];
      return {
        ...prev,
        [section]: sectionRows.includes(index)
          ? sectionRows.filter((i) => i !== index)
          : [...sectionRows, index],
      };
    });
  };

  // Format date for display
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mask Aadhaar ID (show last 4 digits)
  const maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length !== 12) return aadhaar;
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  // Render table for desktop
  const renderTable = (trips, section) => (
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-500 text-white text-sm sm:text-base">
            <th className="p-2 sm:p-3 text-left">User Name</th>
            <th className="p-2 sm:p-3 text-left">DOB</th>
            <th className="p-2 sm:p-3 text-left">Father's Name</th>
            <th className="p-2 sm:p-3 text-left">Mother's Name</th>
            <th className="p-2 sm:p-3 text-left">Travel Date</th>
            <th className="p-2 sm:p-3 text-left">Aadhaar ID</th>
            <th className="p-2 sm:p-3 text-left">Permanent Address</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index} className="border-t hover:bg-gray-100 text-sm sm:text-base">
              <td className="p-2 sm:p-3">{trip.userName}</td>
              <td className="p-2 sm:p-3">{formatDate(trip.dob)}</td>
              <td className="p-2 sm:p-3">{trip.fatherName}</td>
              <td className="p-2 sm:p-3">{trip.motherName}</td>
              <td className="p-2 sm:p-3">{formatDate(trip.travelDate)}</td>
              <td className="p-2 sm:p-3">{maskAadhaar(trip.aadhaarId)}</td>
              <td className="p-2 sm:p-3">{trip.permanentAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render cards for mobile
  const renderCards = (trips, section) => (
    <div className="block sm:hidden space-y-4">
      {trips.map((trip, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleRow(section, index)}
          >
            <div>
              <p className="font-semibold text-sm">{trip.userName}</p>
              <p className="text-xs text-gray-500">
                Travel: {formatDate(trip.travelDate)}
              </p>
            </div>
            <span className="text-blue-500 text-sm">
              {expandedRows[section].includes(index) ? "Hide" : "Show"}
            </span>
          </div>
          {expandedRows[section].includes(index) && (
            <div className="mt-2 text-xs space-y-1">
              <p>
                <span className="font-medium">DOB:</span> {formatDate(trip.dob)}
              </p>
              <p>
                <span className="font-medium">Father's Name:</span> {trip.fatherName}
              </p>
              <p>
                <span className="font-medium">Mother's Name:</span> {trip.motherName}
              </p>
              <p>
                <span className="font-medium">Aadhaar ID:</span>{" "}
                {maskAadhaar(trip.aadhaarId)}
              </p>
              <p>
                <span className="font-medium">Address:</span> {trip.permanentAddress}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Trip History</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {isLoading && <p className="text-blue-500 mb-4 text-center">Loading...</p>}

      {/* Completed Trips */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Completed Trips</h3>
        {completedTrips.length === 0 && !isLoading && !error && (
          <p className="text-gray-500 text-center">No completed trips found.</p>
        )}
        {completedTrips.length > 0 && (
          <>
            {renderTable(completedTrips, "completed")}
            {renderCards(completedTrips, "completed")}
          </>
        )}
      </div>

      {/* Upcoming Trips */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Upcoming Trips</h3>
        {upcomingTrips.length === 0 && !isLoading && !error && (
          <p className="text-gray-500 text-center">No upcoming trips found.</p>
        )}
        {upcomingTrips.length > 0 && (
          <>
            {renderTable(upcomingTrips, "upcoming")}
            {renderCards(upcomingTrips, "upcoming")}
          </>
        )}
      </div>
    </div>
  );
};

export default TripHistory;