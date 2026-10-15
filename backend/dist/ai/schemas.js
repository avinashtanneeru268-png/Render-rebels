// JSON Schemas compatible with Gemini responseSchema (subset of OpenAPI 3.0 / JSON Schema)
export const GEMINI_ANALYSIS_RESPONSE_SCHEMA = {
    type: "object",
    required: [
        "analysis_summary",
        "overall_condition",
        "image_quality",
        "findings",
        "limitations",
    ],
    properties: {
        analysis_summary: {
            type: "string",
            description: "Concise 120-200 word condition summary of the inspected asset",
        },
        overall_condition: {
            type: "string",
            enum: ["good", "fair", "poor", "critical", "indeterminate"],
        },
        image_quality: {
            type: "object",
            required: ["adequate", "issues"],
            properties: {
                adequate: { type: "boolean" },
                issues: {
                    type: "array",
                    items: { type: "string" },
                },
            },
        },
        findings: {
            type: "array",
            description: "List of physically observed visual anomalies or defects",
            items: {
                type: "object",
                required: [
                    "title",
                    "category",
                    "severity",
                    "certainty",
                    "evidence_observed",
                    "recommended_actions",
                    "requires_human_review",
                ],
                properties: {
                    title: { type: "string" },
                    category: {
                        type: "string",
                        enum: [
                            "crack",
                            "corrosion_rust",
                            "water_damage_leak",
                            "spalling_delamination",
                            "deformation_misalignment",
                            "missing_or_damaged_component",
                            "vegetation_or_debris",
                            "coating_paint_failure",
                            "thermal_or_discoloration_anomaly",
                            "safety_hazard",
                            "other",
                        ],
                    },
                    severity: {
                        type: "string",
                        enum: ["informational", "low", "moderate", "high", "critical"],
                    },
                    certainty: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                    },
                    evidence_observed: {
                        type: "string",
                        description: "Literal visible physical evidence (color, shape, position, relative extent)",
                    },
                    inference: {
                        type: "string",
                        description: "Possible physical mechanism, structural concern, or root cause",
                    },
                    approx_region: {
                        type: "object",
                        description: "Optional approximate bounding box in normalized [0,1] coordinates (x,y=top-left, w,h=dimensions)",
                        required: ["x", "y", "w", "h"],
                        properties: {
                            x: { type: "number" },
                            y: { type: "number" },
                            w: { type: "number" },
                            h: { type: "number" },
                        },
                    },
                    recommended_actions: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["action", "urgency", "rationale"],
                            properties: {
                                action: { type: "string" },
                                urgency: {
                                    type: "string",
                                    enum: [
                                        "immediate",
                                        "within_7_days",
                                        "within_30_days",
                                        "monitor",
                                        "no_action",
                                    ],
                                },
                                rationale: { type: "string" },
                            },
                        },
                    },
                    requires_human_review: { type: "boolean" },
                },
            },
        },
        limitations: {
            type: "array",
            items: { type: "string" },
        },
    },
};
export const GEMINI_COMPARISON_RESPONSE_SCHEMA = {
    type: "object",
    required: [
        "comparable",
        "comparability_note",
        "previous_finding_changes",
        "new_findings",
    ],
    properties: {
        comparable: {
            type: "boolean",
            description: "True if previous and current images capture the same area and angle reasonably well",
        },
        comparability_note: { type: "string" },
        previous_finding_changes: {
            type: "array",
            items: {
                type: "object",
                required: [
                    "previous_finding_id",
                    "still_present",
                    "change",
                    "change_evidence",
                ],
                properties: {
                    previous_finding_id: { type: "string" },
                    still_present: { type: "boolean" },
                    change: {
                        type: "string",
                        enum: [
                            "new",
                            "worsened",
                            "unchanged",
                            "improved",
                            "resolved",
                            "not_compared",
                        ],
                    },
                    change_evidence: {
                        type: "string",
                        description: "Visible differences in extent, rust coloration, crack propagation, or patching",
                    },
                },
            },
        },
        new_findings: GEMINI_ANALYSIS_RESPONSE_SCHEMA.properties.findings,
    },
};
//# sourceMappingURL=schemas.js.map