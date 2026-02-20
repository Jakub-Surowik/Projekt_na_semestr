import AuthModal from "../components/AuthModal";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    onLogin(userData);
    navigate("/dashboard");
  };

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#f8f8f8"
      }}>
        <AuthModal 
          onClose={() => navigate("/")} 
          onLogin={handleLogin}
        />
      </div>
    </>
  );
}
