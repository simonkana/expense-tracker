import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { CreateExpense, expenses } from "../db/schema";
import { AppError } from "../middleware/errorHandler";
import {
    createExpenseSchema,
    updateExpenseSchema,
    idParamSchema,
    type CreateExpenseInput,
    type UpdateExpenseInput,
} from "../validators/expenses";

// Helper - validates params and returns the numeric id, or throws
function parseId(params: Record<string, string>): number {
    const { id } = idParamSchema.parse(params); // throws ZodError if invalid
    return parseInt(id);
}

export async function getAllExpenses(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const all = await db.select().from(expenses);
        res.json(all);
    } catch (err) {
        next(err); // passes error to errorHandler middleware        
    }
}

export async function getExpenseById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = parseId(req.params);
        const result = await db.select().from(expenses).where(eq(expenses.id, id));

        if (result.length === 0) {
            throw new AppError(404, `Expense with id ${id} not found`);
        }

        res.json(result[0]);
    } catch (err) {
        next(err);
    }
}

export async function createExpense(
    req: Request<{}, {}, CreateExpenseInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = createExpenseSchema.parse(req.body); // validates + types the body

        const inserted = await db.insert(expenses).values(data).returning();
        res.status(201).json(inserted[0]);
    } catch (err) {
        next(err);
    }
}

export async function updateExpense(
    req: Request<{ id: string }, {}, UpdateExpenseInput>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = parseId(req.params);
        const data = updateExpenseSchema.parse(req.body);

        if (Object.keys(data).length === 0) {
            throw new AppError(400, "No fields provided to update");
        }

        const updated = await db
            .update(expenses)
            .set(data)
            .where(eq(expenses.id, id))
            .returning();

        if (updated.length === 0) {
            throw new AppError(404, `Expense with id ${id} not found`);
        }

        res.json(updated[0]);
    } catch (err) {
        next(err);
    }
}

export async function deleteExpense(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = parseId(req.params);
        const deleted = await db.delete(expenses).where(eq(expenses.id, id)).returning();

        if (deleted.length === 0) {
            throw new AppError(404, `Expense with id ${id} not found`);
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}