  import React, { useState, useContext } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { AuthContext } from "../../Context/authContext";

  const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const navigate = useNavigate();
    const { userDetails, logout, isLogin } = useContext(AuthContext);

    console.log("Navbar Context:", { isLogin, userDetails }); // Debug log

    const handleLogout = async () => {
      await logout();
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
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
              <Link to="/news" className={linkClasses}>Latest News</Link>

              {!isLogin ? (
                <>
                  <Link to="/login" className={linkClasses}>Login</Link>
                  <Link to="/signup" className={linkClasses}>Signup</Link>
                </>
              ) : (
                <>
                  <Link to="/announcement" className={linkClasses}>Announcement</Link>

                  {/* Services Dropdown */}
                  <div className="">
                    <Link to="/HomePageOfBooking">Services</Link>
                  </div>

                  {userDetails?.type === "admin" && (
                    <Link to="/register-request" className={linkClasses}>
                      Check Registration Request
                    </Link>
                  )}

                  {userDetails?.type === "user" && (
                    <>
                      <Link to="/registerPage" className={linkClasses}>Trip Registration</Link>
                      <Link to="/history" className={linkClasses}>Trip History</Link>
                    </>
                  )}

                  <Link to="/profile" className={linkClasses}>Profile</Link>
                  <button onClick={handleLogout} className={`${linkClasses} focus:outline-none text-left`}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;