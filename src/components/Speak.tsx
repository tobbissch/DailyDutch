import { speak, useCanSpeak } from '../lib/speech'

/** Speaker button that reads `text` aloud in Dutch. Renders nothing if the device has no Dutch voice. */
export function Speak({ text }: { text: string }) {
  const canSpeak = useCanSpeak()
  if (!canSpeak) return null
  return (
    <button type="button" className="speak" onClick={() => speak(text)} aria-label={`Listen: ${text}`} title="Listen">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
