import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { setLenis, getLenis } from './lib/scroll'
import useReducedMotion from './hooks/useReducedMotion'
import useWidthBucket from './hooks/useWidthBucket'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Progress from './components/Progress'
import Nav from './components/Nav'
import Epigraph from './components/Epigraph'
import { SectionTint, AmbientGlow, BindingThread } from './components/Backdrop'

import Overture from './sections/Overture'
import Summary from './sections/Summary'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

import { epigraphs } from './data/site'

/** Fixed plate-frame corner marks — drawn in once the overture begins. */
function PlateCorners({ started, reduced }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    gsap.set(root.current.children, { autoAlpha: 0, scale: 0.6 })
  }, [reduced])

  useEffect(() => {
    if (!started || reduced) return
    const tween = gsap.to(root.current.children, {
      autoAlpha: 1,
      scale: 1,
      duration: 1.3,
      stagger: 0.1,
      delay: 1.0,
      ease: 'regal',
    })
    return () => tween.kill()
  }, [started, reduced])

  return (
    <div className="plate-corners" ref={root} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const width = useWidthBucket()
  const [ready, setReady] = useState(false) // fonts settled — scenes may build
  const [started, setStarted] = useState(false) // curtain lifting — overture plays
  const [loaderGone, setLoaderGone] = useState(false)

  useEffect(() => {
    let alive = true
    document.fonts.ready.then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  // Lenis — inertial paper. Skipped entirely under reduced motion.
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    setLenis(lenis)
    lenis.stop() // held until the curtain lifts
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])

  useEffect(() => {
    if (started) getLenis()?.start()
  }, [started])

  // One refresh once every scene has built (and again after real resizes).
  useEffect(() => {
    if (!ready) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh())
    )
    return () => cancelAnimationFrame(raf)
  }, [ready, width])

  // The body scroll-lock lifts with the preloader; re-measure once after.
  useEffect(() => {
    if (loaderGone) ScrollTrigger.refresh()
  }, [loaderGone])

  // Chrome (nav, progress rule) settles in once the curtain lifts.
  useEffect(() => {
    if (started) document.documentElement.classList.add('is-live')
  }, [started])

  const handleOpen = useCallback(() => setStarted(true), [])
  const handleGone = useCallback(() => setLoaderGone(true), [])

  const stage = { ready, reduced, width }

  return (
    <>
      <a className="skip-link" href="#catalogue">
        Skip to selected works
      </a>

      {!loaderGone && (
        <Preloader ready={ready} reduced={reduced} onOpen={handleOpen} onGone={handleGone} />
      )}

      <Cursor />
      <SectionTint ready={ready} reduced={reduced} />
      <AmbientGlow reduced={reduced} />
      <div className="paper-fx" aria-hidden="true">
        <div className="paper-fx__grain" />
        <div className="paper-fx__vignette" />
      </div>
      <BindingThread ready={ready} reduced={reduced} />
      <PlateCorners started={started} reduced={reduced} />
      <Progress />
      <Nav ready={ready} />

      <main id="main">
        <Overture {...stage} started={started} />
        <Epigraph {...stage} text={epigraphs[0]} />
        <Summary {...stage} />
        <Epigraph {...stage} text={epigraphs[1]} />
        <Skills {...stage} />
        <Epigraph {...stage} text={epigraphs[2]} />
        <Projects {...stage} />
        <Epigraph {...stage} text={epigraphs[3]} />
        <Contact {...stage} />
      </main>
    </>
  )
}
