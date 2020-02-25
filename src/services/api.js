import axios from 'axios';
import { getToken, getExpire, logout } from "./auth";
import swal from 'sweetalert';


const api = axios.create({
    baseURL: "http://localhost:5000"
})

api.interceptors.request.use(async config => {

    const token = getToken();
    const expire = getExpire();
    if (Math.floor(Date.now())>expire){

        swal({
          title: "Session Expired",
          text: "You to be redirected to the login page!",
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