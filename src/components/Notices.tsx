import { useState } from 'react'
import { isInstalled, isIOS, promptInstall, useCanPromptInstall } from '../lib/install'
import { useNoDutchVoice } from '../lib/speech'

/** Dismissed state remembered per device. Storage may be blocked (private mode), so never throw. */
function useDismissed(key: string): [boolean, () => void] {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(key) === '1'
    } catch {
      return false
    }
  })
  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
  }
  return [dismissed, dismiss]
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-label="Share" className="inline-icon">
      <path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 11v9h12v-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

/** "Install the app" banner: native dialog on Android/Chrome, Add to Home Screen steps on iOS. */
export function InstallBanner() {
  const canPrompt = useCanPromptInstall()
  const [dismissed, dismiss] = useDismissed('dd-install-dismissed')
  if (isInstalled || dismissed) return null

  if (canPrompt) {
    return (
      <div className="notice" role="region" aria-label="Install app">
        <p>Install DailyDutch on your device for quick access and offline use.</p>
        <div className="notice-actions">
          <button type="button" className="small-btn" onClick={() => promptInstall()}>
            Install app
          </button>
          <button type="button" className="link" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    )
  }

  if (isIOS) {
    return (
      <div className="notice" role="region" aria-label="Install app">
        <p>
          Install DailyDutch: tap <ShareIcon /> <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
        </p>
        <div className="notice-actions">
          <button type="button" className="link" onClick={dismiss}>
            Got it
          </button>
        </div>
      </div>
    )
  }

  return null
}

/** Tells the user audio is unavailable when the device has no Dutch voice. */
export function NoVoiceNotice() {
  const noVoice = useNoDutchVoice()
  const [dismissed, dismiss] = useDismissed('dd-novoice-dismissed')
  if (!noVoice || dismissed) return null
  return (
    <div className="notice" role="status">
      <p>Your device has no Dutch voice installed, so listening to the audio is not available.</p>
      <div className="notice-actions">
        <button type="button" className="link" onClick={dismiss}>
          OK
        </button>
      </div>
    </div>
  )
}
