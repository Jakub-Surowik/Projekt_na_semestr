import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTasks, addTask, updateTask } from "../utils/tasksStorage";

// simple sample data used when user has no tasks yet
const initialTasks = [
  {
    title: "Sprzeciw od nakazu – Jan Kowalski",
    firstName: "Jan",
    lastName: "Kowalski",
    type: "Sprzeciw od nakazu",
    description: "Klient otrzymał nakaz zapłaty, potrzebuje przygotować sprzeciw i zebrać dokumenty.",
    budget: "1200",
    attachments: ["umowa.pdf", "dokumenty.zip"]
  },
  {
    title: "Pozew o zapłatę – Sp. z o.o.",
    firstName: "Anna",
    lastName: "Nowak",
    type: "Pozew o zapłatę",
    description: "Spółka domaga się zapłaty zaległej faktury za usługi IT, termin pilny.",
    budget: "2500",
    attachments: ["faktura.pdf"]
  }
];

export default function LawyerDashboard({ user, onLogout, onUpdateUser, onDeleteAccount }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("sprawy");
  const [profileData, setProfileData] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // task state stored in array, computed into columns
  const [tasks, setTasks] = useState([]);

  const pending = tasks.filter(t => t.status === "pending");
  const inProgress = tasks.filter(t => t.status === "inProgress");
  const completed = tasks.filter(t => t.status === "completed");

  useEffect(() => {
    // prefill form data when opening settings
    if (tab === "ustawienia" && user) {
      setProfileData({ email: user.email, password: "" });
    }
  }, [tab, user]);

  // load tasks for current lawyer and create defaults if none
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoadingTasks(true);
    let userTasks = await getUserTasks(user.email);

    if (userTasks.length === 0) {
      const now = Date.now();
      // add sample entries only first time
      for (let idx = 0; idx < initialTasks.length; idx++) {
        const t = initialTasks[idx];
        await addTask({
          id: now + idx,
          lawyerEmail: user.email,
          title: t.title,
          status: "pending",
          firstName: t.firstName || "",
          lastName: t.lastName || "",
          type: t.type || "",
          description: t.description || "",
          budget: t.budget || "",
          attachments: t.attachments || []
        });
      }
      userTasks = await getUserTasks(user.email);
    }

    setTasks(userTasks);
    setLoadingTasks(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();

    const handleStorage = (event) => {
      if (event.key === "tasks" || event.key === "tasks-updated") {
        fetchTasks();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchTasks]);

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

  const moveToInProgress = async (task) => {
    if (window.confirm("Przenieść sprawę do 'W toku'? Nie można cofnąć.")) {
      const updated = { ...task, status: "inProgress" };
      await updateTask(updated);
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    }
  };

  const moveToCompleted = async (task) => {
    if (window.confirm("Przenieść sprawę do 'Zakończone'? Nie można cofnąć.")) {
      const updated = { ...task, status: "completed" };
      await updateTask(updated);
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    }
  };

  const renderContent = () => {
    if (tab === "sprawy") {
      return (
        <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3>Sprawy</h3>
          <button
            className="btn-gold"
            onClick={fetchTasks}
            disabled={loadingTasks}
            style={{ width: 130 }}
          >
            {loadingTasks ? "Ładowanie..." : "Odśwież"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <h3>Oczekujące</h3>
            {pending.map(task => (
              <div 
                className="card" 
                key={task.id} 
                style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => setSelectedTask(task)}
              >
                <p style={{ margin: 0 }}>
                  <strong>{task.type || task.title}</strong>
                  {task.firstName && task.lastName && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                      {task.firstName} {task.lastName}
                    </div>
                  )}
                  {task.date && (
                    <div style={{ fontSize: '0.85em', color: '#999', marginTop: 2 }}>
                      {task.date} {task.slot || ''}
                    </div>
                  )}
                </p>
                <button
                  className="btn-gold"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToInProgress(task);
                  }}
                  style={{ marginTop: 8 }}
                >
                  W toku →
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3>W toku</h3>
            {inProgress.map(task => (
              <div 
                className="card" 
                key={task.id} 
                style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => setSelectedTask(task)}
              >
                <p style={{ margin: 0 }}>
                  <strong>{task.type || task.title}</strong>
                  {task.firstName && task.lastName && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                      {task.firstName} {task.lastName}
                    </div>
                  )}
                  {task.date && (
                    <div style={{ fontSize: '0.85em', color: '#999', marginTop: 2 }}>
                      {task.date} {task.slot || ''}
                    </div>
                  )}
                </p>
                <button
                  className="btn-gold"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToCompleted(task);
                  }}
                  style={{ marginTop: 8 }}
                >
                  Zakończ →
                </button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h3>Zakończone</h3>
            {completed.map(task => (
              <div 
                className="card" 
                key={task.id} 
                style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => setSelectedTask(task)}
              >
                <p style={{ margin: 0 }}>
                  <strong>{task.type || task.title}</strong>
                  {task.firstName && task.lastName && (
                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
                      {task.firstName} {task.lastName}
                    </div>
                  )}
                  {task.date && (
                    <div style={{ fontSize: '0.85em', color: '#999', marginTop: 2 }}>
                      {task.date} {task.slot || ''}
                    </div>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* detailed task modal */}
        {selectedTask && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setSelectedTask(null)}
          >
            <div 
              className="card"
              style={{
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedTask(null)}
              >
                ×
              </button>
              <h3>{selectedTask.title || selectedTask.type || "Szczegóły sprawy"}</h3>
              <div style={{ marginBottom: 8 }}>
                <strong>Status:</strong> {selectedTask.status || "pending"}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Klient:</strong> {selectedTask.firstName} {selectedTask.lastName}
              </div>
              {selectedTask.date && (
                <div style={{ marginBottom: 15 }}>
                  <strong>Rezerwacja:</strong> {selectedTask.date} {selectedTask.slot}
                </div>
              )}
              {selectedTask.description && (
                <div style={{ marginBottom: 15 }}>
                  <strong>Opis sprawy:</strong>
                  <p style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{selectedTask.description}</p>
                </div>
              )}
              {selectedTask.budget && (
                <div style={{ marginBottom: 15 }}>
                  <strong>Budżet:</strong> {selectedTask.budget} zł
                </div>
              )}
              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div style={{ marginBottom: 15 }}>
                  <strong>Załączniki:</strong>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                    {selectedTask.attachments.map((att, idx) => (
                      <li key={idx}>{att}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                {selectedTask.status === 'pending' && (
                  <button
                    className="btn-gold"
                    onClick={async () => {
                      await moveToInProgress(selectedTask);
                      setSelectedTask(null);
                    }}
                  >
                    Przenieś do 'W toku'
                  </button>
                )}
                {selectedTask.status === 'inProgress' && (
                  <button
                    className="btn-gold"
                    onClick={async () => {
                      await moveToCompleted(selectedTask);
                      setSelectedTask(null);
                    }}
                  >
                    Przenieś do 'Zakończone'
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        </>
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
        <div style={{ maxWidth: "500px" }}>
          <h3>Podgląd profilu</h3>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={user?.avatar || "https://via.placeholder.com/120"}
              alt="avatar"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }}
            />
            <h4 style={{ marginTop: 10 }}>{user?.firstName} {user?.lastName}</h4>
          </div>
          {user?.specialization && user.specialization.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <strong>Specjalizacje:</strong> {user.specialization.join(', ')}
            </div>
          )}
          {user?.description && (
            <div style={{ marginBottom: 10 }}>
              <strong>Opis:</strong>
              <p style={{ margin: '4px 0' }}>{user.description}</p>
            </div>
          )}
          {user?.location && (
            <div style={{ marginBottom: 10 }}>
              <strong>Lokalizacja:</strong> {user.location}
            </div>
          )}
          {user?.lawFirm && (
            <div style={{ marginBottom: 10 }}>
              <strong>Kancelaria:</strong> {user.lawFirm}
            </div>
          )}
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
