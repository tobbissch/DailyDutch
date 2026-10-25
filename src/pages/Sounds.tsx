import { Speak } from '../components/Speak'
import { soundRules } from '../content/sounds'
import { useCanSpeak, useVoiceName } from '../lib/speech'

export function Sounds() {
  const canSpeak = useCanSpeak()
  const voiceName = useVoiceName()
  return (
    <section className="sounds">
      <h2>Dutch sounds</h2>
      <p className="muted">
        Dutch uses the same letters as English, but many sound different. Tap the speaker to hear each example.
        {voiceName && <> Voice: {voiceName}.</>}
      </p>
      {!canSpeak && (
        <p className="panel">
          This device has no Dutch voice, so the speaker buttons are hidden. On a phone they usually work; on Windows
          you can add Dutch under Settings → Time &amp; language → Speech.
        </p>
      )}
      {soundRules.map((rule) => (
        <div key={rule.title} className="panel rule">
          <h3>{rule.title}</h3>
          <p>{rule.text}</p>
          <ul className="sound-examples">
            {rule.examples.map((e) => (
              <li key={e.nl}>
                <strong>{e.nl}</strong>
                <Speak text={e.nl} /> <span className="muted">— {e.en}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
