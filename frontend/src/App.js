
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Navigation from './component/Navigation';
import Logout from './component/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }
    }, []);

    return (
        <BrowserRouter>
            <Navigation isAuth={isAuth} />
            <Routes>
                <Route path="/" element={<Home setIsAuth={setIsAuth} />} />
                <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
                <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;