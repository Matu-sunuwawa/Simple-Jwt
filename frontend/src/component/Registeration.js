
import Container from 'react-bootstrap/Container';
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';

function Registeration() {

    const { submitRegisteration, error } = useContext(AuthContext)

    return (
      <Container>
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={submitRegisteration}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
  
              {error && <div className="alert alert-danger">{error}</div>}
  
              <div className="form-group mt-3">
                <label>FirstName</label>
                <input className="form-control mt-1" placeholder="Enter Username" name='first_name' type='text' required />
              </div>
              <div className="form-group mt-3">
                <label>LastName</label>
                <input className="form-control mt-1" placeholder="Enter Username" name='last_name' type='text' required />
              </div>
              <div className="form-group mt-3">
                <label>Username</label>
                <input className="form-control mt-1" placeholder="Enter Username" name='username' type='text' required />
              </div>
              <div className="form-group mt-3">
                <label>Email</label>
                <input className="form-control mt-1" placeholder="Enter Email" name='email' type="email" required/>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input className="form-control mt-1" placeholder="Enter Password" name='password' type="password" required/>
              </div>
              <div className="form-group mt-3">
                <label>Confirm Password</label>
                <input className="form-control mt-1" placeholder="Enter Confirm Password" name='password_confirmation' type="password" required/>
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

export default Registeration
