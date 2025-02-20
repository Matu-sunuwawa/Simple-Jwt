
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


function Logout() {

    const { submitLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        submitLogout();
    }, [submitLogout, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
