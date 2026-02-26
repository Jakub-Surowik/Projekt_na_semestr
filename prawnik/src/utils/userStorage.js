// Simple helpers for managing users and session with backend fallback
const API = process.env.REACT_APP_API_URL || "/api/users";

const apiCall = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API call failed, using localStorage:', e.message);
  }
  return null;
};

export const loadUsers = async () => {
  const result = await apiCall(API);
  if (result) {
    console.log('loadUsers fetched from API', result);
    return result;
  }
  
  try {
    const stored = localStorage.getItem("users");
    console.log('loadUsers fallback localStorage', stored);
    return JSON.parse(stored || "[]");
  } catch (e) {
    console.error('loadUsers parse error', e);
    return [];
  }
};

export const saveUsers = async (users) => {
  console.log('saveUsers storing', users);
  await apiCall(`${API}/bulk`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(users),
  });
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
  await apiCall(`${API}/${oldEmail || updated.email}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  // local fallback
  const users = await loadUsers();
  const matchEmail = oldEmail || updated.email;
  const idx = users.findIndex((u) => u.email === matchEmail);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updated };
    await saveUsers(users);
  }
};

export const deleteUser = async (email) => {
  await apiCall(`${API}/${email}`, { method: "DELETE" });
  const users = (await loadUsers()).filter((u) => u.email !== email);
  await saveUsers(users);
};
