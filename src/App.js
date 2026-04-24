import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";
import axios from "axios";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState([]);

  const userEmail = "lohit@gmail.com";

  useEffect(() => {
    loadNews();
    loadFavorites();
  }, []);

  // 🔍 Load News
  const loadNews = () => {
    getNews(keyword)
      .then((res) => setNews(res.data.articles))
      .catch((err) => console.log(err));
  };

  // ❤️ Load Favorites
  const loadFavorites = () => {
    axios
      .get(`http://localhost:8080/api/favorites/${userEmail}`)
      .then((res) => setFavorites(res.data))
      .catch((err) => console.log(err));
  };

  // ❤️ Save Favorite
  const addFavorite = (item) => {
    const fav = {
      title: item.title,
      url: item.url,
      imageUrl: item.urlToImage,
      userEmail: userEmail,
    };

    axios
      .post("http://localhost:8080/api/favorites", fav)
      .then(() => loadFavorites())
      .catch((err) => console.log(err));
  };

  // ❌ Delete Favorite
  const deleteFavorite = (id) => {
    axios
      .delete(`http://localhost:8080/api/favorites/${id}`)
      .then(() => loadFavorites())
      .catch((err) => console.log(err));
  };

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // 📊 Dashboard Analytics
  const totalNews = news.length;

  const positiveCount = news.filter(
    (item) => item.sentiment && item.sentiment.includes("Positive")
  ).length;

  const negativeCount = news.filter(
    (item) => item.sentiment && item.sentiment.includes("Negative")
  ).length;

  const neutralCount = news.filter(
    (item) => item.sentiment && item.sentiment.includes("Neutral")
  ).length;

  const avgTrust =
    news.length > 0
      ? Math.round(
          news.reduce((sum, item) => sum + (item.trust || 0), 0) / news.length
        )
      : 0;

  return (
    <div className="container">
      <h1>📰 Top News</h1>

      {/* 📊 Dashboard */}
      <div className="dashboard">
        <div className="dash-card">📰 Total: {totalNews}</div>
        <div className="dash-card">😊 Positive: {positiveCount}</div>
        <div className="dash-card">😡 Negative: {negativeCount}</div>
        <div className="dash-card">😐 Neutral: {neutralCount}</div>
        <div className="dash-card">🛡️ Avg Trust: {avgTrust}%</div>
      </div>

      {/* 🔐 Logout */}
      <button onClick={handleLogout}>Logout</button>

      {/* 🔍 Search */}
      <div>
        <input
          type="text"
          placeholder="Search news..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={loadNews}>Search</button>
      </div>

      {/* 📰 News Section */}
      <div className="news-grid">
        {news.map((item, index) => (
          <div className="card" key={index}>
            <img
              src={item.urlToImage || "https://via.placeholder.com/300"}
              alt="news"
            />

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            {/* 🤖 AI Report */}
            <div className="ai-box">
              <h4>🧠 AI Report</h4>
              <p><b>Sentiment:</b> {item.sentiment}</p>
              <p><b>Bias:</b> {item.bias}</p>
              <p><b>Trust:</b> {item.trust}%</p>
              <p><b>Summary:</b> {item.summary}</p>
            </div>

            <a href={item.url} target="_blank" rel="noreferrer">
              Read More
            </a>

            <br />

            <button onClick={() => addFavorite(item)}>
              ❤️ Save
            </button>
          </div>
        ))}
      </div>

      {/* ❤️ Favorites */}
      <h2>❤️ Favorites</h2>

      <div className="news-grid">
        {favorites.map((item, index) => (
          <div className="card" key={index}>
            <img
              src={item.imageUrl || "https://via.placeholder.com/300"}
              alt="fav"
            />

            <h3>{item.title}</h3>

            <a href={item.url} target="_blank" rel="noreferrer">
              Read More
            </a>

            <br />

            <button onClick={() => deleteFavorite(item.id)}>
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;