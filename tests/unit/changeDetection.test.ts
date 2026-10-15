import { describe, it, expect } from "vitest";
import { applyChangeDetection } from "../../backend/src/analysis/changeDetection.js";
import { Finding } from "@sitesentinel/shared";

describe("Change-Aware Detection Engine", () => {
  const mockFinding = (id: string, category: any, severity: any): Finding => ({
    id,
    analysis_id: "an-1",
    category,
    severity,
    certainty: "high",
    title: `Sample ${category}`,
    evidence_observed: "Visible defect indicator",
    requires_human_review: true,
    review: "pending",
    change: "not_compared",
    priority_score: 50,
    priority_factors: {},
    recommended_actions: [],
  });

  it("marks all findings as 'not_compared' when no baseline exists", () => {
    const current = [mockFinding("f1", "crack", "moderate")];
    const result = applyChangeDetection(current, []);
    expect(result.updatedCurrentFindings[0].change).toBe("not_compared");
  });

  it("identifies worsened finding when severity elevates over time", () => {
    const previous = [mockFinding("p1", "crack", "moderate")];
    const current = [mockFinding("c1", "crack", "high")];

    const result = applyChangeDetection(current, previous);
    expect(result.updatedCurrentFindings[0].change).toBe("worsened");
  });

  it("identifies unchanged finding when condition persists identically", () => {
    const previous = [mockFinding("p1", "corrosion_rust", "moderate")];
    const current = [mockFinding("c1", "corrosion_rust", "moderate")];

    const result = applyChangeDetection(current, previous);
    expect(result.updatedCurrentFindings[0].change).toBe("unchanged");
  });

  it("flags brand new defect not observed in baseline", () => {
    const previous = [mockFinding("p1", "crack", "moderate")];
    const current = [
      mockFinding("c1", "crack", "moderate"),
      mockFinding("c2", "spalling_delamination", "high"),
    ];

    const result = applyChangeDetection(current, previous);
    const newDefect = result.updatedCurrentFindings.find((f) => f.category === "spalling_delamination");
    expect(newDefect?.change).toBe("new");
  });
});
