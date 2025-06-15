import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";

const ShowNews = () => {
  const [userDetails,setUserDetails] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const FetchUserProfile=async()=>{
      try {
        const res=await axios.get("http://localhost:5000/auth/getuser",{
          headers:{authorization:`Bearer ${token}`},
        })
        const data=res.data;
        setUserDetails(data);
      } catch (error) {
        
      }
    }
    FetchUserProfile();
    if (userDetails?.type === "admin") setAdmin(true);
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
  }, [userDetails,allNews]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      setError("You must be logged in to add news");
      navigate("/login");
      return;
    }
    if (!formData.title || !formData.content || !image || !formData.date) {
      setError("All fields are required");
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
      setSuccess("News added successfully!");
      setFormData({ title: "", content: "", date: "" });
      setImage(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized: please log in again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Failed to add news");
      }
      setSuccess("");
    }
  };

  return (
    <>
      {admin && (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 px-4 py-10">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transition-transform duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 animate-fade-in">
              Add News
            </h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="News Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="bg-gradient-to-b from-white to-indigo-50 py-12 px-6">
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10 animate-fade-in-up">
          Latest News
        </h2>

        {allNews.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allNews.map((news) => (
              <div
                key={news._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              >
                {news.image && (
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">{news.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{news.content}</p>
                  <Link to={`/news/${news._id}`}>
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition">
                      View More
                    </button>
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">
                    🗓️ {new Date(news.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No news available.</p>
        )}
      </div>
    </>
  );
};

export default ShowNews;
