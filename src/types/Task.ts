export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  completed: boolean;
  priority?: number; // 1 (high) - 5 (low)
  tags?: string[];
  createdAt: string;
  assignedTo?: string;
}