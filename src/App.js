import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState([]);

  // 🔄 Load news + favorites on start
  useEffect(() => {
    loadNews();

    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // 🔍 Load news
  const loadNews = () => {
    getNews(keyword)
      .then(res => setNews(res.data.articles))
      .catch(err => console.log(err));
  };

  // ❤️ Add favorite
  const addFavorite = (item) => {
    const updated = [...favorites, item];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>📰 Top News</h1>

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

      {/* 📂 Categories */}
      <div>
        <button onClick={() => getNews(null, "sports").then(res => setNews(res.data.articles))}>Sports</button>
        <button onClick={() => getNews(null, "technology").then(res => setNews(res.data.articles))}>Tech</button>
        <button onClick={() => getNews(null, "business").then(res => setNews(res.data.articles))}>Business</button>
      </div>

      {/* 📰 News */}
      <div className="news-grid">
        {news.map((item, index) => (
          <div className="card" key={index}>
            <img
              src={item.urlToImage || "https://via.placeholder.com/300"}
              alt="news"
            />
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <a href={item.url} target="_blank" rel="noreferrer">
              Read More
            </a>

            <br />
            <button onClick={() => addFavorite(item)}>❤️ Save</button>
          </div>
        ))}
      </div>

      {/* ❤️ Favorites */}
      <h2>❤️ Favorites</h2>

      <div className="news-grid">
        {favorites.map((item, index) => (
          <div className="card" key={index}>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;