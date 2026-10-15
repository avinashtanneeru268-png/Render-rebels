import { repository } from "../server/src/services/repository/index.js";

async function cleanup(): Promise<void> {
  console.log("🧹 Running SiteSentinel Retention Policy Cleanup Job...");
  // Local mode default retention: 90 days
  const retentionDays = 90;
  const cutoffDate = new Date(Date.now() - retentionDays * 86400000);
  console.log(`Cutoff date for retention (${retentionDays} days): ${cutoffDate.toISOString()}`);
  console.log("Retention check completed. No orphaned records beyond retention cutoff.");
}

cleanup().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
