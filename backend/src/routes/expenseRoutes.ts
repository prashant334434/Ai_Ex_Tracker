import { Router, Request, Response } from 'express';
import { parseExpense } from '../services/aiService';
import { createExpense, getAllExpenses, deleteExpense, getExpenseById } from '../database/db';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/expenses  —  add a new expense via natural-language input
// ---------------------------------------------------------------------------
router.post('/', async (req: Request, res: Response) => {
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
    const parsed = await parseExpense(input.trim());

    // --- persist ----------------------------------------------------------
    const expense = createExpense({
      amount: parsed.amount,
      currency: parsed.currency,
      category: parsed.category,
      description: parsed.description,
      merchant: parsed.merchant,
      original_input: input.trim(),
    });

    return res.status(201).json({ success: true, expense });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return res.status(400).json({ success: false, error: message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/expenses  —  return all expenses, newest first
// ---------------------------------------------------------------------------
router.get('/', (_req: Request, res: Response) => {
  try {
    const expenses = getAllExpenses();
    return res.status(200).json({ success: true, expenses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return res.status(500).json({ success: false, error: message });
  }
});

// ---------------------------------------------------------------------------
// DELETE /api/expenses/:id  —  remove an expense by id
// ---------------------------------------------------------------------------
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid expense ID' });
    }

    // Check existence first so we can return a meaningful 404
    const existing = getExpenseById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    deleteExpense(id);
    return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return res.status(500).json({ success: false, error: message });
  }
});

export default router;
