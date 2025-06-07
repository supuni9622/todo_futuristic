import { Task } from "../types/Task";

// Mocked natural language parser
export function parseNaturalInput(input: string): Partial<Task> {
  // In production, call an NLP API here
  // For demo, just use input as title
  return {
    title: input,
    createdAt: new Date().toISOString(),
    completed: false
  };
}