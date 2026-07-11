import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/** Thin gold reading-progress rule along the top edge. */
export default function Progress() {
  const bar = useRef(null)

  useEffect(() => {
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <div className="progress__bar" ref={bar} />
    </div>
  )
}
