const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory task storage
let tasks = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List all tasks
app.get('/tasks', (req, res) => {
  res.json({ tasks, count: tasks.length });
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(task);
  res.status(201).json(task);
});

// Get a specific task
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (req.body.title) task.title = req.body.title;
  if (req.body.description) task.description = req.body.description;
  if (req.body.status) task.status = req.body.status;
  task.updatedAt = new Date().toISOString();
  
  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Task API running on port ${PORT}`);
});

module.exports = app;
