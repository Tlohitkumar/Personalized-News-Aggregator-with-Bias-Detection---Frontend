import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    getNews(keyword)
      .then(res => setNews(res.data.articles))
      .catch(err => console.log(err));
  };

  return (
    <div className="container">
      <h1>📰 Top News</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search news..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button onClick={loadNews}>Search</button>

      {/* 📂 Categories */}
      <div>
        <button onClick={() => getNews(null, "sports").then(res => setNews(res.data.articles))}>Sports</button>
        <button onClick={() => getNews(null, "technology").then(res => setNews(res.data.articles))}>Tech</button>
        <button onClick={() => getNews(null, "business").then(res => setNews(res.data.articles))}>Business</button>
      </div>

      <div className="news-grid">
        {news.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.urlToImage || "https://via.placeholder.com/300"} alt="news" />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.url} target="_blank" rel="noreferrer">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;