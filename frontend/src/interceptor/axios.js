
import axios from "axios";

let refresh = false;

axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true;
      try {

        if (localStorage.getItem("refresh_token") !== null) {
          const response = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            { refresh: localStorage.getItem("refresh_token") },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (response.status === 200) {

            axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
  
            // Retry the original request with the new token
            error.config.headers["Authorization"] = `Bearer ${response.data.access}`;
            refresh = false;
            window.location.href = '/';
            return axios(error.config);
          }
        } else {
          if (window.location.pathname !== "/login") {
            window.location.href = '/login';
          }
        }
      } catch (err) {
        if (window.location.pathname !== "/login") {
          window.location.href = '/login';
        }
        console.error("Token refresh failed", err);
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

export default axios;
