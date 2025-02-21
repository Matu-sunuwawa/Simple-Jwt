
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './component/Home';
import Navigation from './component/Navigation';
import Login from './component/Login';
import Logout from './component/Logout';
import Registeration from './component/Registeration';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import ReversePrivateRoute from './utils/ReversePrivateRoute';
import NotFound from './component/NotFound';

function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Navigation />
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="/login" 
                        element={
                            <ReversePrivateRoute>
                                <Login />
                            </ReversePrivateRoute>
                            } 
                    />
                    <Route path="/register" 
                        element={
                            <ReversePrivateRoute>
                                <Registeration />
                            </ReversePrivateRoute>
                        }
                    />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;