import express from "express";
import expenseRoutes from "./routes/expenses";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());

// Routes
app.use("/expenses", expenseRoutes);

// Error handler - must be registered LAST, after all routes
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});