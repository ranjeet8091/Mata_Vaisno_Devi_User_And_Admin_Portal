import Navbar from "./Components/MainPages/Navbar";
import Login from "./Components/RegularPage/Login";
import Signup from "./Components/RegularPage/Signup";
import { Routes, Route } from "react-router-dom";
import Profile from "./Components/RegularPage/Profile";
import Home from "./Components/MainPages/Home";
import ShowNews from "./Components/RegularPage/ShowNews";
import SingleNews from "./Components/RegularPage/SingleNews"; 
import { AuthProvider } from "./Context/authContext";
import PasswordChange from "./Components/RegularPage/PasswordChange";
import Trip_Registration from "./Components/RegularPage/Trip_Registration";
import ShowRegister from "./Components/RegularPage/ShowRegister";
import RegistrationPage from "./Components/RegularPage/RegistrationPage";
import TripHistory from "./Components/RegularPage/TripHistory";
import RegistrationRequest from "./Components/RegularPage/RegistrationRequest";
import PithuBooking from "./Components/RegularPage/PithuBooking";
import RopeWayBooking from "./Components/RegularPage/RopeWayBooking";
import HelicopterBooking from "./Components/RegularPage/HelicopterBooking";
import Announcement from "./Components/RegularPage/Announcement";
import Services from "./Components/RegularPage/Services";
import HomePageOfBooking from "./Components/RegularPage/HomepageOfBooking";
import ShowAllBooking from "./Components/RegularPage/ShowAllBooking";
function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news" element={<ShowNews />} />
          <Route path="/news/:id" element={<SingleNews />} />
           <Route path="/changepassword" element={<PasswordChange />} />
           <Route path="/registerPage" element={<RegistrationPage />} />
           <Route path="/register-trip" element={<Trip_Registration />} />
           <Route path="/showRegisters" element={<ShowRegister />} />
           <Route path="/history" element={<TripHistory />} />
           <Route path="/register-request" element={<RegistrationRequest />} />
           <Route path="/pithuBooking" element={<PithuBooking />} />
           <Route path="/ropeWayBooking" element={<RopeWayBooking />} />
           <Route path="/helicopterBooking" element={<HelicopterBooking />} />
           <Route path="/announcement" element={<Announcement />} />
           <Route path="/services" element={<Services />} />
           <Route path="/HomePageOfBooking" element={<HomePageOfBooking />} />
           <Route path="/ShowBooking" element={<ShowAllBooking />} />


        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
