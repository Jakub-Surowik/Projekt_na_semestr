import { useState } from "react";
import "../styles/AuthModal.css";

export default function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    pesel: "",
    birthDate: ""
  });
  const [error, setError] = useState("");

  // helper functions for localStorage-based user store
  const loadUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const registerUser = (user) => {
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
  };

  const findUser = (email, password) => {
    const users = loadUsers();
    return users.find(u => u.email === email && u.password === password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // try to authenticate against stored users
      if (formData.email && formData.password) {
        const existing = findUser(formData.email, formData.password);
        if (existing) {
          const { password, ...pubUser } = existing;
          onLogin(pubUser);
          setFormData({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            licenseNumber: "",
            pesel: "",
            birthDate: ""
          });
          onClose();
        } else {
          setError("Nieprawidłowy email lub hasło");
        }
      }
    } else {
      // registration
      if (
        formData.email &&
        formData.password &&
        formData.firstName &&
        formData.lastName &&
        formData.licenseNumber &&
        formData.pesel &&
        formData.birthDate
      ) {
        const users = loadUsers();
        const already = users.find(u => u.email === formData.email);
        if (already) {
          setError("Użytkownik o takim emailu już istnieje");
          return;
        }

        const newUser = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          licenseNumber: formData.licenseNumber,
          pesel: formData.pesel,
          birthDate: formData.birthDate,
          isLawyer: true
        };

        registerUser(newUser);
        const { password, ...pubUser } = newUser;
        onLogin(pubUser);
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          licenseNumber: "",
          pesel: "",
          birthDate: ""
        });
        onClose();
      }
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Zaloguj
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Zarejestruj
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error" style={{ color: "red", marginBottom: 10 }}>{error}</div>}
          {isLogin ? (
            // FORMULARZ LOGOWANIA
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hasło</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Twoje hasło"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: "100%", marginTop: 20 }}>
                Zaloguj się
              </button>
            </>
          ) : (
            // FORMULARZ REJESTRACJI
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Imię</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Twoje imię"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nazwisko</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Twoje nazwisko"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hasło</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Hasło (min. 6 znaków)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nr Legitymacji Adwokackiej</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="np. A1234/2023"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>PESEL</label>
                  <input
                    type="text"
                    name="pesel"
                    placeholder="11 cyfr"
                    value={formData.pesel}
                    onChange={handleChange}
                    maxLength="11"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Data urodzenia</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: "100%", marginTop: 20 }}>
                Zarejestruj się
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
