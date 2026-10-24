import { describe, expect, it } from 'vitest'
import { isCorrect } from './answer'
import { addDays, streak } from './dates'
import { grade, INTERVALS, isDue, newCard } from './srs'

describe('srs', () => {
  it('moves up a box when correct', () => {
    const c = grade({ box: 2, due: '2026-01-01' }, true, '2026-01-01')
    expect(c).toEqual({ box: 3, due: addDays('2026-01-01', INTERVALS[3]) })
  })

  it('drops to box 1 when wrong, due tomorrow', () => {
    expect(grade({ box: 5, due: '2026-01-01' }, false, '2026-01-01')).toEqual({ box: 1, due: '2026-01-02' })
  })

  it('caps at the last box', () => {
    expect(grade({ box: INTERVALS.length - 1, due: '2026-01-01' }, true, '2026-01-01').box).toBe(INTERVALS.length - 1)
  })

  it('new card is due after the delay', () => {
    const c = newCard('2026-01-01', 1)
    expect(isDue(c, '2026-01-01')).toBe(false)
    expect(isDue(c, '2026-01-02')).toBe(true)
  })
})

describe('dates', () => {
  it('adds days across months', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('counts streak ending today or yesterday', () => {
    const a = ['2026-01-01', '2026-01-02', '2026-01-03']
    expect(streak(a, '2026-01-03')).toBe(3)
    expect(streak(a, '2026-01-04')).toBe(3)
    expect(streak(a, '2026-01-05')).toBe(0)
  })
})

describe('answer', () => {
  it('ignores case, spacing and punctuation', () => {
    expect(isCorrect('  Hoe  gaat het ', 'hoe gaat het?')).toBe(true)
    expect(isCorrect('het brood', 'de brood')).toBe(false)
  })
})
