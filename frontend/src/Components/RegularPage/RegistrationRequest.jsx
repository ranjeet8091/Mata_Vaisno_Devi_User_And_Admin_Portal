import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

const RegistrationRequest = () => {
  const { userDetails } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows for mobile
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  // Fetch pending registrations
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if ( !token) {
        setError("Please log in as an admin.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/trip/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pending = response.data;
        setPendingRequests(pending);
        setError("");
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setError(error.response?.data?.message || "Failed to fetch pending requests.");
        setPendingRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, [ token]);

  // Update status
  const handleUpdateStatus = async (aadhaarId, newStatus,id) => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/trip/status/${aadhaarId}/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingRequests((prev) =>
        prev.filter((req) => req._id !== id)
      );
      setError("");
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle expanded row for mobile view
  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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
  const renderTable = () => (
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
            <th className="p-2 sm:p-3 text-left">Status</th>
            <th className="p-2 sm:p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((req, index) => (
            <tr key={index} className="border-t hover:bg-gray-100 text-sm sm:text-base">
              <td className="p-2 sm:p-3">{req.userName}</td>
              <td className="p-2 sm:p-3">{formatDate(req.dob)}</td>
              <td className="p-2 sm:p-3">{req.fatherName}</td>
              <td className="p-2 sm:p-3">{req.motherName}</td>
              <td className="p-2 sm:p-3">{formatDate(req.travelDate)}</td>
              <td className="p-2 sm:p-3">{maskAadhaar(req.aadhaarId)}</td>
              <td className="p-2 sm:p-3">{req.permanentAddress}</td>
              <td className="p-2 sm:p-3 text-yellow-500">{req.status}</td>
              <td className="p-2 sm:p-3 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(req.aadhaarId, "Approved",req._id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-sm"
                  disabled={isLoading}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(req.aadhaarId, "Rejected",req._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                  disabled={isLoading}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render cards for mobile
  const renderCards = () => (
    <div className="block sm:hidden space-y-4">
      {pendingRequests.map((req, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleRow(index)}
          >
            <div>
              <p className="font-semibold text-sm">{req.userName}</p>
              <p className="text-xs text-gray-500">
                Travel: {formatDate(req.travelDate)}
              </p>
            </div>
            <span className="text-blue-500 text-sm">
              {expandedRows.includes(index) ? "Hide" : "Show"}
            </span>
          </div>
          {expandedRows.includes(index) && (
            <div className="mt-2 text-xs space-y-1">
              <p>
                <span className="font-medium">DOB:</span> {formatDate(req.dob)}
              </p>
              <p>
                <span className="font-medium">Father's Name:</span> {req.fatherName}
              </p>
              <p>
                <span className="font-medium">Mother's Name:</span> {req.motherName}
              </p>
              <p>
                <span className="font-medium">Aadhaar ID:</span>{" "}
                {maskAadhaar(req.aadhaarId)}
              </p>
              <p>
                <span className="font-medium">Address:</span> {req.permanentAddress}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-yellow-500">{req.status}</span>
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(req.aadhaarId, "Approved",req.email)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  disabled={isLoading}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(req.aadhaarId, "Rejected",req.email)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  disabled={isLoading}
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
        Pending Registration Requests
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {isLoading && <p className="text-blue-500 mb-4 text-center">Loading...</p>}

      {pendingRequests.length === 0 && !isLoading && !error && (
        <p className="text-gray-500 text-center">No pending requests found.</p>
      )}
      {pendingRequests.length > 0 && (
        <>
          {renderTable()}
          {renderCards()}
        </>
      )}
    </div>
  );
};

export default RegistrationRequest;