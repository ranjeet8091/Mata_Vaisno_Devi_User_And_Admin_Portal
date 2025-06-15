// src/Context/authContext.js
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const Authenticate = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/auth/authenticate", {
        headers: { authorization: `Bearer ${token}` },
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/auth/getuser", {
        headers: { authorization: `Bearer ${token}` },
      });

      // Adjust this based on your backend response structure
      const data = res.data.user || res.data;
      setUserDetails(data);
      console.log("Fetched userDetails:", data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserDetails(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      Authenticate(storedToken).then((valid) => {
        if (valid) {
          fetchUserProfile(storedToken);
        } else {
          setIsLoading(false);
          logout();
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userDetails, isLoading, token, Authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
