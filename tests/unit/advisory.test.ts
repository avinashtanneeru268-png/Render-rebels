import { describe, it, expect } from "vitest";
import {
  generateRuleBasedActions,
  mergeRecommendations,
  STANDING_ADVISORY_DISCLAIMER,
} from "../../backend/src/analysis/advisory.js";

describe("Advisory Rules Engine", () => {
  it("generates immediate urgency for critical crack on concrete bridge", () => {
    const actions = generateRuleBasedActions("crack", "critical", "not_compared", "bridge");
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].urgency).toBe("immediate");
    expect(actions[0].source).toBe("rule");
    expect(actions[0].action).toContain("cordone perimeter");
  });

  it("recommends ultrasonic gauging for severe corrosion on load-bearing pipeline", () => {
    const actions = generateRuleBasedActions("corrosion_rust", "high", "not_compared", "pipeline");
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].urgency).toBe("within_7_days");
    expect(actions[0].action).toContain("ultrasonic");
  });

  it("merges rule actions with model suggestions tagged with correct source", () => {
    const ruleActions = generateRuleBasedActions("crack", "moderate");
    const modelSuggestions = [
      {
        action: "Clean surface debris around crack mouth to allow microscopic measurement",
        urgency: "within_30_days" as const,
        rationale: "Unobstructed visual field enables high-precision crack width gauging",
      },
    ];

    const merged = mergeRecommendations(ruleActions, modelSuggestions);
    expect(merged.length).toBeGreaterThan(ruleActions.length);
    expect(merged.some((a) => a.source === "rule")).toBe(true);
    const modelAction = merged.find((a) => a.source === "model");
    expect(modelAction).toBeDefined();
    expect(modelAction?.action).toContain("Clean surface debris");
  });

  it("provides non-empty standing advisory disclaimer", () => {
    expect(STANDING_ADVISORY_DISCLAIMER).toBeTruthy();
    expect(STANDING_ADVISORY_DISCLAIMER).toContain("SiteSentinel");
    expect(STANDING_ADVISORY_DISCLAIMER).toContain("qualified");
  });
});
