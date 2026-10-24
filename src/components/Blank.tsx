import { useState } from 'react'
import { isCorrect } from '../lib/answer'

type Props = { answer: string; onDone?: (correct: boolean) => void }

/** Inline input that checks itself against `answer` on Enter or blur-free "check". */
export function Blank({ answer, onDone }: Props) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<'right' | 'wrong' | null>(null)

  function check() {
    if (result || !value.trim()) return
    const ok = isCorrect(value, answer)
    setResult(ok ? 'right' : 'wrong')
    onDone?.(ok)
  }

  return (
    <span className={`blank ${result ?? ''}`}>
      <input
        value={value}
        disabled={result !== null}
        size={Math.max(answer.length, 3)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {result === null && (
        <button type="button" className="small" onClick={check}>
          check
        </button>
      )}
      {result === 'wrong' && <span className="correction">{answer}</span>}
    </span>
  )
}
