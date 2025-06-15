import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SingleNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/news/getnews/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNews(res.data.news);
      } catch (err) {
        setError("News not found or server error.");
      }
    };
    fetchNews();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg font-inter">{error}</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 text-lg font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg my-8 font-inter">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back
      </button>
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {news.title}
        </h1>
        {news.image && (
          <div className="relative group">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-[400px] object-cover rounded-lg mx-auto shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-800"
            />
          </div>
        )}
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {news.content}
        </p>
        
        <p className="text-sm text-gray-500">
          Published on:{" "}
          {new Date(news.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default SingleNews;