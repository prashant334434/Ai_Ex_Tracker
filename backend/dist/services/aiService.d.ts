export interface ParsedExpense {
    amount: number;
    currency: string;
    category: string;
    description: string;
    merchant: string | null;
}
/**
 * Send free-text input to Groq, parse the JSON response, and validate it.
 * Returns a ParsedExpense on success.
 * Throws a descriptive Error on failure.
 */
export declare function parseExpense(text: string): Promise<ParsedExpense>;
//# sourceMappingURL=aiService.d.ts.map