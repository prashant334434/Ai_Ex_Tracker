"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./database/db");
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT ?? "3000", 10);
// ---------------------------------------------------------------------------
// App bootstrap
// ---------------------------------------------------------------------------
const app = (0, express_1.default)();
// --- middleware -------------------------------------------------------------
app.use((0, cors_1.default)()); // allow all origins (fine for dev)
app.use(express_1.default.json()); // parse JSON bodies
// --- health check ----------------------------------------------------------
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// --- routes ----------------------------------------------------------------
app.use("/api/expenses", expenseRoutes_1.default);
// ---------------------------------------------------------------------------
// Database init  +  listen
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Database init  +  listen
// ---------------------------------------------------------------------------
try {
    (0, db_1.initializeDatabase)();
    console.log("✅ Database initialised");
}
catch (err) {
    console.error("❌ Database init failed:", err);
    process.exit(1);
}
// Catch any unhandled promise rejections so they don't silently swallow
process.on("unhandledRejection", (reason) => {
    console.error("⚠️  Unhandled rejection:", reason);
});
app.listen(PORT, () => {
    console.log(`🚀 AI Expense Tracker backend running on http://localhost:${PORT}`);
    console.log(`   Health check:  GET  /health`);
    console.log(`   Add expense:   POST /api/expenses`);
    console.log(`   List:          GET  /api/expenses`);
    console.log(`   Delete:        DELETE /api/expenses/:id`);
});
exports.default = app;
//# sourceMappingURL=index.js.map