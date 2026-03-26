import { useExpenses } from "./hooks/useExpenses";
import { ExpenseForm } from "./components/ExpenseForm";
import { ExpenseList } from "./components/ExpenseList";
import s from "./App.module.css";

export default function App() {
  const {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <h1 className={s.title}>Expense Tracker</h1>
        <p className={s.subtitle}>Keep track of where your money goes</p>
      </header>
      <ExpenseForm onSubmit={createExpense} />
      <hr className={s.divider} />
      {loading && <p className={s.statusMessage}>Loading expenses…</p>}
      {error && <p className={s.errorMessage}>{error}</p>}
      {!loading && (
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          onUpdate={updateExpense}
        />
      )}
    </div>
  );
}
