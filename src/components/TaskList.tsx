import React from "react";
import { Task } from "../types/Task";

const TaskList: React.FC<{
  tasks: Task[];
  onUpdate: (id: string, update: Partial<Task>) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}> = ({ tasks, onUpdate, onDelete, readOnly }) => (
  <ul>
    {tasks.map(task => (
      <li key={task.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        {!readOnly && (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onUpdate(task.id, { completed: !task.completed })}
            style={{ marginRight: 8 }}
          />
        )}
        <span style={{ textDecoration: task.completed ? "line-through" : undefined, flex: 1 }}>
          {task.title}
        </span>
        {!readOnly && (
          <button onClick={() => onDelete(task.id)} style={{ marginLeft: 8 }}>
            ❌
          </button>
        )}
      </li>
    ))}
  </ul>
);

export default TaskList;