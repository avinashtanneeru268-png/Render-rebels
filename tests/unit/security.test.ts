import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Security Audit & Secrets Isolation", () => {
  it("ensures no server secrets appear in the client production bundle", () => {
    const frontendDist = fs.existsSync(path.resolve(process.cwd(), "frontend", "dist"))
      ? path.resolve(process.cwd(), "frontend", "dist")
      : path.resolve(process.cwd(), "client", "dist");
    if (!fs.existsSync(frontendDist)) {
      // If not built yet, skip
      return;
    }

    function scanFiles(dir: string): string[] {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(scanFiles(fullPath));
        } else if (file.endsWith(".js") || file.endsWith(".html")) {
          results.push(fullPath);
        }
      });
      return results;
    }

    const files = scanFiles(frontendDist);
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      // Must never contain sensitive server environment references
      expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
      expect(content).not.toContain("GEMINI_API_KEY");
      expect(content).not.toContain("local-sitesentinel-secret");
    }
  });
});
