import { describe, it, expect } from "vitest";
import { calculatePriorityScore } from "../../backend/src/analysis/priority.js";

describe("Priority Engine (Deterministic & Explainable)", () => {
  it("calculates baseline score for critical severity on medium asset", () => {
    const result = calculatePriorityScore("critical", "not_compared", "high", "medium");
    // (95 + 0) * 1.0 * 1.0 = 95
    expect(result.score).toBe(95);
    expect(result.factors.baseWeight).toBe(95);
    expect(result.factors.changeModifier).toBe(0);
    expect(result.factors.certaintyFactor).toBe(1.0);
  });

  it("applies worsened change modifier boost (+15)", () => {
    const baseline = calculatePriorityScore("high", "unchanged", "high", "medium");
    const worsened = calculatePriorityScore("high", "worsened", "high", "medium");
    // baseline: (75 + 0) * 1.0 = 75
    // worsened: (75 + 15) * 1.0 = 90
    expect(baseline.score).toBe(75);
    expect(worsened.score).toBe(90);
    expect(worsened.score).toBeGreaterThan(baseline.score);
  });

  it("applies high asset criticality multiplier (1.25)", () => {
    const standard = calculatePriorityScore("moderate", "not_compared", "high", "medium");
    const criticalAsset = calculatePriorityScore("moderate", "not_compared", "high", "high");
    // standard: 50 * 1.0 * 1.0 = 50
    // criticalAsset: 50 * 1.0 * 1.25 = 63
    expect(standard.score).toBe(50);
    expect(criticalAsset.score).toBe(63);
  });

  it("discounts low certainty qualitative rating (0.7)", () => {
    const highCert = calculatePriorityScore("high", "not_compared", "high", "medium");
    const lowCert = calculatePriorityScore("high", "not_compared", "low", "medium");
    // highCert: 75 * 1.0 = 75
    // lowCert: 75 * 0.7 = 53
    expect(highCert.score).toBe(75);
    expect(lowCert.score).toBe(53);
  });

  it("strictly clamps scores within [1, 100]", () => {
    const maxed = calculatePriorityScore("critical", "worsened", "high", "high");
    // (95 + 15) * 1.0 * 1.25 = 137.5 -> clamped to 100
    expect(maxed.score).toBe(100);

    const lowest = calculatePriorityScore("informational", "resolved", "low", "low");
    expect(lowest.score).toBeGreaterThanOrEqual(1);
    expect(lowest.score).toBeLessThanOrEqual(100);
  });
});
