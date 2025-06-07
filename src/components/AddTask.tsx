import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseNaturalInput } from "../ai/parseNaturalInput";
import { Task } from "../types/Task";

const AddTask: React.FC<{ onAdd: (task: Task) => void }> = ({ onAdd }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const parsed = parseNaturalInput(input);
    onAdd({ ...parsed, id: uuidv4(), title: parsed.title || input, createdAt: new Date().toISOString(), completed: false });
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        placeholder="e.g., Remind me to call John tomorrow"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ flex: 1 }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTask;