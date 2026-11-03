import { useEffect, useState, type ReactNode } from 'react'
import { HomeIcon, ReviewIcon, SoundsIcon, WordsIcon } from './components/Icons'
import { InstallBanner, NoVoiceNotice } from './components/Notices'
import { today } from './lib/dates'
import { isDue } from './lib/srs'
import { useStore } from './lib/store'
import { Home } from './pages/Home'
import { LessonPage } from './pages/LessonPage'
import { MyWords } from './pages/MyWords'
import { Review } from './pages/Review'
import { Sounds } from './pages/Sounds'

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
  if (path === '/sounds') return <Sounds />
  return <Home />
}

type NavLinkProps = { href: string; active: boolean; icon: ReactNode; badge?: number; children: ReactNode }

function NavLink({ href, active, icon, badge, children }: NavLinkProps) {
  return (
    <a href={href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
      {icon}
      <span>
        {children}
        {!!badge && <span className="badge" aria-label={`${badge} due`}>{badge}</span>}
      </span>
    </a>
  )
}

export function App() {
  const path = useHash()
  const s = useStore()
  const day = today()
  const due = Object.values(s.cards).filter((c) => isDue(c, day)).length
  return (
    <>
      <header>
        <div className="header-inner">
          <a href="#/" className="brand">
            DailyDutch
          </a>
          <nav>
            <NavLink href="#/" active={path === '/' || path.startsWith('/lesson/')} icon={<HomeIcon />}>
              Home
            </NavLink>
            <NavLink href="#/review" active={path === '/review'} icon={<ReviewIcon />} badge={due}>
              Review
            </NavLink>
            <NavLink href="#/words" active={path === '/words'} icon={<WordsIcon />}>
              My words
            </NavLink>
            <NavLink href="#/sounds" active={path === '/sounds'} icon={<SoundsIcon />}>
              Sounds
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <InstallBanner />
        {path !== '/sounds' && <NoVoiceNotice /> /* Sounds page has its own message */}
        <Page key={path} path={path} />
      </main>
    </>
  )
}
