import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

// Verhoeff Algorithm Implementation
const verhoeffTable = {
  d: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ],
  p: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ],
  inv: [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],
};

const validateAadhaar = (aadhaar) => {
  if (!/^\d{12}$/.test(aadhaar)) return false;

  let c = 0;
  const digits = aadhaar.split("").reverse().map(Number);

  for (let i = 0; i < digits.length; i++) {
    c = verhoeffTable.d[c][verhoeffTable.p[i % 8][digits[i]]];
  }

  return c === 0;
};

const Trip_Registration = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    dob: "",
    fatherName: "",
    motherName: "",
    travelDate: "",
    aadhaarId: "",
    permanentAddress: "",
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aadhaarValid, setAadhaarValid] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/getuser", {
          headers: { authorization: `Bearer ${token}` },
        });
        const data = res.data.user || res.data;
        setUserDetails(data);
        console.log("Fetched userDetails:", data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setUserDetails(null);
        setError("Failed to fetch user profile. Please try again.");
      }
    };
    fetchUserProfile();
  }, []); // Empty dependency array to run once on mount

  // Update formData.userName when userDetails changes
  useEffect(() => {
    if (userDetails && userDetails.name) {
      setFormData((prev) => ({ ...prev, userName: userDetails.name }));
    }
  }, [userDetails]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    if (name === "aadhaarId") setAadhaarValid(null);
  };

  // Validate Aadhaar number
  const handleValidateAadhaar = () => {
    if (!formData.aadhaarId) {
      setError("Please enter an Aadhaar ID.");
      setAadhaarValid(null);
      return;
    }
    if (!/^\d{12}$/.test(formData.aadhaarId)) {
      setError("Aadhaar ID must be a 12-digit number.");
      setAadhaarValid(false);
      return;
    }
    const isValid = validateAadhaar(formData.aadhaarId);
    setAadhaarValid(isValid);
    setError(isValid ? "" : "Invalid Aadhaar ID.");
    setSuccess(isValid ? "Aadhaar ID is valid!" : "");
  };

  // Validate form data
  const validateForm = () => {
    const {
      userName,
      dob,
      fatherName,
      motherName,
      travelDate,
      aadhaarId,
      permanentAddress,
    } = formData;

    if (!userName) return "User name is required.";
    if (!dob) return "Date of birth is required.";
    if (!fatherName) return "Father's name is required.";
    if (!motherName) return "Mother's name is required.";
    if (!travelDate) return "Travel date is required.";
    if (new Date(travelDate) < new Date().setHours(0, 0, 0, 0)) {
      return "Travel date must be in the future.";
    }
    if (!aadhaarId) return "Aadhaar ID is required.";
    if (!/^\d{12}$/.test(aadhaarId))
      return "Aadhaar ID must be a 12-digit number.";
    if (aadhaarValid !== true) return "Please validate the Aadhaar ID.";
    if (!permanentAddress) return "Permanent address is required.";

    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/trip/register",
        {
          userName: formData.userName,
          dob: formData.dob,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          travelDate: formData.travelDate,
          aadhaarId: formData.aadhaarId,
          permanentAddress: formData.permanentAddress,
          email: userDetails?.email || "",
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Trip registered successfully! Status: Pending");
      setFormData({
        userName: userDetails?.name || "",
        dob: "",
        fatherName: "",
        motherName: "",
        travelDate: "",
        aadhaarId: "",
        permanentAddress: "",
        status: "Pending",
      });
      setAadhaarValid(null);
    } catch (error) {
      console.error("Error registering trip:", error);
      setError(
        error.response?.data?.message ||
          "Failed to register trip. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Trip Registration</h2>

      {error && <p className="text-red-500 mb-4 text-center text-sm sm:text-base">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center text-sm sm:text-base">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-sm font-medium mb-1">
            User Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dob" className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fatherName" className="block text-sm font-medium mb-1">
            Father's Name
          </label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="motherName" className="block text-sm font-medium mb-1">
            Mother's Name
          </label>
          <input
            type="text"
            id="motherName"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="travelDate" className="block text-sm font-medium mb-1">
            Date to Travel
          </label>
          <input
            type="date"
            id="travelDate"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="aadhaarId" className="block text-sm font-medium mb-1">
            Aadhaar ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="aadhaarId"
              name="aadhaarId"
              value={formData.aadhaarId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter 12-digit Aadhaar ID"
              pattern="\d{12}"
              maxLength={12}
              required
            />
            <button
              type="button"
              onClick={handleValidateAadhaar}
              className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm sm:text-base"
            >
              Validate
            </button>
          </div>
          {aadhaarValid === true && (
            <p className="text-green-500 text-sm mt-1">Aadhaar ID is valid.</p>
          )}
          {aadhaarValid === false && (
            <p className="text-red-500 text-sm mt-1">Invalid Aadhaar ID.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="permanentAddress" className="block text-sm font-medium mb-1">
            Permanent Address
          </label>
          <textarea
            id="permanentAddress"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows={4}
            required
            placeholder="Enter your permanent address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || aadhaarValid !== true}
          className={`w-full p-2 text-white rounded text-sm sm:text-base ${
            isLoading || aadhaarValid !== true
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Submitting..." : "Register Trip"}
        </button>
      </form>
    </div>
  );
};

export default Trip_Registration;