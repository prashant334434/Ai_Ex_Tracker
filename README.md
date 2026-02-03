Got it 👍
Here’s **everything merged into ONE clean, beautiful `README.md` file** — **copy-paste ready**, no extra files needed.

---

```md
::contentReference[oaicite:0]{index=0}

# 💸 AI Expense Tracker

![Expo](https://img.shields.io/badge/Expo-SDK%2051-black?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-TypeScript-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey?logo=sqlite)
![Groq](https://img.shields.io/badge/AI-Groq-purple)
![MIT License](https://img.shields.io/badge/License-MIT-success)

> A full-stack **AI-powered expense tracking app** that converts natural language into structured financial data — instantly.

---

## ✨ Highlights

- 🧠 AI-powered expense parsing using **Groq + LLaMA 3.1**
- ⚡ Log expenses using natural language
- 📱 Cross-platform mobile app (Expo)
- 🗄️ SQLite persistence
- 🧩 Clean, scalable architecture
- 🧪 Deterministic AI output (strict JSON schema)

---

## 🧑‍💻 Author

- **Built by:** Prashant Vashishth
- **GitHub:** _add your GitHub link_
- **Time to build:** ~1.5 hours (with AI assistance 🤖)

---

## 🎥 Demo

_Add your screen recording link here_

---

## 🛠️ Tech Stack

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| 📱 Mobile   | React Native, Expo SDK 51, TypeScript |
| 🖥️ Backend  | Node.js, Express, TypeScript          |
| 🗄️ Database | SQLite (`better-sqlite3`)             |
| 🤖 AI       | Groq API – `llama-3.1-70b-versatile`  |

---

## 🏗️ Architecture
```

User Input: "uber to airport 450"
│
▼
📱 React Native (Expo App)
│
▼ HTTP POST /api/expenses
🖥️ Express Backend
│
├──▶ 🤖 Groq AI API
│ └─ Parses text → JSON
│
└──▶ 🗄️ SQLite Database

````

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
  ```bash
  npm install -g expo-cli
````

- Groq API key → [https://console.groq.com](https://console.groq.com)

---

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add GROQ_API_KEY
npm run dev
```

Verify:

```bash
curl http://localhost:3000/health
```

---

### Mobile (Expo)

```bash
cd mobile
npm install
npm start
```

Scan QR using **Expo Go**.

> **Android emulator:** set
> `BASE_URL = http://10.0.2.2:3000/api`

---

## 📁 Project Structure

```
ai-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/expenseRoutes.ts
│   │   ├── services/aiService.ts
│   │   └── database/db.ts
├── mobile/
│   ├── App.tsx
│   └── src/
│       ├── screens/ExpenseTrackerScreen.tsx
│       ├── components/
│       │   ├── ExpenseItem.tsx
│       │   └── SuccessCard.tsx
│       ├── services/apiService.ts
│       └── types/index.ts
└── README.md
```

---

## 🤖 AI Prompt Design

The system prompt enforces:

1. Extract **amount** as a number
2. Default **currency** to `INR`
3. Map to one of **8 fixed categories**
4. Generate a clean **description**
5. Set **merchant = null** if missing
6. Respond with **JSON only**

**Why this works:**

- Deterministic output (`temperature: 0`)
- Zero hallucinated fields
- Easy backend validation

---

## ⏱️ Time Breakdown

| Task           | Time        |
| -------------- | ----------- |
| Setup          | 5 min       |
| Database       | 5 min       |
| AI service     | 10 min      |
| Backend routes | 15 min      |
| Mobile UI      | 25 min      |
| API service    | 10 min      |
| Testing        | 15 min      |
| README         | 10 min      |
| **Total**      | **~95 min** |

---

## 🔮 Future Enhancements

- ✏️ Edit expenses
- 📶 Offline support
- 📊 Monthly charts
- 💱 Multi-currency
- 🧪 Unit tests
- 🔍 Search & filters

---

## 🧠 AI Tools Used

| Tool   | Purpose                            |
| ------ | ---------------------------------- |
| Claude | Boilerplate, components, debugging |
| Groq   | Expense parsing (LLaMA 3.1)        |

> **Power Statement:**
> _“I design AI features the same way I design APIs — deterministic, validated, and production-safe.”_

---

## 📜 License

MIT — fork, modify, and ship 🚀

```

---

### ✅ This README now:
- Looks **startup-grade**
- Reads well for **recruiters**
- Shows **AI maturity**, not gimmicks
- Works as **assignment + portfolio**

If you want, next we can:
- Add **screenshots with captions**
- Create a **case-study PDF**
- Write a **cover note for 50+ LPA roles**
- Add **API docs section**

Just say 👊
```
