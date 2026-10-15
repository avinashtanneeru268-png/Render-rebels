export interface DemoCaseDefinition {
    id: string;
    asset_code: string;
    asset_name: string;
    asset_type: string;
    asset_criticality: "low" | "medium" | "high";
    inspection_type: "routine" | "post_event" | "follow_up";
    title: string;
    description: string;
    imageFileName: string;
    isPair?: boolean;
    pairRole?: "baseline" | "reinspection";
    linkedBaselineId?: string;
    result: {
        overall_condition: "good" | "fair" | "poor" | "critical";
        summary: string;
        limitations: string[];
        findings: Array<{
            category: string;
            severity: string;
            certainty: string;
            title: string;
            evidence_observed: string;
            inference: string;
            approx_region: {
                x: number;
                y: number;
                w: number;
                h: number;
            };
            change: string;
            change_note: string;
            recommended_actions: Array<{
                action: string;
                urgency: string;
                source: string;
                rationale: string;
            }>;
        }>;
    };
}
export declare const DEMO_CASES: DemoCaseDefinition[];
//# sourceMappingURL=demoCases.d.ts.map