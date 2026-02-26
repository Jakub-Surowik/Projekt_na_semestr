import React, { useState, useEffect } from "react";
import IntakeForm from "../pages/IntakeForm";
import { getUserTasks, addTask } from "../utils/tasksStorage";

export default function LawyerProfileView({ user, onClose }) {
  // generate slots for weekdays and manage navigation by 6-day groups
  const slots = ["9:00-11:00", "11:00-13:00", "13:00-15:00"];

  const generateSixDays = (groupOffset) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const dates = [];
    let currentDate = new Date(now);
    let daysAdded = 0;
    
    // Skip to the correct group (each group is 6 working days)
    if (groupOffset > 0) {
      currentDate.setDate(currentDate.getDate() + groupOffset * 6);
    }
    
    // Collect 6 working days (Mon-Fri)
    while (daysAdded < 6) {
      const day = currentDate.getDay(); // 0 Sunday, 1 Monday...
      if (day >= 1 && day <= 5) { // Mon-Fri only
        dates.push(new Date(currentDate));
        daysAdded++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const [appointments, setAppointments] = useState([]); // array of {date: 'YYYY-MM-DD', slot}
  const [groupOffset, setGroupOffset] = useState(0); // 0 = this week's 6 days

  // load existing bookings (from tasks) for this lawyer
  useEffect(() => {
    const load = async () => {
      const tasks = await getUserTasks(user.email);
      const book = tasks.filter(t => t.date && t.slot).map(t => ({ date: t.date, slot: t.slot }));
      setAppointments(book);
    };
    load();
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15, marginBottom: 10 }}>
        <button
          onClick={() => setGroupOffset(g => Math.max(0, g - 1))}
          disabled={groupOffset === 0}
          style={{
            background: groupOffset === 0 ? '#ccc' : '#b8860b',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            fontSize: 24,
            cursor: groupOffset === 0 ? 'not-allowed' : 'pointer',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            flexShrink: 0,
            marginTop: 32
          }}
        >◀</button>
        
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 'bold', textAlign: 'center', display: 'block', marginBottom: 10 }}>
            {(() => {
              const dates = generateSixDays(groupOffset);
              if (dates.length === 0) return '';
              const firstDate = dates[0];
              const lastDate = dates[dates.length - 1];
              return `${firstDate.toLocaleDateString('pl-PL')} - ${lastDate.toLocaleDateString('pl-PL')}`;
            })()}
          </span>
          <div className="calendar-wrapper" style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr>
                <th></th>
                {generateSixDays(groupOffset).map(d => (
                  <th key={d.toISOString()} style={{ padding: 8, border: "1px solid #ddd" }}>
                    <div style={{ fontWeight: 'bold' }}>{d.toLocaleDateString('pl-PL', { weekday: 'short' })}</div>
                    <div>{d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{slot}</td>
                  {generateSixDays(groupOffset).map(d => {
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
        </div>
        
        <button
          onClick={() => setGroupOffset(g => Math.min(60, g + 1))}
          disabled={groupOffset >= 60}
          style={{
            background: groupOffset >= 60 ? '#ccc' : '#b8860b',
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            fontSize: 24,
            cursor: groupOffset >= 60 ? 'not-allowed' : 'pointer',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            flexShrink: 0,
            marginTop: 32
          }}
        >▶</button>
      </div>

      {/* booking request form modal */}
      {bookingRequest && (
        <IntakeForm
          initialDate={bookingRequest.date}
          initialSlot={bookingRequest.slot}
          lawyerEmail={user.email}
          onClose={() => setBookingRequest(null)}
          onSubmit={async (data) => {
            // create a task with the provided data
            const newTask = {
              id: Date.now(),
              lawyerEmail: data.lawyerEmail,
              firstName: data.firstName,
              lastName: data.lastName,
              title: `${data.type} – ${data.firstName} ${data.lastName}`,
              status: "pending",
              date: data.date,
              slot: data.slot,
              type: data.type,
              description: data.description,
              budget: data.budget
            };
            await addTask(newTask);
            setAppointments(prev => [...prev, { date: data.date, slot: data.slot }]);
            setBookingRequest(null);
          }}
        />
      )}
    </div>
  );
}
