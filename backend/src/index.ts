import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import healthRouter from "./routes/health.js";
import analyzeRouter from "./routes/analyze.js";
import analysesRouter from "./routes/analyses.js";
import assetsRouter from "./routes/assets.js";
import dashboardRouter from "./routes/dashboard.js";
import reportsRouter from "./routes/reports.js";
import demoRouter from "./routes/demo.js";
import mediaRouter from "./routes/media.js";

const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev origins, matching CLIENT_URL, and Vercel domains
      if (
        !origin ||
        origin === env.CLIENT_URL ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly fallback
      }
    },
    credentials: true,
  })
);

app.use(requestIdMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routing Table
app.use("/api/health", healthRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/analyses", analysesRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/demo/cases", demoRouter);
app.use("/api/media", mediaRouter);

// Centralized Error Handling
app.use(errorHandler);

// Start Server (only when not running under test runner)
let server: any = null;
if (process.env.NODE_ENV !== "test") {
  server = app.listen(env.PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 SiteSentinel Backend Engine online on port ${env.PORT}`);
    console.log(`   Health: http://localhost:${env.PORT}/api/health`);
    console.log(`   Mode:   ${env.DATA_MODE.toUpperCase()}`);
    console.log(`   CORS:   ${env.CLIENT_URL}`);
    console.log(`================================================================`);
  });
}

export default app;
export { server };
