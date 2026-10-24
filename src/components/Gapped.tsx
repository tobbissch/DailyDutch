import { Blank } from './Blank'

/** Renders `text` with the first occurrence of `marker` replaced by a Blank for `answer`. */
export function Gapped({ text, marker, answer }: { text: string; marker: string; answer: string }) {
  const i = text.indexOf(marker)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <Blank answer={answer} />
      {text.slice(i + marker.length)}
    </>
  )
}
