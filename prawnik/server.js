const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const tasksFile = path.join(dataDir, 'tasks.json');

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// users endpoints
app.get('/api/users', (req, res) => {
  res.json(readJson(usersFile));
});

app.post('/api/users', (req, res) => {
  const users = readJson(usersFile);
  users.push(req.body);
  writeJson(usersFile, users);
  res.json(req.body);
});

app.put('/api/users/:email', (req, res) => {
  const users = readJson(usersFile);
  const idx = users.findIndex(u => u.email === req.params.email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...req.body };
    writeJson(usersFile, users);
    res.json(users[idx]);
  } else {
    res.status(404).send('not found');
  }
});

app.delete('/api/users/:email', (req, res) => {
  const users = readJson(usersFile).filter(u => u.email !== req.params.email);
  writeJson(usersFile, users);
  res.status(204).end();
});

app.put('/api/users/bulk', (req, res) => {
  writeJson(usersFile, req.body);
  res.json(req.body);
});

// tasks endpoints
app.get('/api/tasks', (req, res) => {
  res.json(readJson(tasksFile));
});

app.post('/api/tasks', (req, res) => {
  const tasks = readJson(tasksFile);
  tasks.push(req.body);
  writeJson(tasksFile, tasks);
  res.json(req.body);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readJson(tasksFile);
  const idx = tasks.findIndex(t => t.id === Number(req.params.id) || t.id === req.params.id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...req.body };
    writeJson(tasksFile, tasks);
    res.json(tasks[idx]);
  } else {
    res.status(404).send('not found');
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readJson(tasksFile).filter(t => t.id !== Number(req.params.id) && t.id !== req.params.id);
  writeJson(tasksFile, tasks);
  res.status(204).end();
});

app.put('/api/tasks/bulk', (req, res) => {
  writeJson(tasksFile, req.body);
  res.json(req.body);
});

// static serve build if exists (optional)
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
