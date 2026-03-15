import { useState } from "react";
import { addTask } from "../utils/tasksStorage";

export default function IntakeForm({ initialDate, initialSlot, lawyerEmail, onSubmit, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const data = {
      firstName,
      lastName,
      type,
      description,
      budget,
      date: initialDate || null,
      slot: initialSlot || null,
      lawyerEmail: lawyerEmail || null,
      attachments: files.map(f => f.name)
    };
    if (onSubmit) {
      await onSubmit(data);
    } else {
      const task = {
        id: Date.now(),
        lawyerEmail: data.lawyerEmail,
        title: `${data.type || "Zapytanie"} – ${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        status: "pending",
        date: data.date,
        slot: data.slot,
        type: data.type,
        description: data.description,
        budget: data.budget,
        attachments: files.map(f => f.name)
      };
      await addTask(task);
      setSubmitted(true);
    }
    if (onClose) onClose();
  };

  const formMarkup = (
    <form onSubmit={handleSubmitForm}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Imię
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Twoje imię"
          required
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
          Nazwisko
        </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Twoje nazwisko"
          required
        />
      </div>

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
          <option value="sprawa karna">sprawa karna</option>
          <option value="sprawa cywilna">sprawa cywilna</option>
          <option value="sprawa rodzinna">sprawa rodzinna</option>
          <option value="sprawa pracy">sprawa pracy</option>
          <option value="sprawa nieruchomości">sprawa nieruchomości</option>
          <option value="inne">inne</option>
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
            <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 20, borderLeft: '4px solid #b8860b' }}>
              <strong>Rezerwacja:</strong> {initialDate} {initialSlot}
            </div>
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
