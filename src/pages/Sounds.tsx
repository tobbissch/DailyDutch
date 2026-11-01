import { Speak } from '../components/Speak'
import { soundRules } from '../content/sounds'
import { useNoDutchVoice, useVoiceName } from '../lib/speech'

export function Sounds() {
  const noVoice = useNoDutchVoice()
  const voiceName = useVoiceName()
  return (
    <section className="sounds">
      <h2>Dutch sounds</h2>
      <p className="muted">
        Dutch uses the same letters as English, but many sound different. Tap the speaker to hear each example.
        {voiceName && <> Voice: {voiceName}.</>}
      </p>
      {noVoice && (
        <p className="panel">
          Your device has no Dutch voice installed, so listening to the audio is not available. You can still read
          the rules and examples below.
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
