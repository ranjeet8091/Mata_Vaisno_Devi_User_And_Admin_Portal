import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const [user, setUser] = useState();
  const [token] = useState(localStorage.getItem("token"));
  const [content, setContent] = useState({
    about: null,
    facilities: [],
    contact: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/getuser/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      }
    };

    const dummyContent = {
      about: {
        intro: `Mata Vaishno Devi, located in the Trikuta Hills of Jammu and Kashmir, is one of the most revered Hindu pilgrimage sites in India.
Millions of devotees visit the cave temple every year to seek blessings from Goddess Vaishnavi, a manifestation of Goddess Durga.
The journey to the shrine involves a trek of around 13 kilometers from Katra town.`,
      },
      facilities: [
        {
          name: "Free Accommodation (Bhawan & Adhkuwari)",
          description:
            "Free and paid accommodation is provided for pilgrims at Bhawan, Adhkuwari, Sanjichhat, and Katra.",
        },
        {
          name: "Medical Services",
          description:
            "24/7 healthcare and emergency services are available along the Yatra route.",
        },
        {
          name: "Bhojanalayas & Refreshments",
          description:
            "Vegetarian food is served at hygienic outlets at subsidized prices.",
        },
        {
          name: "Battery Operated Vehicles",
          description:
            "Battery vehicles are available for elderly and specially-abled pilgrims.",
        },
      ],
      contact: {
        helpdesk: [
          {
            location: "Main Enquiry Office, Katra",
            phone: "+91-1991-234053",
            email: "helpdesk@maavaishnodevi.org",
          },
          {
            location: "Bhawan Enquiry",
            phone: "+91-1991-234209",
            email: "bhawan@maavaishnodevi.org",
          },
        ],
      },
    };

    if (token) fetchUser();
    setContent(dummyContent);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-pink-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-lg p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-pink-700 tracking-wide drop-shadow">
          Mata Vaishno Devi Shrine
        </h1>
        <div className="text-md text-gray-700 italic">
          Welcome, <span className="font-semibold">{user?.name || "Guest"}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-12 px-6 space-y-20">
        {/* About */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold border-b-2 pb-3 mb-4 text-pink-600">
            About the Shrine
          </h2>
          <p className="whitespace-pre-line text-lg leading-8 tracking-wide text-justify">
            {content.about?.intro}
          </p>
        </motion.section>

        {/* Facilities */}
        <motion.section
          id="facilities"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold border-b-2 pb-3 mb-4 text-pink-600">
            Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.facilities.map((facility, index) => (
              <motion.div
                key={index}
                className="p-5 bg-white rounded-2xl shadow-md border border-gray-100 hover:scale-[1.02] transition-transform duration-200"
                whileHover={{ scale: 1.03 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {facility.name}
                </h3>
                <p className="text-gray-600 text-md">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold border-b-2 pb-3 mb-4 text-pink-600">
            Contact & Helpdesk
          </h2>
          <ul className="space-y-5">
            {content.contact?.helpdesk?.map((contact, idx) => (
              <li
                key={idx}
                className="bg-white p-5 rounded-lg shadow-md border-l-4 border-pink-500"
              >
                <p className="text-lg font-semibold">{contact.location}</p>
                <p className="text-gray-600">📞 Phone: {contact.phone}</p>
                <p className="text-gray-600">📧 Email: {contact.email}</p>
              </li>
            ))}
          </ul>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-5 text-sm border-t text-gray-600 mt-10">
        © {new Date().getFullYear()} Shrine Board | All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
