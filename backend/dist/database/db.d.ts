import type { Database as BetterSqliteDatabase } from "better-sqlite3";
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
declare const db: BetterSqliteDatabase;
export declare function initializeDatabase(): void;
/** Insert a new expense and return it with the generated id + created_at. */
export declare function createExpense(input: ExpenseInput): Expense;
/** Fetch a single expense by primary-key. */
export declare function getExpenseById(id: number): Expense | undefined;
/** Return every expense, newest first. */
export declare function getAllExpenses(): Expense[];
/** Remove an expense by id.  Returns true when a row was actually deleted. */
export declare function deleteExpense(id: number): boolean;
export default db;
//# sourceMappingURL=db.d.ts.map