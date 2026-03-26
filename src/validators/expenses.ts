import { z } from "zod";

export const createExpenseSchema = z.object({
    description: z.string().min(1, "Description is required").max(100),
    amount: z.number().positive("Amount must be greater than zero"),
    category: z.enum(["food", "transport", "utilities", "entertainment", "other"]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const idParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;