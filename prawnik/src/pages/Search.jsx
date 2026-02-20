export default function Search() {
  return (
    <>
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Znajdź Prawnika</h2>

        <div className="card" style={{ margin: "30px 0", maxWidth: "800px", margin: "30px auto" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input 
              placeholder="Specjalizacja" 
              style={{ flex: 1, minWidth: "200px" }}
            />
            <input 
              placeholder="Lokalizacja"
              style={{ flex: 1, minWidth: "200px" }}
            />
            <select style={{ minWidth: "150px" }}>
              <option>-- Forma --</option>
              <option>Online</option>
              <option>Stacjonarnie</option>
              <option>Oba</option>
            </select>
            <button className="btn-gold" style={{ minWidth: "120px" }}>
              Szukaj
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: "600px", margin: "20px auto" }}>
          <h3>Mec. Anna Nowak</h3>
          <p>Prawo cywilne</p>
          <p className="gold-text" style={{ fontSize: "18px", fontWeight: "600" }}>Od 300 zł</p>
        </div>
      </div>
    </>
  );
}
