
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home({setIsAuth}) {

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        setError(null);
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        setIsAuth(true)

        try {
            const response = await axios.get(
              'http://localhost:8000/', 
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`, // Add Authorization header
                },
            });
            setMessage(response.data.message);
        } catch (e) {
            localStorage.clear();
            setError("Please stop using website for harmful purpose.");
            console.error('Not authenticated:', e);
        }
    };

      fetchData();
  }, [navigate]);

  return (
    <div>

        {error && <div className="alert alert-danger">{error}</div>}
    
        <div className="form-signin mt-5 text-center">
          <h3>Hi {message}</h3>
        </div>
    </div>
  )
}

export default Home;