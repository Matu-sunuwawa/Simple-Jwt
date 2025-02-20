
import React, { useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';

function Home() {

  const { homePage, message } = useContext(AuthContext)

  useEffect(() => {
    homePage()
  },[])

  return (
    <div>
        <div className="form-signin mt-5 text-center">
          <h3>Hi {message}</h3>
        </div>
    </div>
  )
}

export default Home;