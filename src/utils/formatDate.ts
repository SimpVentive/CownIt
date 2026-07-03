export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

export function currentMonthName(): string {
  return new Date().toLocaleString('en-US', { month: 'long' })
}

export function currentMonth(): number {
  return new Date().getMonth() + 1
}

export function currentYear(): number {
  return new Date().getFullYear()
}

export function lastDayOfNextMonth(): string {
  const now = new Date()
  const nextMonth = now.getMonth() + 2
  const lastDay = new Date(now.getFullYear(), nextMonth, 0)
  const month = lastDay.toLocaleString('en-US', { month: 'short' })
  const day = lastDay.getDate()
  const year = lastDay.getFullYear()
  return `${month} ${day}, ${year}`
}

export function isCurrentMonth(isoString: string): boolean {
  const date = new Date(isoString)
  const now = new Date()
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}
