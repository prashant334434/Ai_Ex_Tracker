"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getDb = getDb;
exports.createExpense = createExpense;
exports.getExpenseById = getExpenseById;
exports.getAllExpenses = getAllExpenses;
exports.deleteExpense = deleteExpense;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
let db = null;
const DB_PATH = "expenses.db";
// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
// ---------------------------------------------------------------------------
// Initialisation – creates table if missing
// ---------------------------------------------------------------------------
function initializeDatabase() {
    if (db)
        return;
    db = new better_sqlite3_1.default(DB_PATH);
    db.prepare(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      note TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}
function getDb() {
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
}
// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------
/** Insert a new expense and return it with the generated id + created_at. */
function createExpense(input) {
    const stmt = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    const result = stmt.run(input.amount, input.currency, input.category, input.description, input.merchant ?? null, input.original_input);
    return getExpenseById(Number(result.lastInsertRowid));
}
/** Fetch a single expense by primary-key. */
function getExpenseById(id) {
    return db.prepare("SELECT * FROM expenses WHERE id = ?").get(id);
}
/** Return every expense, newest first. */
function getAllExpenses() {
    return db
        .prepare("SELECT * FROM expenses ORDER BY created_at DESC")
        .all();
}
/** Remove an expense by id.  Returns true when a row was actually deleted. */
function deleteExpense(id) {
    const result = db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
    return result.changes > 0;
}
exports.default = db;
//# sourceMappingURL=db.js.map