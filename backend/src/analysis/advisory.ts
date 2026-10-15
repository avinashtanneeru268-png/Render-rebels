import {
  FindingCategory,
  Severity,
  ChangeStatus,
  AssetType,
  UrgencyLevel,
  RecommendedAction,
} from "@sitesentinel/shared";

export const STANDING_ADVISORY_DISCLAIMER =
  "SiteSentinel visual assessments and recommendations are designed to assist qualified inspection personnel and do not constitute certified structural engineering, code compliance, or safety certification.";

export interface AdvisoryRule {
  match: {
    category?: FindingCategory[];
    severity?: Severity[];
    change?: ChangeStatus[];
    asset_type?: AssetType[];
  };
  action: string;
  urgency: UrgencyLevel;
  rationale: string;
}

const ADVISORY_RULES: AdvisoryRule[] = [
  // Critical structural risks
  {
    match: {
      category: ["crack", "spalling_delamination", "deformation_misalignment"],
      severity: ["critical"],
    },
    action: "Immediately cordone perimeter and dispatch qualified structural engineer for emergency on-site evaluation.",
    urgency: "immediate",
    rationale: "Critical fracture, deformation, or spalling presents imminent structural compromise and life-safety exposure.",
  },
  // Worsened high severity issues
  {
    match: {
      severity: ["high", "critical"],
      change: ["worsened"],
    },
    action: "Escalate to asset supervisor; schedule priority intervention within 7 days.",
    urgency: "within_7_days",
    rationale: "Active deterioration confirmed between consecutive inspections demonstrates accelerated degradation rate.",
  },
  // Corrosion / rust on load-bearing or industrial assets
  {
    match: {
      category: ["corrosion_rust"],
      severity: ["high", "critical"],
      asset_type: ["bridge", "pipeline", "industrial_equipment", "utility_structure"],
    },
    action: "Conduct ultrasonic metal thickness gauging and non-destructive testing (NDT) to measure remaining wall/flange thickness.",
    urgency: "within_7_days",
    rationale: "Severe oxidation on load-bearing or pressurized assets threatens pressure containment and structural fatigue limits.",
  },
  // Moderate corrosion
  {
    match: {
      category: ["corrosion_rust"],
      severity: ["moderate"],
    },
    action: "Surface scrape, apply corrosion inhibitor/primer coat, and verify drainage path within 30 days.",
    urgency: "within_30_days",
    rationale: "Mitigate active oxidation before localized pitting causes structural cross-section loss.",
  },
  // Water intrusion / leaks
  {
    match: {
      category: ["water_damage_leak"],
      severity: ["high", "critical"],
    },
    action: "Identify hydrostatic source, inspect internal envelope for mold/rot, and patch penetration within 7 days.",
    urgency: "within_7_days",
    rationale: "Sustained water ingress rapidly corrodes embedded reinforcement and degrades structural binders.",
  },
  {
    match: {
      category: ["water_damage_leak"],
      severity: ["moderate", "low"],
    },
    action: "Clean surface efflorescence, inspect flashing/sealant, and monitor during subsequent rain event.",
    urgency: "within_30_days",
    rationale: "Minor moisture seepage can expand freeze-thaw cracking if left untreated.",
  },
  // Vegetation or debris
  {
    match: {
      category: ["vegetation_or_debris"],
      severity: ["moderate", "high"],
    },
    action: "Physically remove biological growth and root penetrations; inspect underlying masonry/joints.",
    urgency: "within_30_days",
    rationale: "Root expansion forces masonry joints apart and retains destructive moisture.",
  },
  // Fastener / component missing
  {
    match: {
      category: ["missing_or_damaged_component"],
      severity: ["high", "critical"],
    },
    action: "Reinstall certified grade fasteners/brackets immediately and inspect adjacent load-sharing connectors.",
    urgency: "immediate",
    rationale: "Loss of critical connection points redistributes structural load unevenly onto adjacent members.",
  },
  // Routine monitoring
  {
    match: {
      severity: ["low", "informational"],
    },
    action: "Log finding in asset register and re-photograph during next scheduled routine inspection cycle.",
    urgency: "monitor",
    rationale: "Baseline superficial condition noted; does not currently impair asset serviceability.",
  },
];

export function generateRuleBasedActions(
  category: FindingCategory,
  severity: Severity,
  change: ChangeStatus = "not_compared",
  assetType: AssetType = "building_facade"
): RecommendedAction[] {
  const matches: RecommendedAction[] = [];

  for (const rule of ADVISORY_RULES) {
    if (rule.match.category && !rule.match.category.includes(category)) continue;
    if (rule.match.severity && !rule.match.severity.includes(severity)) continue;
    if (rule.match.change && !rule.match.change.includes(change)) continue;
    if (rule.match.asset_type && !rule.match.asset_type.includes(assetType)) continue;

    matches.push({
      action: rule.action,
      urgency: rule.urgency,
      source: "rule",
      rationale: rule.rationale,
    });

    if (matches.length >= 2) break; // Maximum 2 rule-based actions per finding
  }

  if (matches.length === 0) {
    matches.push({
      action: "Review condition in next scheduled inspection cycle and document change.",
      urgency: severity === "critical" ? "immediate" : severity === "high" ? "within_7_days" : "monitor",
      source: "rule",
      rationale: "Standard asset preservation protocol.",
    });
  }

  return matches;
}

export function mergeRecommendations(
  ruleActions: RecommendedAction[],
  modelActions: Array<{ action: string; urgency: UrgencyLevel; rationale: string }>
): RecommendedAction[] {
  const merged: RecommendedAction[] = [...ruleActions];

  // Add up to 1 model suggested action if it provides unique value
  if (modelActions && modelActions.length > 0) {
    const candidate = modelActions[0];
    if (candidate && candidate.action) {
      merged.push({
        action: candidate.action,
        urgency: candidate.urgency,
        source: "model",
        rationale: candidate.rationale || "AI-suggested operational observation.",
      });
    }
  }

  return merged;
}
