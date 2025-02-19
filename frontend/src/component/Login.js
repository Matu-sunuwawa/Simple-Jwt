
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuth }) {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to store errors
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      // const user = JSON.stringify({ username, password });

      // Generate A New Access Token and Refresh Token using Valid Authentication Credentials. [1]
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.access && response.data.refresh) {
        
        // Initialize the access & refresh token in localStorage.
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        // In axios once you -->"set `Authorization` header globally"<-- with axios.defaults.headers.common["Authorization"].
        // This means that for any request (whether it's a GET, POST, etc.) made after this line of code runs, 
        // axios will automatically attach the `Authorization` header with the `Bearer token`, ==>"so you don't need to manually add the header for every single request."<==

        // This is what makes axios so convenient, this eliminates the need to specify this kind of format for each `request`:
        // const response = await axios.get(
        //   "http://localhost:8000/",
        //   {
        //     headers: { "Authorization": `Bearer ${accessToken}` },
        //     withCredentials: true,
        //   }
        // );
      

        // Login Using Access Token. [2]
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

        console.log(axios.defaults.headers.common["Authorization"]);

        setIsAuth(true);

        // Redirect to home page with reloading
        // window.location.href = "/";

        // Redirect to home page without reloading
        navigate("/");

      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Container>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={submit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group mt-3">
              <label>Username</label>
              <input className="form-control mt-1" 
                placeholder="Enter Username" 
                name='username'  
                type='text' value={username}
                required 
                onChange={e => setUsername(e.target.value)}/>
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input name='password' 
                type="password"     
                className="form-control mt-1"
                placeholder="Enter password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}/>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" 
                  className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Login