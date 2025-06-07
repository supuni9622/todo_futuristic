import React from "react";
import { v4 as uuidv4 } from "uuid";
import { parseNaturalInput } from "../ai/parseNaturalInput";
import { Task } from "../types/Task";

// Mocked voice input button
const VoiceInput: React.FC<{ onTask: (task: Task) => void }> = ({ onTask }) => {
  const handleVoice = () => {
    // In a real app, use Web Speech API or similar
    const input = window.prompt("Simulate voice input: What would you like to add?");
    if (input) {
      const parsed = parseNaturalInput(input);
      onTask({ ...parsed, id: uuidv4(), title: parsed.title || input, createdAt: new Date().toISOString(), completed: false });
    }
  };

  return (
    <button onClick={handleVoice} style={{ marginBottom: 16 }}>
      🎤 Add via Voice (mock)
    </button>
  );
};

export default VoiceInput;