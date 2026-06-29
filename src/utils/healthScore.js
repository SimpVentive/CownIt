export function computeHealthScore(personId, data) {
  let score = 0;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Commits filled: 40 points
  const personCommits = data.commits.filter(c => c.personId === personId);
  const filledLevels = new Set(personCommits.map(c => c.level));
  score += (filledLevels.size / 3) * 40;

  // Monthly update done: 40 points
  const hasUpdate = data.monthlyUpdates.some(
    u =>
      u.personId === personId &&
      u.month === currentMonth &&
      u.year === currentYear
  );
  if (hasUpdate) score += 40;

  // Achievement logged this month: 20 points
  const hasAchievement = data.achievements.some(
    a =>
      a.personId === personId &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
  );
  if (hasAchievement) score += 20;

  return Math.round(score);
}
