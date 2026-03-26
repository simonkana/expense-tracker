// client/src/types.ts
// In a real monorepo you'd share these directly from the server package.
// For now we duplicate them — but they live in one place on each side.

export type Category = "food" | "transport" | "utilities" | "entertainment" | "other";

export interface Expense {
    id: number;
    description: string;
    amount: number;
    category: Category;
    date: string;
    createdAt: string;
}

export interface CreateExpenseInput {
    description: string;
    amount: number;
    category: Category;
    date: string;
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export interface ApiError {
    error: string;
    details?: { field: string; message: string }[];
}