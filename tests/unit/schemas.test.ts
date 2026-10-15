import { describe, it, expect } from "vitest";
import {
  approxRegionSchema,
  analyzeRequestSchema,
  reviewSubmissionSchema,
  clientEnvSchema,
} from "@sitesentinel/shared";
import { serverEnvSchema } from "../../backend/src/config/serverEnvSchema.js";

describe("Shared Zod Schemas & Validation", () => {
  describe("approxRegionSchema", () => {
    it("validates correct normalized bounding box within [0,1]", () => {
      const valid = { x: 0.1, y: 0.2, w: 0.4, h: 0.3 };
      const res = approxRegionSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects box that overflows image width (x + w > 1)", () => {
      const overflow = { x: 0.8, y: 0.2, w: 0.4, h: 0.3 };
      const res = approxRegionSchema.safeParse(overflow);
      expect(res.success).toBe(false);
    });

    it("rejects box that overflows image height (y + h > 1)", () => {
      const overflow = { x: 0.1, y: 0.9, w: 0.2, h: 0.3 };
      const res = approxRegionSchema.safeParse(overflow);
      expect(res.success).toBe(false);
    });

    it("rejects negative coordinates", () => {
      const negative = { x: -0.1, y: 0.2, w: 0.3, h: 0.3 };
      const res = approxRegionSchema.safeParse(negative);
      expect(res.success).toBe(false);
    });
  });

  describe("analyzeRequestSchema", () => {
    it("validates compliant asset inspection request", () => {
      const input = {
        asset_id: "BR-401_A",
        asset_type: "bridge",
        asset_criticality: "high",
        inspection_type: "routine",
        compare_with_previous: true,
      };
      const res = analyzeRequestSchema.safeParse(input);
      expect(res.success).toBe(true);
    });

    it("rejects invalid characters in asset_id", () => {
      const input = {
        asset_id: "BR/401 #invalid!",
      };
      const res = analyzeRequestSchema.safeParse(input);
      expect(res.success).toBe(false);
    });
  });

  describe("reviewSubmissionSchema", () => {
    it("accepts confirmed review without correction details", () => {
      const input = {
        reviews: [
          {
            findingId: "find-123",
            decision: "confirmed",
            note: "Confirmed by inspector",
          },
        ],
      };
      const res = reviewSubmissionSchema.safeParse(input);
      expect(res.success).toBe(true);
    });

    it("enforces correctedCategory or correctedSeverity when decision is 'corrected'", () => {
      const missingCorrection = {
        reviews: [
          {
            findingId: "find-123",
            decision: "corrected",
          },
        ],
      };
      const res = reviewSubmissionSchema.safeParse(missingCorrection);
      expect(res.success).toBe(false);

      const withCorrection = {
        reviews: [
          {
            findingId: "find-123",
            decision: "corrected",
            correctedSeverity: "moderate",
          },
        ],
      };
      const res2 = reviewSubmissionSchema.safeParse(withCorrection);
      expect(res2.success).toBe(true);
    });
  });

  describe("serverEnvSchema", () => {
    it("provides safe defaults for local mode without requiring secrets", () => {
      const minimalEnv = {};
      const res = serverEnvSchema.safeParse(minimalEnv);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.DATA_MODE).toBe("local");
        expect(res.data.PORT).toBe(5000);
        expect(res.data.GEMINI_MODEL).toBe("gemini-2.5-flash");
      }
    });
  });
});
