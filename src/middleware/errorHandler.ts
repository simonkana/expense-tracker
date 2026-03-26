import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// A custom error class so we can throw errors with HTTP status codes
// from anywhere in the app and handle them in one place
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

// This is an Express error-handling middleware — notice the 4 parameters.
// Express identifies error handlers by the presence of that first `err` param.
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Zod throws ZodError when validation fails
    if (err instanceof ZodError) {
        res.status(400).json({
            error: "Validation failed",
            details: err.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
        return;
    }

    // Our own AppError - use the status code we set when throwing
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    // Unexpected error - don't leak internals to the client
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
}