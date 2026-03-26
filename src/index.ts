import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { expenses, type CreateExpense } from "./db/schema";

const app = express();
app.use(express.json());

// GET /expenses
app.get("/expenses", async (_req: Request, res: Response) => {
    const all = await db.select().from(expenses);
    res.json(all);
});

// GET /expenses/:id
app.get("/expenses/:id", async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await db.select().from(expenses).where(eq(expenses.id, id));

    if (result.length === 0) {
        res.status(404).json({ error: `Expense with id ${id} not found` });
        return;
    }

    res.json(result[0]);
});

// POST /expenses
app.post("/expenses", async (req: Request<{}, {}, CreateExpense>, res: Response) => {
    const { description, amount, category, date } = req.body;

    // Basic validation - we'll replace this with Zod in Phase 3
    if (!description || !amount || !category || !date) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    const inserted = await db
        .insert(expenses)
        .values({ description, amount, category, date })
        .returning(); // returns the full row including auto-generated id and createdAt

    res.status(201).json(inserted[0]);
});

// DELETE /expenses/:id
app.delete("/expenses/:id", async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await db.delete(expenses).where(eq(expenses.id, id)).returning();

    if (deleted.length === 0) {
        res.status(404).json({ error: `Expense with id ${id} not found` });
        return;
    }

    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});