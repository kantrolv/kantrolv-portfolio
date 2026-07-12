import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Editorial marginalia — small-caps notes drifting slowly in the margins.
 * Parallax is measured against the parent section, so notes keep drifting
 * even while the section itself is pinned.
 */
export default function MarginNote({
  top,
  left,
  right,
  vertical = false,
  speed = 0.5,
  ready,
  reduced,
  children,
}) {
  const el = useRef(null)

  useLayoutEffect(() => {
    if (!ready || reduced) return
    const node = el.current
    const section = node.closest('section, aside') || node.parentElement
    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: speed * 70 },
        {
          y: speed * -70,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
      gsap.from(node, {
        autoAlpha: 0,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
    })
    return () => ctx.revert()
  }, [ready, reduced, speed])

  const style = { top, left, right }
  return (
    <span
      ref={el}
      className={`margin-note${vertical ? ' margin-note--v' : ''}`}
      style={style}
      aria-hidden="true"
    >
      {children}
    </span>
  )
}
