
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Navigation from './component/Navigation';
import Logout from './component/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Navigation />
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home/>} />
                    </Route>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/logout" element={<Logout/>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;