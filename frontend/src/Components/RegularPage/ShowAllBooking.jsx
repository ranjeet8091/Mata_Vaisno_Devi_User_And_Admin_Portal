import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/authContext";
import { motion } from "framer-motion";

const ShowAllBooking = () => {
  const [bookings, setBooking] = useState([]);
  const { userDetails, token } = useContext(AuthContext);

  useEffect(() => {
    if (!userDetails || !userDetails.email || !token) return;

    const fetchBooking = async () => {
      try {
        const email = userDetails.email;
        const res = await axios.post(
          "http://localhost:5000/booking/getAllBooking",
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = res.data;
        console.log("Data of Booking", data);
        setBooking(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooking();
  }, [userDetails, token]);

  const printTicket = (booking) => {
    const printContent = `
      <div>
        <h2>SMVDSB Booking Ticket</h2>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Booking Type:</strong> ${booking.typeOfBooking}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Identity Type:</strong> ${booking.identityType}</p>
        <p><strong>Identity Number:</strong> ${booking.identityNumber}</p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<html><head><title>Print Ticket</title></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const isUpcoming = (date) => {
    const today = new Date();
    const bookingDate = new Date(date);
    // Reset hours to compare only date
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-yellow-100 via-white to-pink-100 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-blue-800 mb-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Bookings
      </motion.h1>

      {/* Upcoming Bookings */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Upcoming Bookings</h2>
        {bookings.filter(b => isUpcoming(b.date)).length === 0 ? (
          <p className="text-gray-600">No upcoming bookings.</p>
        ) : (
          bookings
            .filter((b) => isUpcoming(b.date))
            .map((booking) => (
              <motion.div
                key={booking._id}
                className="bg-white shadow-md p-4 rounded-lg mb-4 border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Type:</strong> {booking.typeOfBooking}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>ID:</strong> {booking.identityType} - {booking.identityNumber}</p>
                <button
                  onClick={() => printTicket(booking)}
                  className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Print Ticket
                </button>
              </motion.div>
            ))
        )}
      </motion.div>

      {/* Completed Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Completed Bookings</h2>
        {bookings.filter(b => !isUpcoming(b.date)).length === 0 ? (
          <p className="text-gray-600">No completed bookings.</p>
        ) : (
          bookings
            .filter((b) => !isUpcoming(b.date))
            .map((booking) => (
              <motion.div
                key={booking._id}
                className="bg-white shadow-md p-4 rounded-lg mb-4 border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.03 }}
              >
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Type:</strong> {booking.typeOfBooking}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>ID:</strong> {booking.identityType} - {booking.identityNumber}</p>
              </motion.div>
            ))
        )}
      </motion.div>
    </div>
  );
};

export default ShowAllBooking;