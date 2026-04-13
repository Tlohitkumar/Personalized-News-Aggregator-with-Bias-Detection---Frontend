import React, { useEffect, useState } from "react";
import { getNews } from "./services/newsService";

function App() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews()
      .then(res => {
        console.log(res.data); // check response
        setNews(res.data.articles);
      })
      .catch(err => console.log(err)); // ✅ fixed
  }, []);

  return (
    <div>
      <h2>Top News</h2>

      {news && news.length > 0 ? (
        news.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No news available</p>
      )}
    </div>
  );
}

export default App;