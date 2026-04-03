import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const getAuthHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
};

export const getUsers = () =>
  axios.get(API_URL, getAuthHeader());

export const addUser = (user) =>
  axios.post(`${API_URL}/register`, user);

export const deleteUser = (id) =>
  axios.delete(`${API_URL}/${id}`, getAuthHeader());

export const loginUser = (user) =>
  axios.post(`${API_URL}/login`, user);