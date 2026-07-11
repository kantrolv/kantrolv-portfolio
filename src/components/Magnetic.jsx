import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

const FINE = '(hover: hover) and (pointer: fine)'

/** Gives its child a gentle magnetic pull toward the pointer. */
export default function Magnetic({ children, strength = 0.3, className = '' }) {
  const el = useRef(null)
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(FINE).matches
  )

  useEffect(() => {
    if (!enabled) return
    const node = el.current
    const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' })

    const move = (e) => {
      const r = node.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      gsap.to(node, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
    }
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerleave', leave)
    return () => {
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerleave', leave)
    }
  }, [enabled, strength])

  return (
    <span ref={el} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
