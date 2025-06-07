import { Task } from "../types/Task";

// Mocked AI suggestion
export async function suggestTasks(existingTasks: Task[]): Promise<Task[]> {
  // In a real app, call an AI API here
  return [
    {
      id: 'ai-1',
      title: 'Review your schedule for today',
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 2,
      tags: ['review', 'daily']
    }
  ];
}