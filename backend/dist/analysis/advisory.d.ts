import { FindingCategory, Severity, ChangeStatus, AssetType, UrgencyLevel, RecommendedAction } from "@sitesentinel/shared";
export declare const STANDING_ADVISORY_DISCLAIMER = "SiteSentinel visual assessments and recommendations are designed to assist qualified inspection personnel and do not constitute certified structural engineering, code compliance, or safety certification.";
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
export declare function generateRuleBasedActions(category: FindingCategory, severity: Severity, change?: ChangeStatus, assetType?: AssetType): RecommendedAction[];
export declare function mergeRecommendations(ruleActions: RecommendedAction[], modelActions: Array<{
    action: string;
    urgency: UrgencyLevel;
    rationale: string;
}>): RecommendedAction[];
//# sourceMappingURL=advisory.d.ts.map