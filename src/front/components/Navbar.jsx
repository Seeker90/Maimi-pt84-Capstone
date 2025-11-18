import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-light bg-white border-bottom border-dark border-2 px-4">
            <div className="container-fluid">
                <Link to="/" className="text-decoration-none">
                    <span className="navbar-brand border border-dark border-2 px-3 py-2 fw-bold mb-0">
                        Logo
                    </span>
                </Link>
                <div className="ml-auto">
                    <Link to="/login">
                       <button 
                        className="btn btn-outline-dark px-4 " 
                        //onClick={handleLogin}
                    >
                        Login
                    </button>
                    </Link>
                    <button 
                        className="btn btn-outline-dark px-4" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};
