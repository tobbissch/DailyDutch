import { CheckIcon, FlameIcon } from '../components/Icons'
import { Progress } from '../components/Progress'
import { lessons } from '../lib/content'
import { streak, today } from '../lib/dates'
import { isDue, KNOWN_BOX } from '../lib/srs'
import { useStore } from '../lib/store'

export function Home() {
  const s = useStore()
  const day = today()
  const next = lessons.find((l) => !s.completed[l.day])
  const doneToday = Object.values(s.completed).includes(day)
  const cards = Object.values(s.cards)
  const due = cards.filter((c) => isDue(c, day)).length
  const known = cards.filter((c) => c.box >= KNOWN_BOX).length
  const doneCount = Object.keys(s.completed).length

  return (
    <>
      <section className="panel hero">
        {next ? (
          <>
            <p className="label">{doneToday ? 'Done today — next up' : "Today's lesson"}</p>
            <h2>
              Day {next.day}: {next.title}
            </h2>
            <a className="button" href={`#/lesson/${next.day}`}>
              {doneToday ? 'Continue anyway' : 'Start'}
            </a>
          </>
        ) : (
          <>
            <p className="label">All lessons done</p>
            <h2>New lessons coming soon.</h2>
          </>
        )}
        <div className="hero-progress">
          <Progress value={doneCount} max={lessons.length} label="Lessons done" />
          <p>
            {doneCount} of {lessons.length} lessons done
          </p>
        </div>
      </section>

      <section className="panel review-row">
        <div>
          <p className="label">Review</p>
          {due > 0 ? (
            <h2>
              {due} word{due === 1 ? '' : 's'} due
            </h2>
          ) : cards.length > 0 ? (
            <h2>
              <CheckIcon /> All caught up
            </h2>
          ) : (
            <h2>Nothing due yet</h2>
          )}
        </div>
        {due > 0 && (
          <a className="button" href="#/review">
            Review
          </a>
        )}
      </section>

      <section className="stats">
        <div className="streak">
          <strong>
            <FlameIcon />
            {streak(s.activity, day)}
          </strong>
          <span>day streak</span>
        </div>
        <div>
          <strong>{known}</strong>
          <span>words known</span>
        </div>
        <div>
          <strong>{doneCount}</strong>
          <span>lessons done</span>
        </div>
      </section>

      {doneCount > 0 && (
        <details className="past">
          <summary>Past lessons ({doneCount})</summary>
          <ul className="list">
            {lessons
              .filter((l) => s.completed[l.day])
              .map((l) => (
                <li key={l.day}>
                  <a href={`#/lesson/${l.day}`}>
                    Day {l.day}: {l.title}
                  </a>
                </li>
              ))}
          </ul>
        </details>
      )}
    </>
  )
}
