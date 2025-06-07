# 🚀 Deploying and Upgrading Your Futuristic AI TO-DO App

## 1. Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start local server:**
   ```bash
   npm start
   ```
   Visit [http://localhost:3000](http://localhost:3000).

---

## 2. Production Deployment

### Option 1: Vercel (Recommended)

- [Sign up](https://vercel.com/) and connect your GitHub repo.
- Click “Import Project”, pick your repo, and follow prompts.
- Vercel auto-detects React/TypeScript; just hit “Deploy”.

### Option 2: Netlify

- [Sign up](https://app.netlify.com/) and link your GitHub repo.
- Set build command: `npm run build`
- Set publish directory: `build`
- Click “Deploy”.

### Option 3: Manual (for any static host)

1. **Build static files:**
   ```bash
   npm run build
   ```
2. **Upload the `build/` folder to your static host (e.g., GitHub Pages, Firebase Hosting, S3/CloudFront, etc.)**

---

## 3. Adding a Real AI Backend

### Prerequisites

- [OpenAI API Key](https://platform.openai.com/)
- Node.js backend (for secure API calls)
- [Express](https://expressjs.com/) or any lightweight Node.js framework

---

### A. Backend: Minimal Express + OpenAI Proxy

```typescript name=server/index.ts
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

// Parse natural language to task
app.post("/api/parse", async (req, res) => {
  const { input } = req.body;
  const prompt = `Extract the main task from this user input, and suggest a title and (if possible) due date:\n"${input}"`;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
  });
  const aiText = completion.data.choices[0].message?.content || "";
  // Basic parsing; in production, use structured output (function calling or JSON mode).
  res.json({ aiText });
});

// Suggest tasks
app.post("/api/suggest", async (req, res) => {
  const { existingTasks } = req.body;
  const prompt = `Given my current tasks:\n${JSON.stringify(
    existingTasks
  )}\nSuggest one helpful new to-do item. Give just a short title.`;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
  });
  const aiText = completion.data.choices[0].message?.content || "";
  res.json({ aiText });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("AI backend listening on", PORT));
```

**.env:**
```
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

**Install dependencies in `server/`:**
```bash
npm install express cors openai
npm install --save-dev @types/express @types/cors
```

---

### B. Frontend: Connect to AI Backend

#### Update AI utility files:

```typescript name=src/ai/parseNaturalInput.ts
export async function parseNaturalInput(input: string): Promise<{ title: string, dueDate?: string }> {
  const response = await fetch("http://localhost:4000/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  const data = await response.json();
  // Parse aiText for title and dueDate (ideally, use function-calling or JSON mode for structured response)
  // For demo: assume aiText is "Title: ... Due: ...", you should parse accordingly.
  const match = data.aiText.match(/Title:\s*(.+?)(?:\s*Due: (.+))?$/i);
  return {
    title: match?.[1] || input,
    dueDate: match?.[2],
  };
}
```

```typescript name=src/ai/suggestTasks.ts
export async function suggestTasks(existingTasks: any[]): Promise<any[]> {
  const response = await fetch("http://localhost:4000/api/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ existingTasks }),
  });
  const data = await response.json();
  // For demo, aiText is a string title
  return [{
    id: `ai-${Date.now()}`,
    title: data.aiText,
    completed: false,
    createdAt: new Date().toISOString(),
    priority: 2,
    tags: ['ai-suggested']
  }];
}
```

#### Update Component Usage

Because parseNaturalInput is now async:

```typescript name=src/components/AddTask.tsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { parseNaturalInput } from "../ai/parseNaturalInput";
import { Task } from "../types/Task";

const AddTask: React.FC<{ onAdd: (task: Task) => void }> = ({ onAdd }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const parsed = await parseNaturalInput(input);
    onAdd({
      id: uuidv4(),
      title: parsed.title || input,
      dueDate: parsed.dueDate,
      createdAt: new Date().toISOString(),
      completed: false
    });
    setInput("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        placeholder="e.g., Remind me to call John tomorrow"
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ flex: 1 }}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add"}</button>
    </form>
  );
};

export default AddTask;
```

---

## 4. Security Best Practices

- **Never expose your OpenAI API key in frontend code!**
- Always use a backend to proxy requests.

---

## 5. Optional: Deploying the Backend

- Deploy your Express backend to [Render](https://render.com/), [Railway](https://railway.app/), or [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions/).
- Update your frontend AI utility URLs to point to the deployed backend.

---

## 6. Example Repo Structure

```
futuristic-todo-ai/
├── server/                  # Node.js AI backend
│   ├── index.ts
│   └── ...
├── src/                     # React frontend (as before)
├── public/
├── package.json
└── ...
```

---

## 7. Going Further

- Use [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling) for structured output.
- Add authentication for multi-user support.
- Use a database (e.g., MongoDB, Postgres) to persist tasks.

---

**Have fun building your AI-powered productivity app! 🚀**