/** Dates are local calendar days as "YYYY-MM-DD"; string comparison orders them. */

export function today(now = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

export function addDays(day: string, n: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + n)
  return date.toISOString().slice(0, 10)
}

/** Consecutive active days ending today, or yesterday if today has no activity yet. */
export function streak(activity: string[], day: string): number {
  const days = new Set(activity)
  let cursor = days.has(day) ? day : addDays(day, -1)
  let count = 0
  while (days.has(cursor)) {
    count++
    cursor = addDays(cursor, -1)
  }
  return count
}
