import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <NavLink to="/" className="navbar-brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        HN<span>Reader</span>
      </NavLink>

      {/* Nav links + controls */}
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
          Stories
        </NavLink>

        {isAuthenticated && (
          <NavLink to="/bookmarks" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Bookmarks
          </NavLink>
        )}

        {/* Theme toggle */}
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {isAuthenticated ? (
          <>
            <span style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", padding: "0 0.25rem" }}>
              Hi, {user?.name?.split(" ")[0]}
            </span>
            <button className="nav-btn nav-btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-btn nav-btn-ghost" style={{ textDecoration: "none" }}>
              Login
            </NavLink>
            <NavLink to="/register" className="nav-btn nav-btn-primary" style={{ textDecoration: "none" }}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
