export declare const GEMINI_ANALYSIS_RESPONSE_SCHEMA: {
    type: "object";
    required: string[];
    properties: {
        analysis_summary: {
            type: "string";
            description: string;
        };
        overall_condition: {
            type: "string";
            enum: string[];
        };
        image_quality: {
            type: "object";
            required: string[];
            properties: {
                adequate: {
                    type: "boolean";
                };
                issues: {
                    type: "array";
                    items: {
                        type: "string";
                    };
                };
            };
        };
        findings: {
            type: "array";
            description: string;
            items: {
                type: "object";
                required: string[];
                properties: {
                    title: {
                        type: "string";
                    };
                    category: {
                        type: "string";
                        enum: string[];
                    };
                    severity: {
                        type: "string";
                        enum: string[];
                    };
                    certainty: {
                        type: "string";
                        enum: string[];
                    };
                    evidence_observed: {
                        type: "string";
                        description: string;
                    };
                    inference: {
                        type: "string";
                        description: string;
                    };
                    approx_region: {
                        type: "object";
                        description: string;
                        required: string[];
                        properties: {
                            x: {
                                type: "number";
                            };
                            y: {
                                type: "number";
                            };
                            w: {
                                type: "number";
                            };
                            h: {
                                type: "number";
                            };
                        };
                    };
                    recommended_actions: {
                        type: "array";
                        items: {
                            type: "object";
                            required: string[];
                            properties: {
                                action: {
                                    type: "string";
                                };
                                urgency: {
                                    type: "string";
                                    enum: string[];
                                };
                                rationale: {
                                    type: "string";
                                };
                            };
                        };
                    };
                    requires_human_review: {
                        type: "boolean";
                    };
                };
            };
        };
        limitations: {
            type: "array";
            items: {
                type: "string";
            };
        };
    };
};
export declare const GEMINI_COMPARISON_RESPONSE_SCHEMA: {
    type: "object";
    required: string[];
    properties: {
        comparable: {
            type: "boolean";
            description: string;
        };
        comparability_note: {
            type: "string";
        };
        previous_finding_changes: {
            type: "array";
            items: {
                type: "object";
                required: string[];
                properties: {
                    previous_finding_id: {
                        type: "string";
                    };
                    still_present: {
                        type: "boolean";
                    };
                    change: {
                        type: "string";
                        enum: string[];
                    };
                    change_evidence: {
                        type: "string";
                        description: string;
                    };
                };
            };
        };
        new_findings: {
            type: "array";
            description: string;
            items: {
                type: "object";
                required: string[];
                properties: {
                    title: {
                        type: "string";
                    };
                    category: {
                        type: "string";
                        enum: string[];
                    };
                    severity: {
                        type: "string";
                        enum: string[];
                    };
                    certainty: {
                        type: "string";
                        enum: string[];
                    };
                    evidence_observed: {
                        type: "string";
                        description: string;
                    };
                    inference: {
                        type: "string";
                        description: string;
                    };
                    approx_region: {
                        type: "object";
                        description: string;
                        required: string[];
                        properties: {
                            x: {
                                type: "number";
                            };
                            y: {
                                type: "number";
                            };
                            w: {
                                type: "number";
                            };
                            h: {
                                type: "number";
                            };
                        };
                    };
                    recommended_actions: {
                        type: "array";
                        items: {
                            type: "object";
                            required: string[];
                            properties: {
                                action: {
                                    type: "string";
                                };
                                urgency: {
                                    type: "string";
                                    enum: string[];
                                };
                                rationale: {
                                    type: "string";
                                };
                            };
                        };
                    };
                    requires_human_review: {
                        type: "boolean";
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=schemas.d.ts.map