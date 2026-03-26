import { useState } from "react";
import type { Expense, Category, UpdateExpenseInput } from "../types";
import s from "./ExpenseList.module.css";

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: UpdateExpenseInput) => Promise<void>;
}

const CATEGORIES: Category[] = [
  "food",
  "transport",
  "utilities",
  "entertainment",
  "other",
];

const EMOJI: Record<string, string> = {
  food: "🍽",
  transport: "🚌",
  utilities: "💡",
  entertainment: "🎬",
  other: "📦",
};

interface EditState {
  description: string;
  amount: string;
  category: Category;
  date: string;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ExpenseList({ expenses, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const startEdit = (e: Expense) => {
    setEditingId(e.id);
    setEditState({
      description: e.description,
      amount: String(e.amount),
      category: e.category,
      date: e.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  const saveEdit = async (id: number) => {
    if (!editState) return;
    await onUpdate(id, {
      description: editState.description,
      amount: parseFloat(editState.amount),
      category: editState.category,
      date: editState.date,
    });
    cancelEdit();
  };

  const setEdit = <K extends keyof EditState>(k: K, v: EditState[K]) =>
    setEditState((s) => (s ? { ...s, [k]: v } : s));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <h2 className={s.cardTitle}>Expenses</h2>
        <span className={s.totalBadge}>
          Total:{" "}
          <span className={s.totalAmount}>
            {total.toLocaleString("cs-CZ")} Kč
          </span>
        </span>
      </div>

      {expenses.length === 0 ? (
        <p className={s.empty}>No expenses yet — add one above.</p>
      ) : (
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) =>
              editingId === expense.id && editState ? (
                <tr key={expense.id} className={s.editRow}>
                  <td colSpan={5}>
                    <div className={s.editGrid}>
                      <input
                        className={s.editInput}
                        value={editState.description}
                        onChange={(e) => setEdit("description", e.target.value)}
                      />
                      <input
                        className={s.editInput}
                        type="number"
                        value={editState.amount}
                        onChange={(e) => setEdit("amount", e.target.value)}
                      />
                      <select
                        className={s.editSelect}
                        value={editState.category}
                        onChange={(e) =>
                          setEdit("category", e.target.value as Category)
                        }
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <input
                        className={s.editInput}
                        type="date"
                        value={editState.date}
                        onChange={(e) => setEdit("date", e.target.value)}
                      />
                      <div className={s.editActions}>
                        <button
                          className={s.saveBtn}
                          onClick={() => saveEdit(expense.id)}
                        >
                          Save
                        </button>
                        <button className={s.cancelBtn} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={expense.id} className={s.row}>
                  <td className={s.dateCell}>{formatDate(expense.date)}</td>
                  <td className={s.descCell}>{expense.description}</td>
                  <td>
                    <span className={s.categoryBadge}>
                      {EMOJI[expense.category]} {expense.category}
                    </span>
                  </td>
                  <td className={s.amountCell}>
                    {expense.amount.toLocaleString("cs-CZ")} Kč
                  </td>
                  <td className={s.actionsCell}>
                    <button
                      className={s.iconBtn}
                      onClick={() => startEdit(expense)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className={`${s.iconBtn} ${s.danger}`}
                      onClick={() => onDelete(expense.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
