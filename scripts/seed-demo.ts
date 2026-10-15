import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { repository } from "../server/src/services/repository/index.js";
import { storageProvider } from "../server/src/services/storage/index.js";
import { DEMO_CASES } from "../server/src/demo/demoCases.js";
import { calculatePriorityScore } from "../server/src/analysis/priority.js";

async function seed(): Promise<void> {
  console.log("🌱 Seeding SiteSentinel Demo Cases & Operational Data...");
  const ownerId = "local-user-id";
  const demoImagesDir = path.resolve(process.cwd(), "demo", "images");

  // Keep track of created analyses by demo case id
  const createdAnalyses = new Map<string, any>();

  for (const demoCase of DEMO_CASES) {
    console.log(`  -> Processing demo case: ${demoCase.title} (${demoCase.asset_code})`);

    // 1. Ensure asset exists
    const asset = await repository.createAsset(ownerId, {
      asset_code: demoCase.asset_code,
      name: demoCase.asset_name,
      asset_type: demoCase.asset_type,
      criticality: demoCase.asset_criticality,
    });

    // 2. Read image buffer
    const imagePath = path.join(demoImagesDir, demoCase.imageFileName);
    let imageBuffer: Buffer;
    if (fs.existsSync(imagePath)) {
      imageBuffer = fs.readFileSync(imagePath);
    } else {
      imageBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#1e293b"/></svg>`);
    }

    // 3. Link baseline if reinspection
    let previousAnalysisId: string | null = null;
    if (demoCase.linkedBaselineId && createdAnalyses.has(demoCase.linkedBaselineId)) {
      previousAnalysisId = createdAnalyses.get(demoCase.linkedBaselineId).id;
    }

    // 4. Create analysis record
    const analysis = await repository.createAnalysis(ownerId, {
      asset_id: asset.id,
      inspection_type: demoCase.inspection_type,
      source: "demo",
      is_simulated: true,
      location_note: demoCase.description,
      context_notes: "Demonstration inspection run from bundled dataset.",
      status: "completed",
      previous_analysis_id: previousAnalysisId,
    });

    createdAnalyses.set(demoCase.id, analysis);

    // 5. Store image
    const storageKey = `${ownerId}/${analysis.id}/${demoCase.imageFileName}`;
    await storageProvider.saveFile(storageKey, imageBuffer, "image/svg+xml");

    const media = await repository.createMediaFile({
      analysis_id: analysis.id,
      owner_id: ownerId,
      storage_path: storageKey,
      media_type: "image",
      mime_type: "image/svg+xml",
      size_bytes: imageBuffer.length,
      width: 1200,
      height: 900,
    });

    // 6. Create findings with deterministic priorities
    const findingsToInsert: any[] = [];
    for (const rawF of demoCase.result.findings) {
      const priority = calculatePriorityScore(
        rawF.severity as any,
        rawF.change as any,
        rawF.certainty as any,
        demoCase.asset_criticality
      );

      const fId = `find-${uuidv4().substring(0, 8)}`;
      // Review states: set baseline to confirmed/reviewed to give realistic agreement metrics
      const reviewStatus = demoCase.pairRole === "baseline" ? "confirmed" : "pending";

      findingsToInsert.push({
        id: fId,
        analysis_id: analysis.id,
        media_file_id: media.id,
        category: rawF.category,
        severity: rawF.severity,
        certainty: rawF.certainty,
        confidence_score: null,
        title: rawF.title,
        evidence_observed: rawF.evidence_observed,
        inference: rawF.inference,
        approx_region: rawF.approx_region,
        region_source: "ai_estimated",
        change: rawF.change,
        change_note: rawF.change_note,
        priority_score: priority.score,
        priority_factors: priority.factors,
        requires_human_review: true,
        review: reviewStatus,
        recommended_actions: rawF.recommended_actions.map((ra) => ({
          id: `act-${uuidv4().substring(0, 8)}`,
          action: ra.action,
          urgency: ra.urgency as any,
          source: ra.source as any,
          rationale: ra.rationale,
        })),
        created_at: new Date(Date.now() - (demoCase.pairRole === "baseline" ? 180 : 2) * 86400000).toISOString(),
      });
    }

    await repository.createFindings(findingsToInsert);

    // Add some reviews on baseline findings to establish human-AI consistency metrics
    if (demoCase.pairRole === "baseline") {
      for (const f of findingsToInsert) {
        await repository.createReview({
          finding_id: f.id,
          owner_id: ownerId,
          decision: "confirmed",
          note: "Verified in field re-check by certified inspector.",
        });
      }
    }

    // 7. Update analysis summary & condition
    await repository.updateAnalysis(analysis.id, {
      summary: demoCase.result.summary,
      overall_condition: demoCase.result.overall_condition,
      limitations: demoCase.result.limitations,
      model_name: "gemini-2.5-flash (simulated)",
      detector_kind: "ai_estimated",
      processing_ms: 1840,
      completed_at: new Date(Date.now() - (demoCase.pairRole === "baseline" ? 180 : 2) * 86400000).toISOString(),
    });
  }

  console.log("✅ SiteSentinel demo data seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
