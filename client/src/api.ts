import axios from "axios";
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from "./types";

const client = axios.create({ baseURL: "/api" });

export const expensesApi = {
    getAll: async (): Promise<Expense[]> => {
        const res = await client.get<Expense[]>("/expenses");
        return res.data;
    },

    getById: async (id: number): Promise<Expense> => {
        const res = await client.get<Expense>(`/expenses/${id}`);
        return res.data;
    },

    create: async (data: CreateExpenseInput): Promise<Expense> => {
        const res = await client.post<Expense>("/expenses", data);
        return res.data;
    },

    update: async (id: number, data: UpdateExpenseInput): Promise<Expense> => {
        const res = await client.patch<Expense>(`/expenses/${id}`, data);
        return res.data;
    },

    delete: async (id: number): Promise<void> => {
        await client.delete(`/expenses/${id}`);
    },
};