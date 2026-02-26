// Simple helpers for managing users and session with backend fallback
const API = "/api/users";

export const loadUsers = async () => {
  try {
    const res = await fetch(API);
    if (res.ok) return await res.json();
  } catch (e) {}
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
};

export const saveUsers = async (users) => {
  try {
    await fetch(API + "/bulk", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(users),
    });
  } catch (e) {}
  localStorage.setItem("users", JSON.stringify(users));
};

export const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch {
    return null;
  }
};

export const removeCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

export const updateUser = async (updated, oldEmail) => {
  try {
    await fetch(`${API}/${oldEmail || updated.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  } catch (e) {}
  // local fallback
  const users = await loadUsers();
  const matchEmail = oldEmail || updated.email;
  const idx = users.findIndex((u) => u.email === matchEmail);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updated };
    saveUsers(users);
  }
};

export const deleteUser = async (email) => {
  try {
    await fetch(`${API}/${email}`, { method: "DELETE" });
  } catch (e) {}
  const users = (await loadUsers()).filter((u) => u.email !== email);
  saveUsers(users);
};
