import { useEffect, useState } from 'react'
import { Home } from './pages/Home'
import { LessonPage } from './pages/LessonPage'
import { MyWords } from './pages/MyWords'
import { Review } from './pages/Review'

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const onChange = () => setHash(location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash.replace(/^#/, '') || '/'
}

function Page({ path }: { path: string }) {
  const lesson = path.match(/^\/lesson\/(\d+)$/)
  if (lesson) return <LessonPage key={lesson[1]} day={Number(lesson[1])} />
  if (path === '/review') return <Review />
  if (path === '/words') return <MyWords />
  return <Home />
}

export function App() {
  const path = useHash()
  return (
    <>
      <header>
        <a href="#/" className="brand">
          DailyDutch
        </a>
        <nav>
          <a href="#/review" className={path === '/review' ? 'active' : ''}>
            Review
          </a>
          <a href="#/words" className={path === '/words' ? 'active' : ''}>
            My words
          </a>
        </nav>
      </header>
      <main>
        <Page key={path} path={path} />
      </main>
    </>
  )
}
