import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import photo from "..//../assets/sddefault.jpg"

const Profile = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const { gender, email, type } = user;

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("password", password);
      formData.append("gender", gender);
      formData.append("email", email);
      formData.append("type", type);
      if (image) {
        formData.append("profileImage", image);
      }

      await axios.put("http://localhost:5000/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Updated Successfully");
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      setToken(token);
      try {
        if (token) {
          const res = await axios.get("http://localhost:5000/auth/getuser", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = res.data;
          setUser(data);
          setName(data.name || "");
          setAge(data.age || 0);
          setPassword(data.password || "");
          if (data.profileImageUrl) {
            setPreview(data.profileImageUrl);
          }
        }
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h2>

        {/* Profile Image Upload */}
        <div className="mb-6 text-center">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={preview||image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-violet-500 cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                   setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Click the image to change</p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={user?.email || "N/A"}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none"
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Gender</label>
          <input
            type="text"
            value={user?.gender || "N/A"}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Password</label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 px-3 py-1 bg-violet-500 hover:bg-violet-600 text-white text-sm rounded-md transition duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Link to="/changepassword" className="text-violet-600 text-sm mt-1 block">
            Change Password
          </Link>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2 font-semibold">Role</label>
          <input
            type="text"
            value={user?.type || "N/A"}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none"
          />
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSave}
            className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
