import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  user: { email: string; role: "admin" | "user" } | null;
  logout: () => void; // Accept logout function as a prop
};

const Header = ({ user, logout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");       // Clear the token
    localStorage.removeItem("loginTime");   // Clear the login time
    logout(); // Call the provided logout function
    navigate("/"); // Redirect to /home after logout
  };


  return (
    <header className="layout-header">
      <Link to="/" className="home">
        <div className="home-text mx-2">GAMESTOPMD</div>
      </Link>

      <div className="menu-wrap">
        <input type="checkbox" id="checkbox" className="checkbox-3line" />
        <nav className="nav-3line">
          <ul className="ul-3line">
            <li className="li-3line">
              <Link to="/">HOME</Link>
            </li>
            <li className="li-3line">
              <Link to="Catalog">CATALOG</Link>
            </li>
            <li className="li-3line">
              <Link to="Bag">YOUR BAG</Link>
            </li>
            {user ? (
              <>
                <li className="li-3line">
                  <Link to="Account">ACCOUNT</Link>
                </li>
                {user.role === "admin" && (
                  <li className="li-3line">
                    <Link to="Admin">ADMIN</Link>
                  </li>
                )}
                <li className="li-3line">
                  <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
                </li>
              </>
            ) : (
              <>
                <li className="li-3line">
                  <Link to="Register">REGISTER</Link>
                </li>
                <li className="li-3line">
                  <Link to="Login">LOGIN</Link>
                </li>
              </>
            )}
            <ThemeToggle />
          </ul>
        </nav>
        <label htmlFor="checkbox">
          <i className="fa fa-bars menu-icon"></i>
        </label>
      </div>
    </header>
  );
};

export default Header;
