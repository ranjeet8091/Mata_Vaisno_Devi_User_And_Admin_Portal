import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import axios from "axios";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userLogin, setUserLogin] = useState(false);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [flip, setFlip] = useState(false);
  const [flipCount, setFlipCount] = useState(0); 

  const navigate = useNavigate();
  const { Authenticate, userDetails, logout } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);

      if (currentToken) {
        try {
          const authRes = await Authenticate(currentToken);
          if (authRes) {
            const res = await axios.get("http://localhost:5000/auth/getuser", {
              headers: {
                authorization: `Bearer ${currentToken}`,
              },
            });
            const type = res.data.type || userDetails?.type || "";
            setUserType(type);
            setUserLogin(true)
            if (!type && flipCount < 3) {
              setFlip((prev) => !prev);
              setFlipCount((prev) => prev + 1);
            }
          } else {
            setUserLogin(false);
            setUserType("");
            localStorage.removeItem("token");
          }
        } catch (error) {
          setUserLogin(false);
          setUserType("");
          localStorage.removeItem("token");
        }
      } else {
        setUserLogin(false);
        setUserType("");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [Authenticate, userDetails, token, flip]);

  // Watch for userDetails changes to update userType
  useEffect(() => {
    if (userLogin && !userType && userDetails?.type && isLoading) {
      setUserType(userDetails.type);
      setIsLoading(false);
    }
  }, [userLogin, userType, userDetails, isLoading]);

  const handleLogout = () => {
    logout();
    setUserLogin(false);
    setUserType("");
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClasses = "hover:text-yellow-300 transition-colors duration-200";

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Logo and Mobile Toggle */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl text-yellow-300 font-bold ml-2">SMVDSB</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto mt-4 md:mt-0`}
        >
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {!userLogin && (
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                  <Link to="/news" className={linkClasses}>
                    Latest News
                  </Link>
                  <Link to="/login" className={linkClasses}>
                    Login
                  </Link>
                  <Link to="/signup" className={linkClasses}>
                    Signup
                  </Link>
                </div>
              )}
              {userLogin && (
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                  <Link to="/news" className={linkClasses}>
                    Latest News
                  </Link>
                  <Link to="/announcement" className={linkClasses}>
                    Announcement
                  </Link>
                  <div className="relative group">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className={`${linkClasses} focus:outline-none md:pointer-events-auto`}
                      aria-expanded={mobileServicesOpen}
                    >
                      Services
                    </button>
                    <div
                      className={`${
                        mobileServicesOpen ? "block" : "hidden"
                      } md:absolute md:hidden md:group-hover:block bg-blue-800 mt-1 rounded shadow-lg z-10`}
                    >
                      <Link
                        to="/pithuBooking"
                        className="block px-4 py-2 hover:bg-yellow-400 hover:text-blue-900"
                      >
                        Pithu Booking
                      </Link>
                      <Link
                        to="/ropeWayBooking"
                        className="block px-4 py-2 hover:bg-yellow-400 hover:text-blue-900"
                      >
                        RopeWay Booking
                      </Link>
                      <Link
                        to="/helicopterBooking"
                        className="block px-4 py-2 hover:bg-yellow-400 hover:text-blue-900"
                      >
                        Helicopter Booking
                      </Link>
                    </div>
                  </div>
                  {userType === "admin" && (
                    <Link to="/register-request" className={linkClasses}>
                      Check Registration Request
                    </Link>
                  )}
                  {userType === "user" && (
                    <>
                      <Link to="/registerPage" className={linkClasses}>
                        Trip Registration
                      </Link>
                      <Link to="/history" className={linkClasses}>
                        Trip History
                      </Link>
                    </>
                  )}
                  <Link to="/profile" className={linkClasses}>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${linkClasses} focus:outline-none text-left`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;