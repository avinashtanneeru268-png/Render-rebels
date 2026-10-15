// JSON Schemas compatible with Gemini responseSchema (subset of OpenAPI 3.0 / JSON Schema)

export const GEMINI_ANALYSIS_RESPONSE_SCHEMA = {
  type: "object" as const,
  required: [
    "analysis_summary",
    "overall_condition",
    "image_quality",
    "findings",
    "limitations",
  ],
  properties: {
    analysis_summary: {
      type: "string" as const,
      description: "Concise 120-200 word condition summary of the inspected asset",
    },
    overall_condition: {
      type: "string" as const,
      enum: ["good", "fair", "poor", "critical", "indeterminate"],
    },
    image_quality: {
      type: "object" as const,
      required: ["adequate", "issues"],
      properties: {
        adequate: { type: "boolean" as const },
        issues: {
          type: "array" as const,
          items: { type: "string" as const },
        },
      },
    },
    findings: {
      type: "array" as const,
      description: "List of physically observed visual anomalies or defects",
      items: {
        type: "object" as const,
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
          title: { type: "string" as const },
          category: {
            type: "string" as const,
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
            type: "string" as const,
            enum: ["informational", "low", "moderate", "high", "critical"],
          },
          certainty: {
            type: "string" as const,
            enum: ["low", "medium", "high"],
          },
          evidence_observed: {
            type: "string" as const,
            description: "Literal visible physical evidence (color, shape, position, relative extent)",
          },
          inference: {
            type: "string" as const,
            description: "Possible physical mechanism, structural concern, or root cause",
          },
          approx_region: {
            type: "object" as const,
            description: "Optional approximate bounding box in normalized [0,1] coordinates (x,y=top-left, w,h=dimensions)",
            required: ["x", "y", "w", "h"],
            properties: {
              x: { type: "number" as const },
              y: { type: "number" as const },
              w: { type: "number" as const },
              h: { type: "number" as const },
            },
          },
          recommended_actions: {
            type: "array" as const,
            items: {
              type: "object" as const,
              required: ["action", "urgency", "rationale"],
              properties: {
                action: { type: "string" as const },
                urgency: {
                  type: "string" as const,
                  enum: [
                    "immediate",
                    "within_7_days",
                    "within_30_days",
                    "monitor",
                    "no_action",
                  ],
                },
                rationale: { type: "string" as const },
              },
            },
          },
          requires_human_review: { type: "boolean" as const },
        },
      },
    },
    limitations: {
      type: "array" as const,
      items: { type: "string" as const },
    },
  },
};

export const GEMINI_COMPARISON_RESPONSE_SCHEMA = {
  type: "object" as const,
  required: [
    "comparable",
    "comparability_note",
    "previous_finding_changes",
    "new_findings",
  ],
  properties: {
    comparable: {
      type: "boolean" as const,
      description: "True if previous and current images capture the same area and angle reasonably well",
    },
    comparability_note: { type: "string" as const },
    previous_finding_changes: {
      type: "array" as const,
      items: {
        type: "object" as const,
        required: [
          "previous_finding_id",
          "still_present",
          "change",
          "change_evidence",
        ],
        properties: {
          previous_finding_id: { type: "string" as const },
          still_present: { type: "boolean" as const },
          change: {
            type: "string" as const,
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
            type: "string" as const,
            description: "Visible differences in extent, rust coloration, crack propagation, or patching",
          },
        },
      },
    },
    new_findings: GEMINI_ANALYSIS_RESPONSE_SCHEMA.properties.findings,
  },
};
