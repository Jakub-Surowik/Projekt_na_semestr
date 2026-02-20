import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Navbar({ isLoggedIn, user, onLogout, onLogin }) {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (userData) => {
    setShowAuthModal(false);
    // bubble up to App so state updates
    if (onLogin) onLogin(userData);
    navigate("/dashboard");
  };

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 className="gold-text" style={{ margin: 0, cursor: "pointer" }}>LexConnect</h2>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/search" style={{ marginRight: 10, textDecoration: "none", color: "inherit" }}>
            Znajdź prawnika
          </Link>

          {isLoggedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                Cześć, {user?.firstName || user?.email}
              </span>
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button className="btn-gold">Panel Prawnika</button>
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="btn-gold"
            >
              Zaloguj/Zarejestruj
            </button>
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}
