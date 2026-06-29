import type { AppData } from '../data/seed'
import { currentMonth, currentYear, isCurrentMonth } from './formatDate'

export function computeHealthScore(
  personId: string,
  data: AppData
): number {
  let score = 0

  // 40 points: all 3 commit levels have at least 1 commit
  const levels = ['self', 'team', 'org']
  const personCommits = data.commits.filter(
    c => c.personId === personId
  )
  const filledLevels = levels.filter(level =>
    personCommits.some(c => c.level === level as 'self' | 'team' | 'org')
  )
  score += (filledLevels.length / 3) * 40

  // 40 points: monthly update exists for current month
  const hasUpdate = data.monthlyUpdates.some(u =>
    u.personId === personId &&
    u.month === currentMonth() &&
    u.year === currentYear()
  )
  if (hasUpdate) score += 40

  // 20 points: achievement logged in current month
  const hasAchievement = data.achievements.some(a =>
    a.personId === personId &&
    isCurrentMonth(a.date)
  )
  if (hasAchievement) score += 20

  return Math.round(score)
}
