import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Search from "./pages/Search";
import IntakeForm from "./pages/IntakeForm";
import LawyerDashboard from "./pages/LawyerDashboard";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import {
  setCurrentUser,
  getCurrentUser,
  removeCurrentUser,
  updateUser as storageUpdateUser,
  deleteUser as storageDeleteUser
} from "./utils/userStorage";
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // persist current user so session survives refresh
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    removeCurrentUser();
  };

  // update user/profile details
  const handleUpdateUser = (updates) => {
    if (!user) return;
    const oldEmail = user.email;
    const updated = { ...user, ...updates };
    setUser(updated);
    setCurrentUser(updated);
    storageUpdateUser(updated, oldEmail);
  };

  const handleDeleteAccount = () => {
    if (!user) return;
    storageDeleteUser(user.email);
    handleLogout();
  };

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route
          path="/dashboard"
          element={
            <LawyerDashboard
              user={user}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
              onDeleteAccount={handleDeleteAccount}
            />
          }
        />
        <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
