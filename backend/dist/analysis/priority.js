export function calculatePriorityScore(severity, change = "not_compared", certainty = "medium", assetCriticality = "medium") {
    const baseWeights = {
        critical: 95,
        high: 75,
        moderate: 50,
        low: 25,
        informational: 10,
    };
    const changeModifiers = {
        worsened: 15,
        new: 10,
        unchanged: 0,
        not_compared: 0,
        improved: -10,
        resolved: -25,
    };
    const certaintyFactors = {
        high: 1.0,
        medium: 0.85,
        low: 0.7,
    };
    const criticalityMultipliers = {
        high: 1.25,
        medium: 1.0,
        low: 0.85,
    };
    const baseWeight = baseWeights[severity] ?? 50;
    const changeModifier = changeModifiers[change] ?? 0;
    const certaintyFactor = certaintyFactors[certainty] ?? 0.85;
    const criticalityMultiplier = criticalityMultipliers[assetCriticality] ?? 1.0;
    const raw = (baseWeight + changeModifier) * certaintyFactor * criticalityMultiplier;
    const score = Math.max(1, Math.min(100, Math.round(raw)));
    const formula = "clamp(1, 100, round((baseWeight + changeModifier) * certaintyFactor * criticalityMultiplier))";
    const explanation = `Base (${baseWeight}) + Change [${change}] (${changeModifier >= 0 ? "+" : ""}${changeModifier}) × Certainty [${certainty}] (${certaintyFactor}) × Asset Criticality [${assetCriticality}] (${criticalityMultiplier}) = ${score}/100`;
    return {
        score,
        factors: {
            baseWeight,
            changeModifier,
            certaintyFactor,
            criticalityMultiplier,
            formula,
            explanation,
        },
    };
}
//# sourceMappingURL=priority.js.map