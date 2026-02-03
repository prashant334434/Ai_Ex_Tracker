import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/db";
import expenseRoutes from "./routes/expenseRoutes";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
dotenv.config();

const PORT = parseInt(process.env.PORT ?? "3000", 10);

// ---------------------------------------------------------------------------
// App bootstrap
// ---------------------------------------------------------------------------
const app = express();

// --- middleware -------------------------------------------------------------
app.use(cors()); // allow all origins (fine for dev)
app.use(express.json()); // parse JSON bodies

// --- health check ----------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- routes ----------------------------------------------------------------
app.use("/api/expenses", expenseRoutes);

// ---------------------------------------------------------------------------
// Database init  +  listen
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Database init  +  listen
// ---------------------------------------------------------------------------
try {
  initializeDatabase();
  console.log("✅ Database initialised");
} catch (err) {
  console.error("❌ Database init failed:", err);
  process.exit(1);
}

// Catch any unhandled promise rejections so they don't silently swallow
process.on("unhandledRejection", (reason) => {
  console.error("⚠️  Unhandled rejection:", reason);
});

app.listen(PORT, () => {
  console.log(
    `🚀 AI Expense Tracker backend running on http://localhost:${PORT}`,
  );
  console.log(`   Health check:  GET  /health`);
  console.log(`   Add expense:   POST /api/expenses`);
  console.log(`   List:          GET  /api/expenses`);
  console.log(`   Delete:        DELETE /api/expenses/:id`);
});

export default app;
