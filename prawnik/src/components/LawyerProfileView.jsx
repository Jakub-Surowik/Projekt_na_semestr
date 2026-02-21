import React, { useState, useEffect } from "react";
import IntakeForm from "../pages/IntakeForm";
import { getUserTasks, addTask } from "../utils/tasksStorage";

export default function LawyerProfileView({ user, onClose }) {
  // generate slots for weekdays and manage month navigation
  const slots = ["9:00-11:00", "11:00-13:00", "13:00-15:00"];

  const generateDatesForMonth = (offset) => {
    const now = new Date();
    const m = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const dates = [];
    while (m.getMonth() === now.getMonth() + offset) {
      const day = m.getDay(); // 0 Sunday, 1 Monday...
      if (day >= 1 && day <= 5) { // Mon-Fri
        dates.push(new Date(m));
      }
      m.setDate(m.getDate() + 1);
    }
    return dates;
  };

  const [appointments, setAppointments] = useState([]); // array of {date: 'YYYY-MM-DD', slot}
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month

  // load existing bookings (from tasks) for this lawyer
  useEffect(() => {
    const tasks = getUserTasks(user.email);
    const book = tasks.filter(t => t.date && t.slot).map(t => ({ date: t.date, slot: t.slot }));
    setAppointments(book);
  }, [user]);

  const [bookingRequest, setBookingRequest] = useState(null);

  const handleBook = (date, slot) => {
    const already = appointments.find(a => a.date === date && a.slot === slot);
    if (already) return;
    // open the intake form modal with the chosen slot
    setBookingRequest({ date, slot });
  };

  const isBooked = (date, slot) => appointments.some(a => a.date === date && a.slot === slot);

  return (
    <div className="lawyer-profile-view" style={{ padding: 20, background: "white", borderRadius: 12, maxWidth: 800, margin: "20px auto", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
      <button onClick={onClose} style={{ float: "right", background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src={user?.avatar || "https://via.placeholder.com/200x120"}
          alt="avatar"
          style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }}
        />
        <h2 style={{ marginTop: 10 }}>{user?.firstName} {user?.lastName}</h2>
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
        <div style={{ marginBottom: 20 }}>
          <strong>Kancelaria:</strong> {user.lawFirm}
        </div>
      )}

      <h3>Kalendarz</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 10 }}>
        <button
          onClick={() => setMonthOffset(m => Math.max(0, m - 1))}
          disabled={monthOffset === 0}
          className="btn-gold"
        >◀</button>
        <span style={{ fontWeight: 'bold' }}>{new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button
          onClick={() => setMonthOffset(m => Math.min(2, m + 1))}
          disabled={monthOffset === 2}
          className="btn-gold"
        >▶</button>
      </div>
      <div className="calendar-wrapper" style={{ width: "100%", overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: "600px" }}>
        <thead>
          <tr>
            <th></th>
            {generateDatesForMonth(monthOffset).map(d => (
              <th key={d.toISOString()} style={{ padding: 8, border: "1px solid #ddd" }}>
                {d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric', weekday: 'short' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot}>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>{slot}</td>
              {generateDatesForMonth(monthOffset).map(d => {
                const dateStr = d.toISOString().split('T')[0];
                return (
                  <td key={dateStr + slot} style={{ padding: 8, border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      disabled={isBooked(dateStr, slot)}
                      onClick={() => handleBook(dateStr, slot)}
                      className="btn-gold"
                      style={{ padding: "6px 12px", fontSize: 12 }}
                    >
                      {isBooked(dateStr, slot) ? "Zarezerwowane" : "Rezerwuj"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* booking request form modal */}
      {bookingRequest && (
        <IntakeForm
          initialDate={bookingRequest.date}
          initialSlot={bookingRequest.slot}
          lawyerEmail={user.email}
          onClose={() => setBookingRequest(null)}
          onSubmit={(data) => {
            // create a task with the provided data
            const newTask = {
              id: Date.now(),
              lawyerEmail: data.lawyerEmail,
              title: data.type
                ? `${data.type} ${data.date || ''} ${data.slot || ''}`.trim()
                : `Spotkanie ${data.date} ${data.slot}`,
              status: "pending",
              date: data.date,
              slot: data.slot,
              description: data.description,
              budget: data.budget
            };
            addTask(newTask);
            setAppointments(prev => [...prev, { date: data.date, slot: data.slot }]);
            setBookingRequest(null);
          }}
        />
      )}
    </div>
  );
}
