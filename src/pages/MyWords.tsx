import { useState, type FormEvent } from 'react'
import { Speak } from '../components/Speak'
import { displayNl } from '../lib/content'
import { addMyWord, removeMyWord, useStore } from '../lib/store'

export function MyWords() {
  const s = useStore()
  const [nl, setNl] = useState('')
  const [en, setEn] = useState('')
  const [article, setArticle] = useState<'' | 'de' | 'het'>('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!nl.trim() || !en.trim()) return
    addMyWord({ nl: nl.trim(), en: en.trim(), ...(article && { article }) })
    setNl('')
    setEn('')
    setArticle('')
  }

  return (
    <>
      <h2>My words</h2>
      <p className="muted">Words you meet in daily life. They join your reviews right away. Only you see them.</p>

      <form className="panel add-word" onSubmit={submit}>
        <div className="row">
          <select value={article} onChange={(e) => setArticle(e.target.value as typeof article)}>
            <option value="">—</option>
            <option value="de">de</option>
            <option value="het">het</option>
          </select>
          <input placeholder="Dutch" value={nl} onChange={(e) => setNl(e.target.value)} autoCapitalize="off" />
        </div>
        <input placeholder="English" value={en} onChange={(e) => setEn(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul className="list">
        {[...s.myWords].reverse().map((w) => (
          <li key={w.id} className="word-head">
            <span>
              <strong>{displayNl(w)}</strong> <Speak text={displayNl(w)} /> <span className="muted">{w.en}</span>
            </span>
            <button type="button" className="link" onClick={() => removeMyWord(w.id)}>
              remove
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
