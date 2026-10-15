import PDFDocument from "pdfkit";
import { AnalysisDetail } from "@sitesentinel/shared";
import { STANDING_ADVISORY_DISCLAIMER } from "../analysis/advisory.js";

export function generateReportJson(analysis: AnalysisDetail): string {
  const exportPayload = {
    system: "SiteSentinel Visual Inspection Intelligence",
    version: "1.0.0",
    generated_at: new Date().toISOString(),
    disclaimer: STANDING_ADVISORY_DISCLAIMER,
    inspection: {
      id: analysis.id,
      asset_id: analysis.asset_id,
      asset_code: analysis.asset_code,
      asset_name: analysis.asset_name,
      asset_type: analysis.asset_type,
      asset_criticality: analysis.asset_criticality,
      inspection_type: analysis.inspection_type,
      location_note: analysis.location_note,
      overall_condition: analysis.overall_condition,
      summary: analysis.summary,
      created_at: analysis.created_at,
      completed_at: analysis.completed_at,
      processing_ms: analysis.processing_ms,
      is_simulated: analysis.is_simulated,
      model_name: analysis.model_name,
      detector_kind: analysis.detector_kind,
      limitations: analysis.limitations,
    },
    findings: analysis.findings.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      severity: f.severity,
      certainty: f.certainty,
      confidence_score: f.confidence_score,
      evidence_observed: f.evidence_observed,
      inference: f.inference,
      approx_region: f.approx_region,
      region_source: f.region_source,
      change: f.change,
      change_note: f.change_note,
      priority_score: f.priority_score,
      priority_factors: f.priority_factors,
      requires_human_review: f.requires_human_review,
      review: f.review,
      recommended_actions: f.recommended_actions,
    })),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function generateReportPdf(
  analysis: AnalysisDetail,
  _imageBuffers: Buffer[] = []
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Header Banner
      doc.rect(40, 40, 515, 60).fill("#0f172a");
      doc.fillColor("#38bdf8").fontSize(18).font("Helvetica-Bold").text("SITESENTINEL", 55, 52);
      doc.fillColor("#94a3b8").fontSize(9).font("Helvetica").text("EVIDENCE-GROUNDED VISUAL INSPECTION INTELLIGENCE", 55, 75);

      if (analysis.is_simulated) {
        doc.fillColor("#f59e0b").fontSize(10).font("Helvetica-Bold").text("SIMULATED DEMO RESULT", 380, 62, { align: "right" });
      }

      doc.moveDown(4);

      // Metadata Grid
      const startY = 120;
      doc.rect(40, startY, 515, 70).fill("#f8fafc").stroke("#e2e8f0");
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold");

      doc.text(`Asset ID: ${analysis.asset_code || analysis.asset_id}`, 50, startY + 12);
      doc.text(`Asset Type: ${analysis.asset_type || "N/A"}`, 50, startY + 28);
      doc.text(`Criticality: ${(analysis.asset_criticality || "medium").toUpperCase()}`, 50, startY + 44);

      doc.text(`Inspection ID: ${analysis.id}`, 280, startY + 12);
      doc.text(`Date: ${new Date(analysis.created_at).toLocaleString()}`, 280, startY + 28);
      doc.text(`Overall Condition: ${(analysis.overall_condition || "indeterminate").toUpperCase()}`, 280, startY + 44);

      doc.y = startY + 85;

      // Executive Summary
      doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("1. Executive Inspection Summary");
      doc.moveDown(0.4);
      doc.fillColor("#334155").fontSize(9.5).font("Helvetica").text(
        analysis.summary || "No automated executive summary generated for this inspection.",
        { lineGap: 3 }
      );
      doc.moveDown(1);

      // Findings Section
      doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text(`2. Visual Findings Ledger (${analysis.findings.length} findings)`);
      doc.moveDown(0.5);

      analysis.findings.forEach((finding, idx) => {
        // Page break if near bottom
        if (doc.y > 680) {
          doc.addPage();
        }

        const boxY = doc.y;
        doc.rect(40, boxY, 515, 110).fill("#f1f5f9").stroke("#cbd5e1");

        // Finding Header
        doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold").text(
          `${idx + 1}. ${finding.title}`,
          50,
          boxY + 8
        );

        const badgeText = `[Severity: ${finding.severity.toUpperCase()}] [Change: ${(finding.change || "not_compared").toUpperCase()}] [Priority: ${finding.priority_score}/100] [Status: ${finding.review.toUpperCase()}]`;
        doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text(badgeText, 50, boxY + 24);

        // Observed vs Inferred
        doc.fillColor("#0284c7").fontSize(8.5).font("Helvetica-Bold").text("OBSERVED PHYSICAL EVIDENCE:", 50, boxY + 38);
        doc.fillColor("#1e293b").fontSize(8.5).font("Helvetica").text(finding.evidence_observed, 50, boxY + 49, { width: 495, height: 26 });

        if (finding.inference) {
          doc.fillColor("#64748b").fontSize(8).font("Helvetica-Bold").text("MODEL INFERENCE (HYPOTHESIS):", 50, boxY + 74);
          doc.fillColor("#334155").fontSize(8).font("Helvetica").text(finding.inference, 50, boxY + 84, { width: 495, height: 20 });
        }

        doc.y = boxY + 120;
      });

      // Limitations
      if (doc.y > 680) doc.addPage();
      doc.moveDown(0.5);
      doc.fillColor("#0f172a").fontSize(12).font("Helvetica-Bold").text("3. Inspection Limitations");
      doc.moveDown(0.3);
      if (analysis.limitations && analysis.limitations.length > 0) {
        analysis.limitations.forEach((lim) => {
          doc.fillColor("#475569").fontSize(8.5).font("Helvetica").text(`• ${lim}`);
        });
      } else {
        doc.fillColor("#475569").fontSize(8.5).font("Helvetica").text("• No specific visual limitations reported.");
      }

      // Disclaimer & Sign-off
      doc.moveDown(1.5);
      if (doc.y > 660) doc.addPage();
      doc.rect(40, doc.y, 515, 75).fill("#fffbeb").stroke("#fde68a");
      const discY = doc.y + 8;
      doc.fillColor("#b45309").fontSize(8).font("Helvetica-Bold").text("PROFESSIONAL ADVISORY DISCLAIMER", 50, discY);
      doc.fillColor("#78350f").fontSize(7.5).font("Helvetica").text(
        STANDING_ADVISORY_DISCLAIMER,
        50,
        discY + 12,
        { width: 495, lineGap: 2 }
      );

      doc.fillColor("#1e293b").fontSize(8.5).font("Helvetica-Bold").text(
        "Certified Inspector Sign-off: _________________________   Date: ______________",
        50,
        discY + 48
      );

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
