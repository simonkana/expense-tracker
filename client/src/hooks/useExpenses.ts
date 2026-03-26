import { useState, useEffect, useCallback } from "react";
import { expensesApi } from "../api";
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "../types";

interface UseExpensesReturn {
    expenses: Expense[];
    loading: boolean;
    error: string | null;
    createExpense: (data: CreateExpenseInput) => Promise<void>;
    updateExpense: (id: number, data: UpdateExpenseInput) => Promise<void>;
    deleteExpense: (id: number) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useExpenses(): UseExpensesReturn {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await expensesApi.getAll();
            setExpenses(data);
        } catch {
            setError("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const createExpense = async (data: CreateExpenseInput) => {
        await expensesApi.create(data);
        await refresh(); // re-fetch after mutation so UI stays in sync
    };

    const updateExpense = async (id: number, data: UpdateExpenseInput) => {
        await expensesApi.update(id, data);
        await refresh();
    };

    const deleteExpense = async (id: number) => {
        await expensesApi.delete(id);
        await refresh();
    };

    return { expenses, loading, error, createExpense, updateExpense, deleteExpense, refresh };
}