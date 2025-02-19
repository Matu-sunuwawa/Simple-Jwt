
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Logout({ setIsAuth }) {
  const navigate = useNavigate();

  // Ref to track the first render [Inorder to not send logout request Twice.]
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        const handleLogout = async () => {
            try {

                // The logout request is being sent twice because of `React's strict mode` in development. This causes the useEffect hook to run twice.
                await axios.post(
                    'http://localhost:8000/logout/',
                    { refresh_token: localStorage.getItem('refresh_token') },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                );

                // Clear local storage
                localStorage.clear();

                // Remove Authorization header
                delete axios.defaults.headers.common['Authorization'];

                setIsAuth(false);

                // Redirect to home page with reloading
                // window.location.href = "/";

                // Redirect to login page without reloading
                navigate('/login');
            } catch (e) {
                console.error('Logout not working:', e);
            }
        };

        handleLogout();
    }
  }, [navigate, setIsAuth]);

  return <div>Logging out...</div>; // Optional: Show a loading message
}

export default Logout;
