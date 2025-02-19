
// how we know or after how much time access token is invalid or not???. 
// To resolve this problem, we use the interceptor in react js. 
// Basically, Interceptors are methods which are triggered `Before` or `After` the main method.
// There are two types of interceptors: `Request interceptor` and `Response interceptor [we have using this one to check the response]`
import axios from "axios";

let refresh = false;

axios.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true;
      try {
        // console.log("Refreshing token using:", localStorage.getItem("refresh_token"));

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
            // Update the access token
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
          window.location.href = '/login';
        }
      } catch (err) {
        window.location.href = '/login';
        console.error("Token refresh failed", err);
      }
    }
    refresh = false;
    return Promise.reject(error); // Properly return the error
  }
);

export default axios;
