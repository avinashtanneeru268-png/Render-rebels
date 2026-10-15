import { Severity, ChangeStatus, CertaintyLevel, CriticalityLevel } from "@sitesentinel/shared";
export interface PriorityCalculationResult {
    score: number;
    factors: {
        baseWeight: number;
        changeModifier: number;
        certaintyFactor: number;
        criticalityMultiplier: number;
        formula: string;
        explanation: string;
    };
}
export declare function calculatePriorityScore(severity: Severity, change?: ChangeStatus, certainty?: CertaintyLevel, assetCriticality?: CriticalityLevel): PriorityCalculationResult;
//# sourceMappingURL=priority.d.ts.map