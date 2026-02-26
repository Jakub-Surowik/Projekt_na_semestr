// helpers for persisting tasks per lawyer
// fallback to localStorage if backend unavailable

const API = "/api/tasks";

export const loadTasks = async () => {
  try {
    const res = await fetch(API);
    if (res.ok) return await res.json();
  } catch (e) {
    // network failed, ignore
  }
  try {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  } catch {
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await fetch(API + "/bulk", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tasks),
    });
  } catch (e) {
    // ignore
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const getUserTasks = async (email) => {
  const tasks = await loadTasks();
  return tasks.filter((t) => t.lawyerEmail === email);
};

export const addTask = async (task) => {
  const tasks = await loadTasks();
  tasks.push(task);
  await saveTasks(tasks);
};

export const updateTask = async (updated) => {
  const tasks = await loadTasks();
  const idx = tasks.findIndex((t) => t.id === updated.id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updated };
    await saveTasks(tasks);
  }
};

export const deleteTask = async (id) => {
  const tasks = (await loadTasks()).filter((t) => t.id !== id);
  await saveTasks(tasks);
};
