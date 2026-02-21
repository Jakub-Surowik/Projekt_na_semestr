// helpers for persisting tasks per lawyer
export const loadTasks = () => {
  try {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  } catch {
    return [];
  }
};

export const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const getUserTasks = (email) => {
  const tasks = loadTasks();
  return tasks.filter(t => t.lawyerEmail === email);
};

export const addTask = (task) => {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
};

export const updateTask = (updated) => {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === updated.id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updated };
    saveTasks(tasks);
  }
};

export const deleteTask = (id) => {
  const tasks = loadTasks().filter(t => t.id !== id);
  saveTasks(tasks);
};
