export default function IntakeForm() {
  return (
    <>
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Nowe Zlecenie</h2>

        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Typ sprawy
            </label>
            <select>
              <option>-- Wybierz typ sprawy --</option>
              <option>Pozew o zapłatę</option>
              <option>Sprzeciw od nakazu</option>
              <option>Sprawy rodzinne</option>
              <option>Prawo pracy</option>
              <option>Nieruchomości</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Opis stanu faktycznego
            </label>
            <textarea
              placeholder="Opisz szczegóły sprawy, jakie są strony, o co chodzi..."
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Załączniki
            </label>
            <input type="file" multiple />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Budżet
            </label>
            <input
              type="number"
              placeholder="np. 500 zł"
              min="0"
              step="50"
            />
          </div>

          <button className="btn-gold" style={{ width: "100%" }}>
            Wyślij zapytanie
          </button>
        </div>
      </div>
    </>
  );
}
