import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../backend/src/index.js";

describe("End-to-End User Flow Smoke Test", () => {
  it("executes the full end-to-end field inspection lifecycle", async () => {
    // Step 1: User lands on platform, system is healthy
    const health = await request(app).get("/api/health");
    expect(health.status).toBe(200);
    expect(health.body.status).toBe("ok");

    // Step 2: User queries demo cases
    const demoCases = await request(app).get("/api/demo/cases");
    expect(demoCases.status).toBe(200);
    expect(demoCases.body.length).toBeGreaterThanOrEqual(6);

    // Step 3: User launches the before/after change-aware re-inspection case (demo-bridge-reinspection)
    const runRes = await request(app).post("/api/demo/cases/demo-bridge-reinspection/run");
    expect(runRes.status).toBe(202);
    const analysisId = runRes.body.analysisId;
    expect(analysisId).toBeTruthy();

    // Step 4: User opens inspection results inspector
    const results = await request(app).get(`/api/analyses/${analysisId}`);
    expect(results.status).toBe(200);
    expect(results.body.findings.length).toBeGreaterThan(0);
    expect(results.body.media.length).toBeGreaterThan(0);
    expect(results.body.media[0].signed_url).toContain("/api/media?key=");

    // Verify change-aware classification on worsened defect
    const worsenedFinding = results.body.findings.find((f: any) => f.change === "worsened");
    expect(worsenedFinding).toBeDefined();
    expect(worsenedFinding?.priority_score).toBeGreaterThan(70);

    // Step 5: Inspector reviews, confirms the finding, adds field verification note
    const findingToReview = results.body.findings[0];
    const reviewRes = await request(app)
      .patch(`/api/analyses/${analysisId}/review`)
      .send({
        reviews: [
          {
            findingId: findingToReview.id,
            decision: "confirmed",
            note: "Confirmed by Certified Field Engineer. Live load monitoring sensor ordered.",
          },
        ],
      });
    expect(reviewRes.status).toBe(200);

    // Step 6: Verify operational dashboard updates with updated consistency metrics
    const dash = await request(app).get("/api/dashboard/summary");
    expect(dash.status).toBe(200);
    expect(dash.body.consistencyMetrics.confirmedCount).toBeGreaterThanOrEqual(1);

    // Step 7: Inspector downloads certified PDF report
    const pdfRes = await request(app).get(`/api/reports/${analysisId}?format=pdf`);
    expect(pdfRes.status).toBe(200);
    expect(pdfRes.header["content-type"]).toBe("application/pdf");
    expect(pdfRes.body.length).toBeGreaterThan(1000); // Valid PDF stream

    // Step 8: Inspector exports structured JSON report
    const jsonRes = await request(app).get(`/api/reports/${analysisId}?format=json`);
    expect(jsonRes.status).toBe(200);
    expect(jsonRes.body.inspection.id).toBe(analysisId);
    expect(jsonRes.body.disclaimer).toBeTruthy();
  });
});
