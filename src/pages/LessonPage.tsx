import { useState } from 'react'
import { Gapped } from '../components/Gapped'
import { displayNl, getLesson } from '../lib/content'
import { completeLesson, useStore } from '../lib/store'

const STEPS = ['Words', 'Grammar', 'Dialogue'] as const

export function LessonPage({ day }: { day: number }) {
  const s = useStore()
  const lesson = getLesson(day)
  const [step, setStep] = useState(0)
  const [showEn, setShowEn] = useState(false)

  if (!lesson) return <p>Lesson not found.</p>
  const unlocked = day === 1 || s.completed[day] || s.completed[day - 1]
  if (!unlocked) return <p>Finish day {day - 1} first.</p>

  const finished = step === STEPS.length

  function next() {
    if (step === STEPS.length - 1) completeLesson(lesson!.day, lesson!.words.map((w) => w.id))
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <p className="label">Day {lesson.day}</p>
      <h2>{lesson.title}</h2>

      {!finished && (
        <ol className="steps">
          {STEPS.map((name, i) => (
            <li key={name} className={i === step ? 'current' : i < step ? 'done' : ''}>
              {name}
            </li>
          ))}
        </ol>
      )}

      {step === 0 && (
        <ul className="words">
          {lesson.words.map((w) => (
            <li key={w.id}>
              <div className="word-head">
                <strong>{displayNl(w)}</strong>
                <span>{w.en}</span>
              </div>
              {w.plural && <div className="muted">plural: de {w.plural}</div>}
              {w.example && (
                <div className="example">
                  {w.example.nl} <span className="muted">— {w.example.en}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {step === 1 && (
        <section>
          <h3>{lesson.grammar.title}</h3>
          <ul className="points">
            {lesson.grammar.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <ul className="examples">
            {lesson.grammar.examples.map((e) => (
              <li key={e.nl}>
                {e.nl} <span className="muted">— {e.en}</span>
              </li>
            ))}
          </ul>
          <h3>Practice</h3>
          <ol className="exercises">
            {lesson.grammar.exercises.map((ex) => (
              <li key={ex.prompt}>
                <Gapped text={ex.prompt} marker="___" answer={ex.answer} />
                {ex.hint && <span className="muted"> ({ex.hint})</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {step === 2 && (
        <section>
          <h3>{lesson.dialogue.title}</h3>
          <p className="muted">{lesson.dialogue.scene}</p>
          <dl className="dialogue">
            {lesson.dialogue.lines.map((line, i) => (
              <div key={i}>
                <dt>{line.speaker}</dt>
                <dd>
                  {line.gap ? <Gapped text={line.nl} marker={line.gap} answer={line.gap} /> : line.nl}
                  {showEn && <div className="muted">{line.en}</div>}
                </dd>
              </div>
            ))}
          </dl>
          <button type="button" className="link" onClick={() => setShowEn(!showEn)}>
            {showEn ? 'Hide' : 'Show'} translation
          </button>
        </section>
      )}

      {finished ? (
        <section className="panel">
          <h2>Les klaar!</h2>
          <p>{lesson.words.length} new words added to your reviews. They come back tomorrow.</p>
          <a className="button" href="#/">
            Home
          </a>
        </section>
      ) : (
        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button type="button" onClick={next}>
            {step === STEPS.length - 1 ? 'Finish lesson' : 'Next'}
          </button>
        </div>
      )}
    </>
  )
}
