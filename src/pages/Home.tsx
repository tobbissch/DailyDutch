import { lessons } from '../lib/content'
import { streak, today } from '../lib/dates'
import { isDue, KNOWN_BOX } from '../lib/srs'
import { useStore } from '../lib/store'

export function Home() {
  const s = useStore()
  const day = today()
  const next = lessons.find((l) => !s.completed[l.day])
  const doneToday = Object.values(s.completed).includes(day)
  const due = Object.values(s.cards).filter((c) => isDue(c, day)).length
  const known = Object.values(s.cards).filter((c) => c.box >= KNOWN_BOX).length

  return (
    <>
      <section className="panel">
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
      </section>

      <section className="panel">
        <p className="label">Review</p>
        <h2>{due === 0 ? 'Nothing due' : `${due} word${due === 1 ? '' : 's'} due`}</h2>
        {due > 0 && (
          <a className="button" href="#/review">
            Review
          </a>
        )}
      </section>

      <section className="stats">
        <div>
          <strong>{streak(s.activity, day)}</strong>
          <span>day streak</span>
        </div>
        <div>
          <strong>{known}</strong>
          <span>words known</span>
        </div>
        <div>
          <strong>{Object.keys(s.completed).length}</strong>
          <span>lessons done</span>
        </div>
      </section>

      {Object.keys(s.completed).length > 0 && (
        <section>
          <p className="label">Past lessons</p>
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
        </section>
      )}
    </>
  )
}
