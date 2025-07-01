import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [today, setToday] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [announce, setAnnounce] = useState([]);

  const { userDetails } = useContext(AuthContext);

  // On mount: set today's date & fetch all announcements
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setToday(currentDate);

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/announce/getallannounce");
        setAnnounce(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  // Handle form submit
  const handleSubmit = async () => {
    setIsLoading(true);
    setSuccess(false);
    setError(false);

    try {
      await axios.post(
        "http://localhost:5000/announce/addAnnouncement",
        { Title: title, content, Today: today },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      setSuccess(true);
      setTitle("");
      setContent("");

      // Re-fetch announcements after successful post
      const res = await axios.get("http://localhost:5000/announce/getallannounce");
      setAnnounce(res.data);
    } catch (err) {
      setIsLoading(false);
      setError(true);
      console.error("Error adding announcement:", err);
    }
  };

  return (
    <div className="m-10">
      {/* Admin Form */}
      {userDetails?.type === "admin" && (
        <div className="mb-10">
          {success && <div className="text-green-600 mb-2">✅ Announcement added successfully!</div>}
          {error && <div className="text-red-600 mb-2">❌ Failed to add announcement.</div>}
          <input
            type="text"
            placeholder="News Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="text"
            value={today}
            readOnly
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isLoading ? "Submitting..." : "Submit Announcement"}
          </button>
        </div>
      )}

      {/* Announcement List (Visible to All) */}
      <div>
        <h2 className="text-xl font-bold mb-4">📰 Announcements</h2>
        {announce.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          announce.map((item, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded shadow-sm bg-white">
              <h3 className="font-semibold text-lg">{item.Title}</h3>
              <p className="text-gray-700 mb-2">{item.content}</p>
              <p className="text-sm text-gray-500">📅 {item.Today}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement;
