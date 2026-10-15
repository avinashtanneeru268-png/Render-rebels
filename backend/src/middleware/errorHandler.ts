import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const reqId = req.requestId || "unknown";

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload or query parameters.",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
        requestId: reqId,
      },
    });
    return;
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({
      error: {
        code: "FILE_TOO_LARGE",
        message: "Uploaded file exceeds maximum permitted size.",
        requestId: reqId,
      },
    });
    return;
  }

  // AI service unavailable
  if (err.message && err.message.includes("AI_UNAVAILABLE")) {
    res.status(503).json({
      error: {
        code: "AI_UNAVAILABLE",
        message: "Gemini Vision AI service is not configured or currently unreachable. You can continue inspecting with precomputed demo cases.",
        requestId: reqId,
      },
    });
    return;
  }

  // Known HTTP error codes
  if (err.status && typeof err.status === "number" && err.status >= 400 && err.status < 600) {
    res.status(err.status).json({
      error: {
        code: err.code || "REQUEST_ERROR",
        message: err.message || "An error occurred while processing the request.",
        requestId: reqId,
      },
    });
    return;
  }

  // Generic 500 without leaking stack traces or internal secrets
  console.error(`[Error ${reqId}]:`, err.message || err);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred. Please try again or check the system logs.",
      requestId: reqId,
    },
  });
}
