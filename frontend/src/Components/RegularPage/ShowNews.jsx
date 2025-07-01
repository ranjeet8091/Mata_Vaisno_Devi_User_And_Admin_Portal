import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ShowNews = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const FetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUserDetails(data);
        if (data?.type === "admin") setAdmin(true);
      } catch (error) {
        console.log(error);
      }
    };
    FetchUserProfile();

    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/news/getnews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllNews(res.data.news);
      } catch (err) {
        setAllNews([]);
      }
    };
    fetchNews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setIsAdding(true);
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      toast.error("You must be logged in to add news", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
      setIsAdding(false);
      return;
    }
    if (!formData.title || !formData.content || !image || !formData.date) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsAdding(false);
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("image", image);
    data.append("date", new Date(formData.date).toISOString());

    try {
      await axios.post("http://localhost:5000/news/addNews", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("News added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsAdding(false);
      setFormData({ title: "", content: "", date: "" });
      setImage(null);
      // Refresh news list
      const res = await axios.get("http://localhost:5000/news/getnews", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllNews(res.data.news);
    } catch (err) {
      setIsAdding(false);
      if (err.response?.status === 401) {
        toast.error("Unauthorized: please log in again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to add news", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleDelete = async (newsId) => {
    try {
      await axios.delete(`http://localhost:5000/news/deleteNews/${newsId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("News deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setAllNews(allNews.filter((news) => news._id !== newsId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete news", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      {admin && (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-100 via-white to-pink-100 px-4 py-10">
          <motion.div
            className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ToastContainer />
            <motion.h2
              className="text-3xl font-extrabold text-center text-blue-800 mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Add News
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="News Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
              />
              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isAdding ? "Adding" : "Add"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
      <div className="bg-gradient-to-br from-yellow-100 via-white to-pink-100 py-12 px-6">
        <motion.h2
          className="text-4xl font-bold text-center text-blue-800 mb-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Latest News
        </motion.h2>

        {allNews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allNews.map((news) => (
              <motion.div
                key={news._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                {news.image && (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>
                  <div className="flex space-x-4">
                    <Link to={`/news/${news._id}`}>
                      <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                        View More
                      </button>
                    </Link>
                    {admin && (
                      <button
                        onClick={() => handleDelete(news._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    🗓️ {new Date(news.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No news available.</p>
        )}
      </div>
    </>
  );
};

export default ShowNews;