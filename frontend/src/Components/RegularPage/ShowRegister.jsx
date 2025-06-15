import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

const ShowRegister = () => {
  const { userDetails } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows for mobile
  const token = localStorage.getItem("token");

  // Fetch registrations from backend
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!token) {
        setError("Please log in to view registrations.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/trip/registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegistrations(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setError(error.response?.data?.message || "Failed to fetch registrations.");
        setRegistrations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [userDetails?.email, token]);

  // Handle print preview
  const handlePrintPreview = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
      setShowPrintPreview(false);
    }, 100);
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-8">
      {/* Main View */}
      {!showPrintPreview && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Registered Trips</h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {isLoading && <p className="text-blue-500 mb-4 text-center">Loading...</p>}

          {registrations.length === 0 && !isLoading && !error && (
            <p className="text-gray-500 text-center">No registrations found.</p>
          )}

          {registrations.length > 0 && (
            <>
              {/* Desktop Table View */}
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
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, index) => (
                      <tr key={index} className="border-t hover:bg-gray-100 text-sm sm:text-base">
                        <td className="p-2 sm:p-3">{reg.userName}</td>
                        <td className="p-2 sm:p-3">{formatDate(reg.dob)}</td>
                        <td className="p-2 sm:p-3">{reg.fatherName}</td>
                        <td className="p-2 sm:p-3">{reg.motherName}</td>
                        <td className="p-2 sm:p-3">{formatDate(reg.travelDate)}</td>
                        <td className="p-2 sm:p-3">{maskAadhaar(reg.aadhaarId)}</td>
                        <td className="p-2 sm:p-3">{reg.permanentAddress}</td>
                         <td className="p-2 sm:p-3">{reg.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden space-y-4">
                {registrations.map((reg, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleRow(index)}
                    >
                      <div>
                        <p className="font-semibold text-sm">{reg.userName}</p>
                        <p className="text-xs text-gray-500">
                          Travel: {formatDate(reg.travelDate)}
                        </p>
                      </div>
                      <span className="text-blue-500 text-sm">
                        {expandedRows.includes(index) ? "Hide" : "Show"}
                      </span>
                    </div>
                    {expandedRows.includes(index) && (
                      <div className="mt-2 text-xs space-y-1">
                        <p>
                          <span className="font-medium">DOB:</span>{" "}
                          {formatDate(reg.dob)}
                        </p>
                        <p>
                          <span className="font-medium">Father's Name:</span>{" "}
                          {reg.fatherName}
                        </p>
                        <p>
                          <span className="font-medium">Mother's Name:</span>{" "}
                          {reg.motherName}
                        </p>
                        <p>
                          <span className="font-medium">Aadhaar ID:</span>{" "}
                          {maskAadhaar(reg.aadhaarId)}
                        </p>
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {reg.permanentAddress}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrintPreview}
                className="mt-6 w-full sm:w-auto py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm sm:text-base"
              >
                Print Preview
              </button>
            </>
          )}
        </div>
      )}

      {/* Print Preview */}
      {showPrintPreview && (
        <div className="print-preview p-4 sm:p-6 bg-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Trip Registration Details
          </h2>
          <h3 className="text-sm sm:text-base mb-4">
            Number of Registrations: {registrations.length}
          </h3>
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1 sm:p-2 border">User Name</th>
                <th className="p-1 sm:p-2 border">DOB</th>
                <th className="p-1 sm:p-2 border">Father's Name</th>
                <th className="p-1 sm:p-2 border">Mother's Name</th>
                <th className="p-1 sm:p-2 border">Travel Date</th>
                <th className="p-1 sm:p-2 border">Aadhaar ID</th>
                <th className="p-1 sm:p-2 border">Permanent Address</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, index) => (
                <tr key={index} className="border-t">
                  <td className="p-1 sm:p-2 border">{reg.userName}</td>
                  <td className="p-1 sm:p-2 border">{formatDate(reg.dob)}</td>
                  <td className="p-1 sm:p-2 border">{reg.fatherName}</td>
                  <td className="p-1 sm:p-2 border">{reg.motherName}</td>
                  <td className="p-1 sm:p-2 border">{formatDate(reg.travelDate)}</td>
                  <td className="p-1 sm:p-2 border">{maskAadhaar(reg.aadhaarId)}</td>
                  <td className="p-1 sm:p-2 border">{reg.permanentAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowRegister;