export interface PromptAInput {
    asset_type: string;
    criticality: string;
    inspection_type: string;
    context_notes?: string;
    imageIndex?: number;
    totalImages?: number;
    frameTimestampMs?: number;
}
export declare function buildPromptA(input: PromptAInput): string;
export interface PromptBInput {
    findingTitle: string;
    category: string;
    severity: string;
    evidence_observed: string;
    inference?: string;
    asset_criticality: string;
}
export declare function buildPromptB(input: PromptBInput): string;
export interface PromptCInput {
    asset_id: string;
    asset_type: string;
    previousFindings: Array<{
        id: string;
        category: string;
        severity: string;
        evidence_observed: string;
        title: string;
    }>;
}
export declare function buildPromptC(input: PromptCInput): string;
export interface PromptDInput {
    asset_id: string;
    asset_type: string;
    findings: Array<{
        title: string;
        category: string;
        severity: string;
        evidence_observed: string;
        review_status?: string;
        change?: string;
    }>;
}
export declare function buildPromptD(input: PromptDInput): string;
//# sourceMappingURL=prompts.d.ts.map