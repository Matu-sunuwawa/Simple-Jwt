
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export function Navigation({ isAuth }) {

    // CHANGED TO `APP.js`

    // const [isAuth, setIsAuth] = useState(false);
    // const [isAuth, setIsAuth] = useState(localStorage.getItem('access_token') !== null);

    // useEffect(() => {
    //     // Check if the user is authenticated on component mount
    //     setIsAuth(localStorage.getItem('access_token') !== null);
    // }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">JWT Authentication</Navbar.Brand>
                {isAuth && <Nav className="me-auto"><Nav.Link as={Link} to="/">Home</Nav.Link></Nav>}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuth ? (
                            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
