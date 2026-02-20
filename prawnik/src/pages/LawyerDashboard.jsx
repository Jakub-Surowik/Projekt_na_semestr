import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// simple sample data for tasks
const initialTasks = [
  { id: 1, title: "Sprzeciw od nakazu – Jan Kowalski" },
  { id: 2, title: "Pozew o zapłatę – Sp. z o.o." }
];

export default function LawyerDashboard({ user, onLogout, onUpdateUser, onDeleteAccount }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("sprawy");
  const [profileData, setProfileData] = useState({});

  // task state
  const [pending, setPending] = useState(initialTasks);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    // prefill form data when opening settings
    if (tab === "ustawienia" && user) {
      setProfileData({ email: user.email, password: "" });
    }
  }, [tab, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) onUpdateUser({ email: user.email, ...profileData });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const avatar = reader.result;
      if (onUpdateUser) onUpdateUser({ email: user.email, avatar });
    };
    reader.readAsDataURL(file);
  };

  const moveToInProgress = (task) => {
    if (window.confirm("Przenieść sprawę do 'W toku'? Nie można cofnąć.")) {
      setPending(p => p.filter(t => t.id !== task.id));
      setInProgress(p => [...p, task]);
    }
  };

  const moveToCompleted = (task) => {
    if (window.confirm("Przenieść sprawę do 'Zakończone'? Nie można cofnąć.")) {
      setInProgress(p => p.filter(t => t.id !== task.id));
      setCompleted(c => [...c, task]);
    }
  };

  const renderContent = () => {
    if (tab === "sprawy") {
      return (
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h3>Oczekujące</h3>
            {pending.map(task => (
              <div className="card" key={task.id} style={{ marginBottom: 10 }}>
                <p>{task.title}</p>
                <button
                  className="btn-gold"
                  onClick={() => moveToInProgress(task)}
                >
                  W toku →
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3>W toku</h3>
            {inProgress.map(task => (
              <div className="card" key={task.id} style={{ marginBottom: 10 }}>
                <p>{task.title}</p>
                <button
                  className="btn-gold"
                  onClick={() => moveToCompleted(task)}
                >
                  Zakończ →
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3>Zakończone</h3>
            {completed.map(task => (
              <div className="card" key={task.id} style={{ marginBottom: 10 }}>
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tab === "ustawienia") {
      return (
        <div>
          <h3>Ustawienia profilu</h3>
          <form onSubmit={handleSave} style={{ maxWidth: "400px" }}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Nowe hasło</label>
              <input
                type="password"
                name="password"
                value={profileData.password || ""}
                onChange={handleChange}
                placeholder="Pozostaw puste by nie zmieniać"
              />
            </div>
            <div className="form-group">
              <label>Zmień zdjęcie</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <button className="btn-gold" style={{ marginTop: 20 }}>
              Zapisz zmiany
            </button>
          </form>
          <div style={{ marginTop: 30 }}>
            <button
              className="btn-gold"
              onClick={() => {
                if (onLogout) onLogout();
                navigate("/");
              }}
              style={{ marginRight: 10 }}
            >
              Wyloguj
            </button>
            <button
              className="btn-red"
              onClick={() => {
                if (onDeleteAccount) onDeleteAccount();
                navigate("/");
              }}
            >
              Usuń konto
            </button>
          </div>
        </div>
      );
    }

    if (tab === "profil") {
      return (
        <div style={{ maxWidth: "400px" }}>
          <h3>Podgląd profilu</h3>
          <div style={{ textAlign: "center" }}>
            <img
              src={user?.avatar || "https://via.placeholder.com/120"}
              alt="avatar"
              style={{ width: 120, height: 120, borderRadius: "50%" }}
            />
            <h4>{user?.firstName} {user?.lastName}</h4>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav style={{ width: 240, padding: "20px", borderRight: "1px solid #e0e0e0", marginLeft: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <button
              className={`btn-link ${tab === "sprawy" ? "active" : ""}`}
              onClick={() => setTab("sprawy")}
            >
              Sprawy
            </button>
          </li>
          <li>
            <button
              className={`btn-link ${tab === "ustawienia" ? "active" : ""}`}
              onClick={() => setTab("ustawienia")}
            >
              Ustawienia profilu
            </button>
          </li>
          <li>
            <button
              className={`btn-link ${tab === "profil" ? "active" : ""}`}
              onClick={() => setTab("profil")}
            >
              Podgląd profilu
            </button>
          </li>
        </ul>
      </nav>
      <div style={{ flex: 1, padding: "60px 40px" }}>
        <h2 className="gold-text">Panel Prawnika</h2>
        {renderContent()}
      </div>
    </div>
  );
}
