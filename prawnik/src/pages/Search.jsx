import { useState, useEffect } from "react";
import { loadUsers } from "../utils/userStorage";
import LawyerProfileView from "../components/LawyerProfileView";

export default function Search() {
  const [lawyers, setLawyers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const all = loadUsers();
    setLawyers(all.filter(u => u.isLawyer));
  }, []);


  return (
    <>
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Znajdź Prawnika</h2>

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
