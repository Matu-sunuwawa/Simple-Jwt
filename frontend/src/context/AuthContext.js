
import React, { useState, useEffect, createContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import validateToken from '../utils/validateToken';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const isFirstRender = useRef(true); // Use useRef at the component level

    const [auth, setAuth] = useState(() => (localStorage.getItem('access_token') !== null ? true : false));
    // const [auth, setAuth] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (validateToken(accessToken)) {
            localStorage.clear();
            setAuth(false)
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                navigate('/login');
            }
            return;
        } else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
    }, []);

    const submitLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(
                'http://localhost:8000/api/token/',
                { username, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                setAuth(true);
                navigate('/');
            } else {
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        }
    };

    const submitLogout = async () => {

        const accessToken = localStorage.getItem('access_token');

        if (validateToken(accessToken)) {
            localStorage.clear();
            setAuth(false)
            navigate('/login');
            return;
        }

        if (isFirstRender.current) {
            isFirstRender.current = false;

            try {
                await axios.post(
                    'http://localhost:8000/logout/',
                    { refresh_token: localStorage.getItem('refresh_token') },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true,
                    }
                );

                localStorage.clear();
                delete axios.defaults.headers.common['Authorization'];
                setAuth(false);
                navigate('/login');
            } catch (e) {
                console.error('Logout not working:', e);
            }
        }
    };

    const submitRegisteration = async (e) => {
        e.preventDefault();
        setError(null);

        const first_name = e.target.first_name.value;
        const last_name = e.target.last_name.value;
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const password_confirmation = e.target.password_confirmation.value;

        try {
            const response = await axios.post(
                'http://localhost:8000/register/',
                { first_name, last_name, username, password, password_confirmation, email },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                setAuth(true);
                navigate('/');
            } else {
                setError('Invalid response from server. Please try again.');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Registration failed. Please try again.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    }

    const homePage = async () => {
        const accessToken = localStorage.getItem('access_token');

        if (validateToken(accessToken)) {
            localStorage.clear();
            setAuth(false)
            navigate('/login');
            return;
        }


        try {
            const response = await axios.get('http://localhost:8000/', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMessage(response.data.message);
        } catch (e) {
            localStorage.clear();
            console.error('Not authenticated:', e);
        }
    };

    const ctx = {
        submitLogin,
        submitLogout,
        submitRegisteration,
        homePage,
        auth,
        message,
        error,
    };

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};