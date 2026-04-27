import axios from "axios";

const API_URL =
  "https://personalized-news-aggregator-with-bias.onrender.com/api/news";

const getAuthHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
};

export const saveFavorite = (fav) => {
  return axios.post(
    "https://personalized-news-aggregator-with-bias.onrender.com/api/favorites",
    fav,
    getAuthHeader()
  );
};

export const getFavorites = (email) => {
  return axios.get(
    `https://personalized-news-aggregator-with-bias.onrender.com/api/favorites/${email}`,
    getAuthHeader()
  );
};

export const getNews = (keyword, category) => {
  let url = API_URL;

  if (keyword) {
    url += `?keyword=${keyword}`;
  } else if (category) {
    url += `?category=${category}`;
  }

  return axios.get(url, getAuthHeader());
};