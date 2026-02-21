import { useState } from "react";
import "../styles/AuthModal.css";

export default function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // registration step
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    avatar: "",
    lawFirm: "",
    licenseNumber: "",
    pesel: "",
    birthDate: "",
    specialization: [],
    location: "",
    role: "Adwokat"
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
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            description: "",
            avatar: "",
            lawFirm: "",
            licenseNumber: "",
            pesel: "",
            birthDate: "",
            specialization: [],
            location: "",
            role: "Adwokat"
          });
          onClose();
        } else {
          setError("Nieprawidłowy email lub hasło");
        }
      }
    } else {
      if (step === 1) {
        // basic info
        if (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.password &&
          formData.confirmPassword
        ) {
          if (formData.password !== formData.confirmPassword) {
            setError("Hasła muszą być takie same");
            return;
          }
          setStep(2);
        }
      } else {
        // full registration
        if (
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
            description: formData.description,
            avatar: formData.avatar,
            lawFirm: formData.lawFirm,
            licenseNumber: formData.licenseNumber,
            pesel: formData.pesel,
            birthDate: formData.birthDate,
            specialization: formData.specialization,
            location: formData.location,
            role: formData.role,
            isLawyer: true
          };

          registerUser(newUser);
          const { password, ...pubUser } = newUser;
          onLogin(pubUser);
          // reset
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            description: "",
            avatar: "",
            lawFirm: "",
            licenseNumber: "",
            pesel: "",
            birthDate: "",
            specialization: [],
            location: "",
            role: "Adwokat"
          });
          setStep(1);
          onClose();
        }
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
            onClick={() => {
              setIsLogin(true);
              setStep(1);
            }}
          >
            Zaloguj
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setStep(1);
            }}
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
              {step === 1 ? (
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

                  <div className="form-group">
                    <label>Powtórz hasło</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Powtórz hasło"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-gold" style={{ width: "100%", marginTop: 20 }}>
                    Dalej
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Opis (o sobie / doświadczenie)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zdjęcie profilowe</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData(prev => ({ ...prev, avatar: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kancelaria (opcjonalne)</label>
                    <input
                      type="text"
                      name="lawFirm"
                      value={formData.lawFirm}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nr legitymacji adwokackiej</label>
                      <input
                        type="text"
                        name="licenseNumber"
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
                  <div className="form-group">
                    <label>Specjalizacja (wielokrotnie)</label>
                    <select
                      name="specialization"
                      multiple
                      value={formData.specialization}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions).map(o => o.value);
                        setFormData(prev => ({ ...prev, specialization: options }));
                      }}
                    >
                      <option>Prawo cywilne</option>
                      <option>Prawo karne</option>
                      <option>Prawo rodzinne</option>
                      <option>Prawo pracy</option>
                      <option>Nieruchomości</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lokalizacja (miasto)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Kim jesteś?</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option>Adwokat</option>
                      <option>Radca Prawny</option>
                      <option>Notariusz</option>
                      <option>Komornik</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => setStep(1)}
                      style={{ flex: 1, marginTop: 20, background: '#ccc', color: '#333' }}
                    >
                      Powrót
                    </button>
                    <button type="submit" className="btn-gold" style={{ flex: 1, marginTop: 20 }}>
                      Zarejestruj się
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
