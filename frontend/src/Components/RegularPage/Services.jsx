import React, { useState,useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import axios from "axios"
import { useNavigate } from "react-router-dom";
const Services = () => {
  const [typeOfBooking, setTypeOfBooking] = useState("");
  const [date, setDate] = useState("");
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const [identityType, setIdentityType] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
 const [isBooking,setIsBooking]=useState(false)
 const {userDetails,token}=useContext(AuthContext)
 const [success,setSuccess]=useState(false)
 const [error,setError]=useState(false)
 const navigate=useNavigate();
const  handleBooking=async()=>{
    setIsBooking(true)
    try {
      userData.email=userDetails.email
        const res=await  axios.post("http://localhost:5000/booking/addBooking",{typeOfBooking,date,userData,identityType,identityNumber},{
            headers:{
                Authorization:`Bearer ${token}  `
            }
        })
        setIsBooking(false)
     alert(res.data.message)
     navigate("/ShowBooking")

    } catch (error) {
       setIsBooking(false)
        alert(error)
    }
}

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">
        {typeOfBooking
          ? `Booking Type: ${typeOfBooking.charAt(0).toUpperCase() + typeOfBooking.slice(1)}`
          : "Select Booking Type"}
      </h1>

      <select
        value={typeOfBooking}
        onChange={(e)=>setTypeOfBooking(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Select option</option>
        <option value="pithu">Pithu</option>
        <option value="helicopter">Helicopter</option>
        <option value="ropeway">Ropeway</option>
      </select>

      {typeOfBooking && (
        <>
          <p className="text-green-700 mb-4">Welcome! Please fill in your details below.</p>

          <label className="block mb-2 font-semibold">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <label className="block mb-2 font-semibold">Your Name:</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) =>
              setuserData({ ...userData, name: e.target.value })
            }
            className="border p-2 rounded w-full mb-4"
            placeholder="Enter your name"
          />

          <label className="block mb-2 font-semibold">Email:</label>
          <input
            type="email"
            value={userDetails.email}
            readOnly
            className="border p-2 rounded w-full mb-4"
            placeholder="Enter your email"
          />

          <label className="block mb-2 font-semibold">Select Identity Type:</label>
          <select
            value={identityType}
            onChange={(e) => setIdentityType(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="">Choose identity type</option>
            <option value="aadhaar">Aadhaar Card</option>
            <option value="pan">PAN Card</option>
            <option value="voter">Voter ID</option>
            <option value="passport">Passport</option>
          </select>

          {identityType && (
            <>
              <label className="block mb-2 font-semibold">
                Enter { identityType} Number:
              </label>
              <input
                type="text"
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                placeholder={`Enter your ${identityType} number`}
              />
            </>
          )}
         <button
         onClick={handleBooking}
         className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
         {isBooking?"Booking":"Book"}
        </button>

        </>
      )}
    </div>
  );
};

export default Services;
