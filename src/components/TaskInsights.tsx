import React from "react";
import { Task } from "../types/Task";

const TaskInsights: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  return (
    <div style={{ marginTop: 24, fontSize: 14 }}>
      <b>Insights:</b>
      <div>Completed: {completed} / {total} ({((completed / (total || 1)) * 100).toFixed(0)}%)</div>
      {/* More future insights can go here */}
    </div>
  );
};

export default TaskInsights;