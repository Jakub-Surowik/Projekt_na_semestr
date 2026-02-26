import { useState, useEffect } from "react";
import { loadUsers } from "../utils/userStorage";
import LawyerProfileView from "../components/LawyerProfileView";

export default function Search({ user }) {
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLawyers = async () => {
    setLoading(true);
    // inspect localStorage directly as well
    try {
      const raw = localStorage.getItem('users');
      console.log('localStorage users raw', raw);
    } catch (e) {}
    const all = await loadUsers();
    console.log("loadUsers returned", all);
    setLawyers(all.filter(u => u.isLawyer));
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
  }, [user]);

  return (
    <>
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Znajdź Prawnika</h2>
        
        <div style={{ marginBottom: 20 }}>
          <button 
            className="btn-gold"
            onClick={fetchLawyers}
            disabled={loading}
          >
            {loading ? "Ładuje..." : "Odśwież listę"}
          </button>
        </div>

        {lawyers.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "#666" }}>
            Brak dostępnych prawników. Spróbuj odświeżyć listę.
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginTop: 30 }}>
          {lawyers.map(l => (
            <div
              key={l.email}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(l)}
            >
              <h4>{l.firstName} {l.lastName}</h4>
              {l.specialization && l.specialization.length > 0 && (
                <p style={{ fontSize: 12 }}>{l.specialization.join(', ')}</p>
              )}
            </div>
          ))}
        </div>

        {selected && (
          <LawyerProfileView user={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </>
  );
}
