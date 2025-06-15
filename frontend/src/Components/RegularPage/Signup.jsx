import React, { useState } from 'react';
import axios from 'axios';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async(e) => {
     e.preventDefault();
        if (!email || !password || !type || !name || !age || !gender) {
          alert("Please fill in all fields");
          return;
        }
        try {
          setLoading(true);
          const res = await axios.post("http://localhost:5000/auth/signup", {
            email,
            password,
            type,
            name,
            age,
            gender,
            profileImageUrl:""
          });
          console.log("Response:", res.data);
          localStorage.setItem("token", res.data.token);
          alert("User Created Successful");
    
        } catch (error) {
          console.error("Creation failed:", error);
          if (error.response)
             {
            alert(`Error ${error.response.status}: ${error.response.data}`);
          } else {
            alert("Creation failed: " + error.message);
          }
    
        } finally {
          setLoading(false);
        }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm text-gray-600 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm text-gray-600 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm text-gray-600 mb-2"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Enter your age"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm text-gray-600 mb-2"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
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
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm text-gray-600 mb-2"
          >
            Select Role
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

        <div>
          <button
            onClick={handleSignup}
            className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;