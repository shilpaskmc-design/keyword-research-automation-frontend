/**
 * formatRunDate — presentation-only utility for Final Results.
 *
 * Converts a backend ISO 8601 UTC datetime string (final_stage_completed_at)
 * into a human-readable local date and time suitable for display in the Run Date
 * column and ActiveRunFilterNotice.
 *
 * Kept in the feature's utils/ because no other feature currently reuses this.
 * Extract to global lib/ only when real cross-feature reuse is demonstrated.
 */

/** Formats an ISO datetime string as a readable local date + time. */
export function formatRunDate(isoString: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(isoString));
  } catch {
    // If the string is malformed, return it as-is rather than crashing.
    return isoString;
  }
}
