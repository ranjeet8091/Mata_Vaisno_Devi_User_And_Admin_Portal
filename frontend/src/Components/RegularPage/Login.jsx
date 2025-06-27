import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const {login}=useContext(AuthContext)
  const navigate=useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password, "Type:", type);
    if (!email || !password || !type) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
        type,
      });
      console.log("Response:", res.data);
      login(res.data.token,res.data.user)
      localStorage.setItem("token", res.data.token);
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response)
         {
        alert(`Error ${error.response.status}: ${error.response.data}`);
      } else {
        alert("Login failed: " + error.message);
      }

    } finally {
      setLoading(false);
    }
  };


  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md sm:w-96">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm text-gray-600 mb-2"
            >
              Select Login Type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">-- Select Role --</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="username"
              className="block text-sm text-gray-600 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              {loading ? "Loging..." : "Login"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default Login;
