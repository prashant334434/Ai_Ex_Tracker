"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiService_1 = require("../services/aiService");
const db_1 = require("../database/db");
const router = (0, express_1.Router)();
// ---------------------------------------------------------------------------
// POST /api/expenses  —  add a new expense via natural-language input
// ---------------------------------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const { input } = req.body;
        // --- input validation -------------------------------------------------
        if (!input || typeof input !== 'string' || input.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Input is required. Describe your expense in plain English.',
            });
        }
        // --- AI parsing -------------------------------------------------------
        const parsed = await (0, aiService_1.parseExpense)(input.trim());
        // --- persist ----------------------------------------------------------
        const expense = (0, db_1.createExpense)({
            amount: parsed.amount,
            currency: parsed.currency,
            category: parsed.category,
            description: parsed.description,
            merchant: parsed.merchant,
            original_input: input.trim(),
        });
        return res.status(201).json({ success: true, expense });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        return res.status(400).json({ success: false, error: message });
    }
});
// ---------------------------------------------------------------------------
// GET /api/expenses  —  return all expenses, newest first
// ---------------------------------------------------------------------------
router.get('/', (_req, res) => {
    try {
        const expenses = (0, db_1.getAllExpenses)();
        return res.status(200).json({ success: true, expenses });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        return res.status(500).json({ success: false, error: message });
    }
});
// ---------------------------------------------------------------------------
// DELETE /api/expenses/:id  —  remove an expense by id
// ---------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, error: 'Invalid expense ID' });
        }
        // Check existence first so we can return a meaningful 404
        const existing = (0, db_1.getExpenseById)(id);
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Expense not found' });
        }
        (0, db_1.deleteExpense)(id);
        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        return res.status(500).json({ success: false, error: message });
    }
});
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map