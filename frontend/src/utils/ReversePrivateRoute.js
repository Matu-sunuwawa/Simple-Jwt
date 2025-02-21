// utils/ReversePrivateRoute.js

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ReversePrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (auth) {
        return <Navigate to="/" replace />;
    }

    // If the user is not authenticated, allow access to the route
    return children;
};

export default ReversePrivateRoute;