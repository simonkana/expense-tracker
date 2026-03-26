import { useState } from "react";
import type { CreateExpenseInput, Category } from "../types";
import s from "./ExpenseForm.module.css";

interface Props {
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
}

const CATEGORIES: Category[] = [
  "food",
  "transport",
  "utilities",
  "entertainment",
  "other",
];

export function ExpenseForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CreateExpenseInput>({
    description: "",
    amount: 0,
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CreateExpenseInput>(
    k: K,
    v: CreateExpenseInput[K],
  ) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      setForm({
        description: "",
        amount: 0,
        category: "food",
        date: new Date().toISOString().split("T")[0],
      });
    } catch {
      setError("Failed to add expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={s.card}>
      <h2 className={s.cardTitle}>New expense</h2>
      <form onSubmit={handleSubmit}>
        <div className={s.grid}>
          <div className={`${s.field} ${s.fullWidth}`}>
            <label className={s.label}>Description</label>
            <input
              className={s.input}
              placeholder="e.g. Lunch at café"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Amount (Kč)</label>
            <input
              className={s.input}
              type="number"
              placeholder="0"
              value={form.amount || ""}
              min={0}
              step={0.01}
              onChange={(e) => set("amount", parseFloat(e.target.value))}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Category</label>
            <div className={s.selectWrapper}>
              <select
                className={s.select}
                value={form.category}
                onChange={(e) => set("category", e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label}>Date</label>
            <input
              className={s.input}
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
            />
          </div>
        </div>
        <div className={s.footer}>
          {error && <span className={s.formError}>{error}</span>}
          {!error && <span />}
          <button className={s.submitBtn} type="submit" disabled={submitting}>
            {submitting ? "Adding…" : "Add expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
