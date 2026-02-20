// Simple helpers for managing localStorage users and session
export const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
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

export const updateUser = (updated, oldEmail) => {
  const users = loadUsers();
  // if email changed, look up by oldEmail first
  const matchEmail = oldEmail || updated.email;
  const idx = users.findIndex((u) => u.email === matchEmail);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updated };
    saveUsers(users);
  }
};

export const deleteUser = (email) => {
  const users = loadUsers().filter((u) => u.email !== email);
  saveUsers(users);
};
