import { Link, useNavigate } from "react-router-dom";
import React from "react";
import homeCallsImg from './../../lib/HomeCalls.png'

export const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const handleStorageChange = () => {
            const updatedToken = localStorage.getItem('token');
            setIsLoggedIn(!!updatedToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-light bg-white border-bottom border-dark border-2 px-4">
            <div className="container-fluid">
                <Link to="/" className="text-decoration-none">
                    <span className="navbar-brand px-3 py-2 fw-bold mb-0">
                       <img 
                        className="logo" 
                        style={{ width: '80px', height: '80px' }}
                        src={homeCallsImg} 
                        alt="HomeCalls Logo"
                        />
                     </span>
                </Link>
                <div className="ml-auto gap-3">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/signup">
                                <button className="btn btn-outline-dark px-4 me-3">
                                    Sign Up
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="btn btn-outline-dark px-4 me-3">
                                    Login
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile">
                                <button className="btn btn-outline-dark px-4 me-3">
                                    Profile
                                </button>
                            </Link>
                            <button 
                                className="btn btn-outline-dark px-4" 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};