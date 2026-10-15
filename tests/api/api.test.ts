import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../backend/src/index.js";

describe("SiteSentinel Backend API Endpoints", () => {
  it("GET /api/health - returns healthy status and local mode info", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.mode).toBe("local");
    expect(res.body.version).toBe("1.0.0");
    expect(res.body.activeDetector).toBeDefined();
  });

  it("GET /api/dashboard/summary - returns comprehensive operational metrics", async () => {
    const res = await request(app).get("/api/dashboard/summary");
    expect(res.status).toBe(200);
    expect(res.body.totalAnalyses).toBeGreaterThanOrEqual(1);
    expect(res.body.totalFindings).toBeGreaterThanOrEqual(1);
    expect(res.body.agreementRatePercent).toBeGreaterThanOrEqual(0);
    expect(res.body.consistencyMetrics).toBeDefined();
    expect(res.body.consistencyMetrics.hoursSavedFormula).toContain("Est. Saved Hours");
    expect(res.body.findingsBySeverity).toBeDefined();
    expect(res.body.findingsByCategory).toBeDefined();
  });

  it("GET /api/demo/cases - lists bundled demo cases", async () => {
    const res = await request(app).get("/api/demo/cases");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(6);

    const pair = res.body.filter((c: any) => c.isPair);
    expect(pair.length).toBeGreaterThanOrEqual(2);
  });

  it("POST /api/demo/cases/:caseId/run - executes simulated demo inspection", async () => {
    const res = await request(app).post("/api/demo/cases/demo-bridge-baseline/run");
    expect(res.status).toBe(202);
    expect(res.body.analysisId).toBeDefined();
    expect(res.body.status).toBe("completed");
    expect(res.body.isSimulated).toBe(true);

    // Verify detail retrieval
    const detailRes = await request(app).get(`/api/analyses/${res.body.analysisId}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.findings.length).toBeGreaterThanOrEqual(1);
    expect(detailRes.body.media.length).toBeGreaterThanOrEqual(1);
    expect(detailRes.body.media[0].signed_url).toBeDefined();
  });

  it("GET /api/analyses - supports pagination and filtering", async () => {
    const res = await request(app).get("/api/analyses?page=1&pageSize=5");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(res.body.page).toBe(1);
  });

  it("PATCH /api/analyses/:id/review - records human review decisions", async () => {
    // 1. Run demo case
    const runRes = await request(app).post("/api/demo/cases/demo-pipeline-corrosion/run");
    const analysisId = runRes.body.analysisId;

    const detailRes = await request(app).get(`/api/analyses/${analysisId}`);
    const finding = detailRes.body.findings[0];
    expect(finding).toBeDefined();

    // 2. Submit review confirmation
    const reviewRes = await request(app)
      .patch(`/api/analyses/${analysisId}/review`)
      .send({
        reviews: [
          {
            findingId: finding.id,
            decision: "confirmed",
            note: "Corrosion scale confirmed in field ultrasonic survey.",
          },
        ],
      });

    expect(reviewRes.status).toBe(200);

    // 3. Verify finding status updated
    const updatedRes = await request(app).get(`/api/analyses/${analysisId}`);
    const updatedFinding = updatedRes.body.findings.find((f: any) => f.id === finding.id);
    expect(updatedFinding.review).toBe("confirmed");
  });

  it("GET /api/reports/:id - outputs downloadable PDF and structured JSON reports", async () => {
    const runRes = await request(app).post("/api/demo/cases/demo-facade-masonry/run");
    const analysisId = runRes.body.analysisId;

    // JSON export
    const jsonRes = await request(app).get(`/api/reports/${analysisId}?format=json`);
    expect(jsonRes.status).toBe(200);
    expect(jsonRes.header["content-type"]).toContain("application/json");
    expect(jsonRes.body.inspection).toBeDefined();
    expect(jsonRes.body.findings).toBeDefined();

    // PDF export
    const pdfRes = await request(app).get(`/api/reports/${analysisId}?format=pdf`);
    expect(pdfRes.status).toBe(200);
    expect(pdfRes.header["content-type"]).toContain("application/pdf");
  });

  it("POST /api/analyze - fails cleanly with 415 on bad file content", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .field("asset_id", "TEST-01")
      .attach("file", Buffer.from("NOT_A_REAL_IMAGE_OR_VIDEO_FILE"), "fake.jpg");

    expect(res.status).toBe(415);
    expect(res.body.error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("GET /api/analyses/:id - returns 404 on non-existent inspection", async () => {
    const res = await request(app).get("/api/analyses/non-existent-analysis-id");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
