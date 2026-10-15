import { Router, Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { repository } from "../services/repository/index.js";
import { generateReportPdf, generateReportJson } from "../reports/reportGenerator.js";

const router = Router();

// GET /api/reports (list)
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const reports = await repository.getReports(user.id);
      res.json(reports);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/reports/:id (Download or preview report by analysis ID)
router.get(
  "/:id",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user!;
      const id = req.params.id;
      const format = (req.query.format as string) === "json" ? "json" : "pdf";

      const analysis = await repository.getAnalysisById(user.id, id);
      if (!analysis) {
        res.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: `Inspection analysis with ID ${id} was not found.`,
            requestId: req.requestId,
          },
        });
        return;
      }

      if (format === "json") {
        const jsonOutput = generateReportJson(analysis);
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="SiteSentinel-Report-${analysis.asset_code || id}.json"`);
        res.send(jsonOutput);
        return;
      }

      // PDF format
      const pdfBuffer = await generateReportPdf(analysis);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="SiteSentinel-Report-${analysis.asset_code || id}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
