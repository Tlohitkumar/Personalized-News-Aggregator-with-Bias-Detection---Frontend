import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";
import "./App.css";

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews()
      .then(res => setNews(res.data.articles))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <h1>📰 Top News</h1>

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