import axios from "axios";

const API_URL = "https://your-backend.onrender.com/api/news";

const getAuthHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
};

export const saveFavorite = (fav) => {
  return axios.post("http://localhost:8080/api/favorites", fav);
};

export const getFavorites = (email) => {
  return axios.get(`http://localhost:8080/api/favorites/${email}`);
};

export const getNews = (keyword, category) => {
  let url = "http://localhost:8080/api/news";

  if (keyword) {
    url += `?keyword=${keyword}`;
  } else if (category) {
    url += `?category=${category}`;
  }

  return axios.get(url, getAuthHeader());
};

