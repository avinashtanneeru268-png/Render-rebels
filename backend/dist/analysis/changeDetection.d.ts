import { Finding, ModelComparisonResult } from "@sitesentinel/shared";
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
export declare function applyChangeDetection(currentFindings: Finding[], previousFindings: Finding[], modelComparison?: ModelComparisonResult | null): ChangeAwareAnalysisResult;
//# sourceMappingURL=changeDetection.d.ts.map