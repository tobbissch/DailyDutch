import { useState } from 'react'
import { Speak } from '../components/Speak'
import { isCorrect } from '../lib/answer'
import { displayNl, lessonWords } from '../lib/content'
import { today } from '../lib/dates'
import { isDue } from '../lib/srs'
import { answerCard, useStore } from '../lib/store'
import type { Word } from '../types'

type Result = { correct: boolean; input: string }

export function Review() {
  const s = useStore()

  // Queue is fixed when the session starts; wrong answers go to the back until right.
  const [initial] = useState(() => {
    const mine = new Map(s.myWords.map((w) => [w.id, w]))
    const day = today()
    return Object.entries(s.cards)
      .filter(([, c]) => isDue(c, day))
      .map(([id]) => lessonWords.get(id) ?? mine.get(id))
      .filter((w): w is Word => !!w)
      .sort(() => Math.random() - 0.5)
  })

  const [queue, setQueue] = useState(initial)
  const [graded, setGraded] = useState(new Set<string>())
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const word = queue[0]
  if (!word) {
    return (
      <section className="panel">
        <h2>{initial.length ? 'Goed gedaan!' : 'Nothing to review'}</h2>
        <p>{initial.length ? `${initial.length} words reviewed.` : 'Come back tomorrow.'}</p>
        <a className="button" href="#/">
          Home
        </a>
      </section>
    )
  }

  const expected = displayNl(word)

  function check() {
    if (!input.trim()) return
    setResult({ correct: isCorrect(input, expected), input })
  }

  function next(correct: boolean) {
    // Only the first answer in a session moves the card.
    if (!graded.has(word.id)) {
      answerCard(word.id, correct)
      setGraded(new Set(graded).add(word.id))
    }
    const rest = queue.slice(1)
    setQueue(correct ? rest : [...rest, word])
    setInput('')
    setResult(null)
  }

  return (
    <section className="panel review">
      <p className="label">{queue.length} left</p>
      <h2>{word.en}</h2>
      {word.article && <p className="muted">noun — include de/het</p>}

      <input
        autoFocus
        value={input}
        disabled={result !== null}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          if (result) next(result.correct)
          else check()
        }}
        placeholder="Type in Dutch"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {result === null ? (
        <div className="actions">
          <button type="button" onClick={check}>
            Check
          </button>
        </div>
      ) : (
        <>
          <p className={result.correct ? 'right' : 'wrong'}>
            {result.correct ? 'Goed!' : <>Correct: <strong>{expected}</strong></>} <Speak text={expected} />
          </p>
          {word.example && (
            <p className="example">
              {word.example.nl} <Speak text={word.example.nl} /> <span className="muted">— {word.example.en}</span>
            </p>
          )}
          <div className="actions">
            {!result.correct && (
              <button type="button" className="secondary" onClick={() => next(true)}>
                I was right
              </button>
            )}
            <button type="button" onClick={() => next(result.correct)}>
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}
