import { useState, useEffect } from "react";
import { loadUsers } from "../utils/userStorage";
import LawyerProfileView from "../components/LawyerProfileView";

export default function Search({ user }) {
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

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
        
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Szukaj"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: 8 }}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="">Wszystkie zawody</option>
            <option value="Adwokat">Adwokat</option>
            <option value="Radca Prawny">Radca Prawny</option>
            <option value="Notariusz">Notariusz</option>
            <option value="Komornik">Komornik</option>
          </select>
          <select value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="">Wszystkie specjalizacje</option>
            <option value="sprawa karna">sprawa karna</option>
            <option value="sprawa cywilna">sprawa cywilna</option>
            <option value="sprawa rodzinna">sprawa rodzinna</option>
            <option value="sprawa pracy">sprawa pracy</option>
            <option value="sprawa nieruchomości">sprawa nieruchomości</option>
          </select>
        </div>

        {lawyers.length === 0 && !loading && (
          <p style={{ textAlign: "center", color: "#666" }}>
            Brak dostępnych prawników. Spróbuj odświeżyć listę.
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20, marginTop: 30 }}>
          {lawyers
            .filter((l) => {
              const fullName = `${l.firstName || ""} ${l.lastName || ""}`.toLowerCase();
              const term = searchTerm.trim().toLowerCase();
              if (term && !fullName.includes(term)) return false;
              if (roleFilter && l.role !== roleFilter) return false;
              if (specializationFilter) {
                const specs = Array.isArray(l.specialization) ? l.specialization : [];
                if (!specs.some((s) => s.toLowerCase().includes(specializationFilter.toLowerCase()))) return false;
              }
              return true;
            })
            .map(l => (
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
