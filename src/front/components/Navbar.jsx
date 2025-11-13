import { Link } from "react-router-dom";
import HomeLogo from "../../lib/HomeCalls.png";

export const Navbar = () => {
	return (
		<nav className="navbar sticky-top navbar-light bg-light">
			<div className="container-fluid">
				<Link to="/" className="navbar-brand">
					<img src={HomeLogo} alt="logo" width="100" height="100" />
				</Link>
				<div className="d-flex">
					<Link to="/signup">
						<button className="btn btn-outline-success me-2" type="button">
							Sign Up
						</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-outline-primary me-2" type="button">
							Login
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};