import { useState } from "react";
import { addTask } from "../utils/tasksStorage";

export default function IntakeForm({ initialDate, initialSlot, lawyerEmail, onSubmit, onClose }) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const data = {
      type,
      description,
      budget,
      date: initialDate || null,
      slot: initialSlot || null,
      lawyerEmail: lawyerEmail || null,
    };
    if (onSubmit) {
      onSubmit(data);
    } else {
      const task = {
        id: Date.now(),
        lawyerEmail: data.lawyerEmail,
        title: `${data.type || "Zapytanie"}${data.date ? " " + data.date + " " + data.slot : ""}`.trim(),
        status: "pending",
        date: data.date,
        slot: data.slot,
        description: data.description,
        budget: data.budget,
        attachments: files.map(f => f.name)
      };
      addTask(task);
      setSubmitted(true);
    }
    if (onClose) onClose();
  };

  const formMarkup = (
    <form onSubmit={handleSubmitForm}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Typ sprawy
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">-- Wybierz typ sprawy --</option>
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opisz szczegóły sprawy, jakie są strony, o co chodzi..."
          required
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Załączniki
        </label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Budżet
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="np. 500 zł"
          min="0"
          step="50"
        />
      </div>

      <button className="btn-gold" style={{ width: "100%" }}>
        Wyślij zapytanie
      </button>
    </form>
  );

  if (submitted && !onSubmit) {
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Zlecenie wysłane</h2>
        <p>Dziękujemy za przesłanie zapytania. Prawnik otrzyma je w swoim panelu.</p>
      </div>
    );
  }

  if (onClose) {
    return (
      <div className="auth-modal-overlay">
        <div className="auth-modal" style={{ maxWidth: "600px" }}>
          <button className="auth-modal-close" onClick={onClose}>
            ×
          </button>
          <h2 className="gold-text">Nowe Zlecenie</h2>
          {initialDate && (
            <p>
              Rezerwacja: {initialDate} {initialSlot}
            </p>
          )}
          {formMarkup}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ padding: "60px 0" }}>
        <h2 className="gold-text">Nowe Zlecenie</h2>

        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {initialDate && (
            <p>
              Rezerwacja: {initialDate} {initialSlot}
            </p>
          )}
          {formMarkup}
        </div>
      </div>
    </>
  );
}
