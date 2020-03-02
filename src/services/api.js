import axios from 'axios';
import { getToken, getExpire, logout } from "./auth";
import swal from 'sweetalert';

const baseURL = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://finance-ninja-api.herokuapp.com"

const api = axios.create({
  baseURL
})

api.interceptors.request.use(async config => {

  const token = getToken();
  const expire = getExpire();
  if (Math.floor(Date.now()) > expire) {

    swal({
      title: "Session Expired",
      text: "You will be redirected to the login page!",
      icon: "warning",
      dangerMode: true,
    })
      .then(() => {
        logout();
        window.location = '/login';
      });

  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;