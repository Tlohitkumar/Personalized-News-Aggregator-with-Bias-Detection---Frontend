import axios from "axios";

const API_URL = "http://localhost:8080/api/news";

const getAuthHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
};

export const getNews = () => {
  return axios.get(API_URL, getAuthHeader());
};