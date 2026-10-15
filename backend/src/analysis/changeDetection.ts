import {
  Finding,
  ModelComparisonResult,
  ChangeStatus,
} from "@sitesentinel/shared";

export interface ChangeAwareAnalysisResult {
  comparable: boolean;
  comparability_note: string;
  updatedCurrentFindings: Finding[];
  resolvedPreviousFindings: Array<{
    id: string;
    title: string;
    category: string;
    evidence: string;
  }>;
}

export function applyChangeDetection(
  currentFindings: Finding[],
  previousFindings: Finding[],
  modelComparison?: ModelComparisonResult | null
): ChangeAwareAnalysisResult {
  if (!previousFindings || previousFindings.length === 0) {
    // No previous baseline exists
    return {
      comparable: true,
      comparability_note: "Initial inspection baseline established. No prior inspection for comparison.",
      updatedCurrentFindings: currentFindings.map((f) => ({
        ...f,
        change: "not_compared" as ChangeStatus,
        change_note: "First documented inspection on record.",
      })),
      resolvedPreviousFindings: [],
    };
  }

  // If model comparison output is supplied and valid
  if (modelComparison && modelComparison.comparable) {
    const changesMap = new Map<string, { change: ChangeStatus; evidence: string; stillPresent: boolean }>();
    for (const item of modelComparison.previous_finding_changes) {
      changesMap.set(item.previous_finding_id, {
        change: item.change,
        evidence: item.change_evidence,
        stillPresent: item.still_present,
      });
    }

    const matchedPreviousIds = new Set<string>();

    const updatedCurrent = currentFindings.map((currentFinding) => {
      // Find matching previous finding if any
      const directMatch = previousFindings.find(
        (prev) => prev.category === currentFinding.category
      );

      if (directMatch && changesMap.has(directMatch.id)) {
        matchedPreviousIds.add(directMatch.id);
        const changeInfo = changesMap.get(directMatch.id)!;
        return {
          ...currentFinding,
          change: changeInfo.change,
          change_note: changeInfo.evidence,
        };
      }

      // Check if categories match
      if (directMatch) {
        matchedPreviousIds.add(directMatch.id);
        const worsened =
          (currentFinding.severity === "critical" && directMatch.severity !== "critical") ||
          (currentFinding.severity === "high" && ["moderate", "low", "informational"].includes(directMatch.severity));
        return {
          ...currentFinding,
          change: (worsened ? "worsened" : "unchanged") as ChangeStatus,
          change_note: worsened
            ? `Severity elevated from ${directMatch.severity} to ${currentFinding.severity}`
            : `Persistent condition consistent with previous inspection`,
        };
      }

      return {
        ...currentFinding,
        change: "new" as ChangeStatus,
        change_note: "Newly detected anomaly not documented in previous inspection",
      };
    });

    const resolvedPrevious = previousFindings
      .filter((prev) => !matchedPreviousIds.has(prev.id))
      .map((prev) => ({
        id: prev.id,
        title: prev.title,
        category: prev.category,
        evidence: "No longer visible in re-inspection; marked as resolved or repaired.",
      }));

    return {
      comparable: true,
      comparability_note: modelComparison.comparability_note || "Visual comparison completed against previous inspection.",
      updatedCurrentFindings: updatedCurrent,
      resolvedPreviousFindings: resolvedPrevious,
    };
  }

  // Fallback programmatic comparison (deterministic matching by category & location/title)
  const matchedPrev = new Set<string>();
  const updatedCurrent = currentFindings.map((cur) => {
    const match = previousFindings.find(
      (prev) => !matchedPrev.has(prev.id) && prev.category === cur.category
    );

    if (match) {
      matchedPrev.add(match.id);
      const severityRanks: Record<string, number> = {
        informational: 1,
        low: 2,
        moderate: 3,
        high: 4,
        critical: 5,
      };

      const prevRank = severityRanks[match.severity] ?? 3;
      const curRank = severityRanks[cur.severity] ?? 3;

      let change: ChangeStatus = "unchanged";
      let change_note = `Condition persisted from prior inspection (${match.severity})`;

      if (curRank > prevRank) {
        change = "worsened";
        change_note = `Condition worsened: severity increased from ${match.severity} to ${cur.severity}`;
      } else if (curRank < prevRank) {
        change = "improved";
        change_note = `Condition improved: severity reduced from ${match.severity} to ${cur.severity}`;
      }

      return {
        ...cur,
        change,
        change_note,
      };
    }

    return {
      ...cur,
      change: "new" as ChangeStatus,
      change_note: "New defect detected compared to prior baseline",
    };
  });

  const resolved = previousFindings
    .filter((prev) => !matchedPrev.has(prev.id))
    .map((prev) => ({
      id: prev.id,
      title: prev.title,
      category: prev.category,
      evidence: "Defect no longer identified in current viewpoint; potential remediation completed.",
    }));

  return {
    comparable: true,
    comparability_note: "Automated re-inspection comparison against baseline findings.",
    updatedCurrentFindings: updatedCurrent,
    resolvedPreviousFindings: resolved,
  };
}
