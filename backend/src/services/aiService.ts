import Groq from "groq-sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ParsedExpense {
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
}

interface ParseError {
  error: string;
  amount: null;
}

type AiResponse = ParsedExpense | ParseError;

// ---------------------------------------------------------------------------
// Groq client  (key comes from .env via dotenv, loaded in index.ts)
// ---------------------------------------------------------------------------

const groq = new Groq({
  apiKey: "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",
});

// ---------------------------------------------------------------------------
// System prompt  (verbatim from the assessment spec)
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
3. Categorize into EXACTLY one of these categories:
   - Food & Dining (restaurants, cafes, food delivery, groceries)
   - Transport (uber, ola, taxi, fuel, parking, metro)
   - Shopping (clothes, electronics, amazon, flipkart)
   - Entertainment (movies, netflix, spotify, games)
   - Bills & Utilities (electricity, water, internet, phone)
   - Health (medicine, doctor, gym, pharmacy)
   - Travel (flights, hotels, trips)
   - Other (anything that doesn't fit above)
4. Description should be a clean summary (not the raw input)
5. Merchant is the company/store name if mentioned, null otherwise

RESPOND ONLY WITH VALID JSON, no other text:
{
  "amount": <number>,
  "currency": "<string>",
  "category": "<string>",
  "description": "<string>",
  "merchant": "<string or null>"
}

If the input is invalid or you cannot extract an amount, respond:
{
  "error": "Could not parse expense. Please include an amount.",
  "amount": null
}`;

// ---------------------------------------------------------------------------
// Valid categories – used to validate the AI's reply
// ---------------------------------------------------------------------------
const VALID_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Travel",
  "Other",
];

// ---------------------------------------------------------------------------
// Core function
// ---------------------------------------------------------------------------

/**
 * Send free-text input to Groq, parse the JSON response, and validate it.
 * Returns a ParsedExpense on success.
 * Throws a descriptive Error on failure.
 */
export async function parseExpense(text: string): Promise<ParsedExpense> {
  if (!text || text.trim().length === 0) {
    throw new Error("Could not parse expense. Please include an amount.");
  }

  let rawContent: string;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text.trim() },
      ],
      temperature: 0, // deterministic output
      max_tokens: 256,
    });

    rawContent = response.choices[0]?.message?.content ?? "";
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown Groq API error";
    throw new Error(`AI service error: ${message}`);
  }

  // ---------------------------------------------------------------------------
  // Parse JSON  – strip any accidental markdown fences
  // ---------------------------------------------------------------------------
  let parsed: AiResponse;
  try {
    const cleaned = rawContent
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  // ---------------------------------------------------------------------------
  // Error branch – AI itself decided it couldn't parse
  // ---------------------------------------------------------------------------
  if ("error" in parsed && parsed.error) {
    throw new Error(parsed.error);
  }

  // ---------------------------------------------------------------------------
  // Validate shape
  // ---------------------------------------------------------------------------
  const expense = parsed as ParsedExpense;

  if (
    typeof expense.amount !== "number" ||
    isNaN(expense.amount) ||
    expense.amount <= 0
  ) {
    throw new Error("Could not parse expense. Please include a valid amount.");
  }

  if (!expense.currency || typeof expense.currency !== "string") {
    expense.currency = "INR";
  }

  if (!expense.category || !VALID_CATEGORIES.includes(expense.category)) {
    expense.category = "Other";
  }

  if (!expense.description || typeof expense.description !== "string") {
    expense.description = "Expense";
  }

  // Normalise merchant  – empty string → null
  if (!expense.merchant || expense.merchant.trim() === "") {
    expense.merchant = null;
  }

  return expense;
}
