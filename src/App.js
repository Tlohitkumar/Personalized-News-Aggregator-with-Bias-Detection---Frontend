import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";
import axios from "axios";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState([]);

  const userEmail = "lohit@gmail.com";

  // 🔄 Load news + favorites
  useEffect(() => {
    loadNews();

    loadFavorites();
  }, []);

  // 🔍 Load news
  const loadNews = () => {
    getNews(keyword)
      .then(res => setNews(res.data.articles))
      .catch(err => console.log(err));
  };

  // ❤️ Load favorites from DB
  const loadFavorites = () => {
    axios
      .get(`http://localhost:8080/api/favorites/${userEmail}`)
      .then(res => setFavorites(res.data))
      .catch(err => console.log(err));
  };

  // ❤️ Save favorite
  const addFavorite = (item) => {
    const fav = {
      title: item.title,
      url: item.url,
      imageUrl: item.urlToImage,
      userEmail: userEmail,
    };

    axios
      .post("http://localhost:8080/api/favorites", fav)
      .then(() => {
        alert("Saved ❤️");
        loadFavorites(); // refresh list
      })
      .catch(err => console.log(err));
  };

  // ❌ Delete favorite
  const deleteFavorite = (id) => {
    axios
      .delete(`http://localhost:8080/api/favorites/${id}`)
      .then(() => {
        loadFavorites(); // refresh after delete
      })
      .catch(err => console.log(err));
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
        <button onClick={() => getNews(null, "sports").then(res => setNews(res.data.articles))}>
          Sports
        </button>
        <button onClick={() => getNews(null, "technology").then(res => setNews(res.data.articles))}>
          Tech
        </button>
        <button onClick={() => getNews(null, "business").then(res => setNews(res.data.articles))}>
          Business
        </button>
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

      {/* 🤖 AI Sentiment */}
      <p><b>AI:</b> {item.sentiment}</p>

      {/* ⚖️ Bias Detection */}
      <p><b>Bias:</b> {item.bias}</p>

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
      {/* ❤️ Favorites Section */}
      <h2>❤️ Favorites (DB)</h2>

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
            <button onClick={() => deleteFavorite(item.id)}>❌ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;