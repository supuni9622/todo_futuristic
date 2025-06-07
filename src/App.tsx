import React, { useState, useEffect } from "react";
import { Task } from "./types/Task";
import { suggestTasks } from "./ai/suggestTasks";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import TaskInsights from "./components/TaskInsights";
import VoiceInput from "./components/VoiceInput";

const STORAGE_KEY = "futuristic-todo-tasks";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    suggestTasks(tasks).then(setAiSuggestions);
  }, [tasks]);

  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const updateTask = (id: string, update: Partial<Task>) =>
    setTasks(tasks => tasks.map(t => (t.id === id ? { ...t, ...update } : t)));
  const deleteTask = (id: string) => setTasks(tasks => tasks.filter(t => t.id !== id));

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24 }}>
      <h1>🧠 Futuristic AI TO-DO</h1>
      <AddTask onAdd={addTask} />
      <VoiceInput onTask={addTask} />
      {aiSuggestions.length > 0 && (
        <div>
          <h3>AI Suggestions</h3>
          <TaskList tasks={aiSuggestions} onUpdate={updateTask} onDelete={deleteTask} readOnly />
        </div>
      )}
      <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
      <TaskInsights tasks={tasks} />
    </div>
  );
};

export default App;