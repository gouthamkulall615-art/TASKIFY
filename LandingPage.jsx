import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GripVertical, Check, Plus, Smartphone, ListChecks, MoveVertical, Github } from 'lucide-react'

const APP_URL = './app.html'
const GITHUB_URL = 'https://github.com/your-username/taskify'

const TASKS = [
  { id: 1, t: 'Finish the lab report', done: true },
  { id: 2, t: 'Review pull requests', done: false },
  { id: 3, t: 'Buy groceries', done: false },
  { id: 4, t: 'Practice 2 problems', done: false },
  { id: 5, t: 'Plan the week', done: false },
]

const INSTALL = {
  Android: ['Open Taskify in Chrome.', 'Tap the menu, then Install app.', 'Open it from your home screen.'],
  iPhone: ['Open Taskify in Safari.', 'Tap Share, then Add to Home Screen.', 'Open it from your home screen.'],
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600&display=swap');
:root{--bg:#FAF3FB;--ink:#2A1038;--purple:#6B3FA0;--purple-d:#4C2A7A;--pink:#F27FB5;--pink-l:#FBD3E6;--lilac:#E4D4F6;--blush:#FDE8F1;--white:#fff}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:'Figtree',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}
.disp{font-family:'Bricolage Grotesque','Figtree',sans-serif;font-weight:800;letter-spacing:-.035em;line-height:1}
.wrap{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.5rem;border-radius:999px;font-weight:600;font-size:.95rem;text-decoration:none;border:2px solid var(--ink);transition:background .15s,color .15s}
.btn-purple{background:var(--purple);color:#fff;border-color:var(--purple)}
.btn-purple:hover{background:var(--purple-d);border-color:var(--purple-d)}
.btn-pink{background:var(--pink);color:var(--ink)}
.btn-pink:hover{background:var(--ink);color:var(--pink)}
.btn-line{background:transparent;color:var(--ink)}
.btn-line:hover{background:var(--lilac)}
.tile{border-radius:2rem;padding:2rem;overflow:hidden}
.reveal{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
.reveal.in{opacity:1;transform:none}
:focus-visible{outline:3px solid var(--purple);outline-offset:3px}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
`

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#6B3FA0" />
      <polyline points="9.4,16.6 14,21.2 22.8,11.6" fill="none" stroke="#FBD3E6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Header() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg)' }}>
      <nav aria-label="Main" className="wrap flex items-center justify-between" style={{ height: 76 }}>
        <a href="#top" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <Logo />
          <span className="disp" style={{ fontSize: '1.6rem' }}>Taskify</span>
        </a>
        <ul className="hidden md:flex gap-9" style={{ listStyle: 'none', margin: 0, padding: 0, fontWeight: 500 }}>
          <li><a href="#features" style={{ textDecoration: 'none' }}>Features</a></li>
          <li><a href="#install" style={{ textDecoration: 'none' }}>Install</a></li>
        </ul>
        <a href={APP_URL} target="_blank" rel="noreferrer" className="btn btn-purple" style={{ padding: '.6rem 1.2rem' }}>Launch App</a>
      </nav>
    </header>
  )
}

function Phone() {
  const [s, setS] = useState({ order: TASKS.map((x) => x.id), lift: null })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let drop
    const id = setInterval(() => {
      setS((p) => ({ ...p, lift: p.order[3] }))
      drop = setTimeout(() => {
        setS((p) => (p.lift == null ? p : { order: [p.lift, ...p.order.filter((x) => x !== p.lift)], lift: null }))
      }, 1000)
    }, 3200)
    return () => { clearInterval(id); clearTimeout(drop) }
  }, [])

  return (
    <div role="img" aria-label="Taskify running on a phone" style={{ width: 290, margin: '0 auto', border: '10px solid var(--ink)', borderRadius: '2.75rem', background: 'var(--bg)', padding: '1.5rem 1rem 1rem' }}>
      <div style={{ width: 70, height: 8, background: 'var(--ink)', borderRadius: 99, margin: '0 auto 1.25rem' }} />
      <div className="flex items-baseline justify-between px-1 mb-4">
        <p className="disp" style={{ fontSize: '1.6rem' }}>Today</p>
        <p style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--purple)' }}>1 of {TASKS.length} done</p>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
        {s.order.map((id) => {
          const t = TASKS.find((x) => x.id === id)
          const up = s.lift === id
          return (
            <li key={id} className="flex items-center gap-3"
              style={{ background: up ? 'var(--pink-l)' : 'var(--white)', borderRadius: '1rem', padding: '.8rem .75rem', fontSize: '.9rem', border: '2px solid ' + (up ? 'var(--pink)' : 'transparent'), transform: up ? 'scale(1.04) rotate(-1.5deg)' : 'none', transition: 'transform .2s, background .2s' }}>
              <GripVertical size={16} strokeWidth={1.75} color="#9A7BB8" aria-hidden="true" />
              <span className="flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: 7, flexShrink: 0, background: t.done ? 'var(--purple)' : 'transparent', border: '2px solid var(--purple)', color: '#fff' }}>
                {t.done && <Check size={13} strokeWidth={3} />}
              </span>
              <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}>{t.t}</span>
            </li>
          )
        })}
      </ul>
      <div className="flex items-center justify-between mt-4" style={{ background: 'var(--white)', borderRadius: 999, padding: '.4rem .4rem .4rem 1rem', fontSize: '.85rem', color: '#8B7699' }}>
        Add a task
        <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 99, background: 'var(--purple)', color: '#fff' }}><Plus size={18} strokeWidth={2.25} /></span>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="top" className="wrap grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      <div>
        <span style={{ display: 'inline-block', background: 'var(--pink-l)', borderRadius: 99, padding: '.4rem 1rem', fontSize: '.85rem', fontWeight: 600 }}>
          A to-do app for your phone
        </span>
        <h1 className="disp mt-6" style={{ fontSize: 'clamp(3.25rem, 8vw, 6rem)' }}>
          Drag your day into <span style={{ color: 'var(--purple)' }}>order.</span>
        </h1>
        <p className="mt-7" style={{ fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '34rem' }}>
          Taskify is a simple to-do app built around drag and drop. Reorder your list with one motion, and install it on your phone like any other app.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={APP_URL} target="_blank" rel="noreferrer" className="btn btn-purple">Launch App <ArrowUpRight size={18} strokeWidth={2} /></a>
          <a href="#install" className="btn btn-line">How to install</a>
        </div>
      </div>
      <div style={{ background: 'var(--lilac)', borderRadius: '2.5rem', padding: '3rem 1rem' }}><Phone /></div>
    </section>
  )
}

function Bar({ w, hot }) {
  return <div className="flex items-center gap-2" style={{ transform: hot ? 'translateX(18px)' : 'none' }}>
    <GripVertical size={14} color={hot ? '#2A1038' : '#E4D4F6'} aria-hidden="true" />
    <div style={{ height: 16, width: w, borderRadius: 99, background: hot ? 'var(--pink)' : 'rgba(255,255,255,.28)' }} />
  </div>
}

function Features() {
  return (
    <section id="features" className="wrap" style={{ paddingBottom: '5rem' }}>
      <Reveal>
        <h2 className="disp" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', maxWidth: '16ch' }}>Everything you need, nothing you don't.</h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-6 gap-4">
          <article className="tile lg:col-span-4" style={{ background: 'var(--purple)', color: '#fff' }}>
            <MoveVertical size={28} strokeWidth={1.75} aria-hidden="true" />
            <h3 className="disp mt-4" style={{ fontSize: '2rem' }}>Drag and drop</h3>
            <p className="mt-3" style={{ lineHeight: 1.6, maxWidth: '30rem', color: '#EADCF7' }}>Pick a task up and drop it where it belongs. Reordering takes one motion, on desktop or on your phone.</p>
            <div className="mt-8 flex flex-col gap-3"><Bar w="80%" /><Bar w="62%" hot /><Bar w="70%" /></div>
          </article>
          <article className="tile lg:col-span-2" style={{ background: 'var(--pink)' }}>
            <Smartphone size={28} strokeWidth={1.75} aria-hidden="true" />
            <h3 className="disp mt-4" style={{ fontSize: '2rem' }}>Install it</h3>
            <p className="mt-3" style={{ lineHeight: 1.6 }}>Add Taskify to your home screen and open it like any other app.</p>
            <div className="mt-6"><Logo size={64} /></div>
          </article>
          <article className="tile lg:col-span-2" style={{ background: 'var(--lilac)' }}>
            <ListChecks size={28} strokeWidth={1.75} aria-hidden="true" />
            <h3 className="disp mt-4" style={{ fontSize: '2rem' }}>Simple by design</h3>
            <p className="mt-3" style={{ lineHeight: 1.6 }}>Add a task, check it off, move it around. Nothing else gets in the way.</p>
          </article>
          <article className="tile lg:col-span-4" style={{ background: 'var(--blush)', border: '2px solid var(--pink-l)' }}>
            <h3 className="disp" style={{ fontSize: '2rem' }}>Plain HTML, CSS and JavaScript</h3>
            <p className="mt-3" style={{ lineHeight: 1.6, maxWidth: '30rem' }}>No framework behind it. Small, quick to load and easy to read.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['HTML', 'CSS', 'JavaScript'].map((x) => (
                <span key={x} style={{ background: 'var(--white)', border: '2px solid var(--ink)', borderRadius: 99, padding: '.45rem 1.1rem', fontWeight: 600 }}>{x}</span>
              ))}
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  )
}

function Install() {
  const [os, setOs] = useState('Android')
  return (
    <section id="install" style={{ background: 'var(--lilac)', borderRadius: '3rem 3rem 0 0' }}>
      <Reveal className="wrap" >
        <div style={{ padding: '5rem 0' }}>
          <h2 className="disp" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', maxWidth: '16ch' }}>Put it on your home screen.</h2>
          <div className="mt-8 inline-flex" role="tablist" style={{ background: 'var(--white)', borderRadius: 99, padding: 4 }}>
            {Object.keys(INSTALL).map((k) => (
              <button key={k} role="tab" aria-selected={os === k} onClick={() => setOs(k)}
                style={{ border: 0, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '.95rem', padding: '.6rem 1.4rem', borderRadius: 99, background: os === k ? 'var(--purple)' : 'transparent', color: os === k ? '#fff' : 'var(--ink)' }}>
                {k}
              </button>
            ))}
          </div>
          <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4" style={{ listStyle: 'none', margin: 0, padding: 0, marginTop: '2rem' }}>
            {INSTALL[os].map((step, i) => (
              <li key={step} style={{ background: 'var(--white)', borderRadius: '1.75rem', padding: '1.75rem' }}>
                <span className="disp" style={{ fontSize: '3.5rem', color: 'var(--pink)' }}>{i + 1}</span>
                <p className="mt-3" style={{ fontSize: '1.05rem', lineHeight: 1.5 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ background: 'var(--lilac)' }}>
      <div className="wrap" style={{ paddingBottom: '5rem' }}>
        <Reveal>
          <div className="tile flex flex-col md:flex-row md:items-center justify-between gap-8" style={{ background: 'var(--purple-d)', color: '#fff', padding: '3.5rem 2.5rem' }}>
            <h2 className="disp" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.25rem)', maxWidth: '12ch' }}>Your list, in your order.</h2>
            <a href={APP_URL} target="_blank" rel="noreferrer" className="btn btn-pink self-start md:self-auto" style={{ padding: '1.1rem 2rem', fontSize: '1.05rem', borderColor: 'var(--pink)' }}>
              Launch App <ArrowUpRight size={20} strokeWidth={2} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--blush)' }}>
      <div className="wrap flex flex-col sm:flex-row gap-4 justify-between items-center" style={{ padding: '1.75rem 1.25rem', fontSize: '.9rem' }}>
        <span className="flex items-center gap-2"><Logo size={22} /> Taskify © {new Date().getFullYear()}</span>
        <span>Built with HTML, CSS and JavaScript</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2"><Github size={16} strokeWidth={1.5} /> GitHub</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <style>{css}</style>
      <Header />
      <main>
        <Hero />
        <Features />
        <Install />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
