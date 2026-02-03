import type { Database as BetterSqliteDatabase } from "better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Expense {
  id: number;
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
  original_input: string;
  created_at: string;
}

export interface ExpenseInput {
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
  original_input: string;
}

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------
const DB_PATH = path.resolve(__dirname, "..", "expenses.db");
const db: BetterSqliteDatabase = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ---------------------------------------------------------------------------
// Initialisation – creates table if missing
// ---------------------------------------------------------------------------
export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      amount    REAL    NOT NULL,
      currency  TEXT    NOT NULL DEFAULT 'INR',
      category  TEXT    NOT NULL,
      description TEXT  NOT NULL,
      merchant  TEXT,
      original_input TEXT NOT NULL,
      created_at TEXT   NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

/** Insert a new expense and return it with the generated id + created_at. */
export function createExpense(input: ExpenseInput): Expense {
  const stmt = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.amount,
    input.currency,
    input.category,
    input.description,
    input.merchant ?? null,
    input.original_input,
  ) as { lastInsertRowid: number | bigint };

  return getExpenseById(Number(result.lastInsertRowid))!;
}

/** Fetch a single expense by primary-key. */
export function getExpenseById(id: number): Expense | undefined {
  return db.prepare("SELECT * FROM expenses WHERE id = ?").get(id) as
    | Expense
    | undefined;
}

/** Return every expense, newest first. */
export function getAllExpenses(): Expense[] {
  return db
    .prepare("SELECT * FROM expenses ORDER BY created_at DESC")
    .all() as Expense[];
}

/** Remove an expense by id.  Returns true when a row was actually deleted. */
export function deleteExpense(id: number): boolean {
  const result = db.prepare("DELETE FROM expenses WHERE id = ?").run(id) as {
    changes: number;
  };

  return result.changes > 0;
}

export default db;
