import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const expenses = sqliteTable("expenses", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    description: text("description").notNull(),
    amount: real("amount").notNull(),
    category: text("category", {
        enum: ["food", "transport", "utilities", "entertainment", "other"],
    }).notNull(),
    date: text("date").notNull(), // stored as "YYYY-MM-DD"
    createdAt: text("created_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString()),
});

export type Expense = typeof expenses.$inferSelect;
export type CreateExpense = typeof expenses.$inferInsert;