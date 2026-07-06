import type { AppData, CommitLevel, Dim } from "./types";

/** Formats an ISO string like "Jun 15, 2026". */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/** Formats an ISO string like "Jun 15" (short, no year). */
export function formatDateShort(isoString: string | null | undefined): string {
  if (!isoString) return "Never";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

/**
 * Health score: commits filled (40) + monthly update done (40) +
 * achievement logged this month (20).
 */
export function computeHealthScore(personId: string, data: AppData): number {
  let score = 0;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const personCommits = data.commits.filter((c) => c.personId === personId);
  const filledLevels = new Set(personCommits.map((c) => c.level));
  score += (filledLevels.size / 3) * 40;

  const hasUpdate = data.monthlyUpdates.some(
    (u) => u.personId === personId && u.month === currentMonth && u.year === currentYear
  );
  if (hasUpdate) score += 40;

  const hasAchievement = data.achievements.some(
    (a) =>
      a.personId === personId &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
  );
  if (hasAchievement) score += 20;

  return Math.round(score);
}

export const COMMIT_LEVELS: CommitLevel[] = ["self", "team", "org"];

export const COMMIT_LABELS: Record<CommitLevel, string> = {
  self: "Self",
  team: "Team / Dept",
  org: "Organisation",
};

export const COMMIT_STYLES: Record<CommitLevel, { bg: string; text: string }> = {
  self: { bg: "#EEEDFE", text: "#3C3489" },
  team: { bg: "#E1F5EE", text: "#085041" },
  org: { bg: "#FAEEDA", text: "#633806" },
};

export const CPQSDP_DIMS: { key: Dim; label: string; color: string }[] = [
  { key: "C", label: "Cost", color: "#534AB7" },
  { key: "P", label: "Productivity", color: "#0F6E56" },
  { key: "Q", label: "Quality", color: "#3B6D11" },
  { key: "S", label: "Safety", color: "#993C1D" },
  { key: "D", label: "Delivery", color: "#185FA5" },
  { key: "O", label: "People", color: "#854F0B" },
];

export const CPQSDP_COLORS: Record<Dim, string> = {
  C: "#534AB7",
  P: "#0F6E56",
  Q: "#3B6D11",
  S: "#993C1D",
  D: "#185FA5",
  O: "#854F0B",
};

export const CPQSDP_LABELS: Record<Dim, string> = {
  C: "Cost",
  P: "Productivity",
  Q: "Quality",
  S: "Safety",
  D: "Delivery",
  O: "People",
};
