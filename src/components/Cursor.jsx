import { useEffect, useRef, useState } from 'react'

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCED = '(prefers-reduced-motion: reduce)'

const INK = [26, 26, 24] // #1A1A18
const GOLD = [176, 141, 87] // #B08D57

/**
 * Fountain-pen cursor — a crisp nib at the pointer laying a calligraphic ink
 * stroke that trails behind on fine paper. The stroke is a continuous
 * tapering ribbon built from an eased point-chain (not discrete blots), so it
 * reads as one wet line; it thins as the pointer accelerates (the pen lifting)
 * and pools back to a nib at rest. Over links it warms from ink to muted gold,
 * swells, and slows — a quiet magnetic pull.
 *
 * Canvas, no WebGL, allocation-free render loop. Desktop + fine pointer only;
 * disabled on touch and reduced motion, where the native cursor returns.
 */
export default function Cursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(FINE).matches && !window.matchMedia(REDUCED).matches
  })
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const html = document.documentElement
    html.classList.add('has-cursor')

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // The nib's ink chain: xs[0]/ys[0] is the nib (locked to the pointer for
    // pixel precision); the rest trail with easing to form the stroke.
    const N = 16
    const xs = new Float32Array(N)
    const ys = new Float32Array(N)
    const nx = new Float32Array(N) // per-point normal, recomputed each frame
    const ny = new Float32Array(N)
    const taper = new Float32Array(N) // half-width profile: full at nib → 0 at tail
    for (let i = 0; i < N; i++) taper[i] = Math.pow(1 - i / (N - 1), 0.72)

    const pointer = { x: w / 2, y: h / 2 }
    const seed = (x, y) => {
      for (let i = 0; i < N; i++) {
        xs[i] = x
        ys[i] = y
      }
    }
    seed(pointer.x, pointer.y)

    let started = false
    let hoverTarget = 0
    let swell = 0 // eased hover state
    let alpha = 0 // eased visibility
    let alphaTarget = 0
    let speed = 0 // eased pointer velocity, 0..1
    let lastX = pointer.x
    let lastY = pointer.y

    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      alphaTarget = 1
      if (!started) {
        started = true
        seed(e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY
      }
    }
    const isInteractive = (t) => t instanceof Element && t.closest('a, button, [data-cursor]')
    const onOver = (e) => {
      if (isInteractive(e.target)) hoverTarget = 1
    }
    const onOut = (e) => {
      if (isInteractive(e.target)) hoverTarget = 0
    }
    const onLeave = () => (alphaTarget = 0)
    const onEnter = () => (alphaTarget = 1)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    html.addEventListener('pointerleave', onLeave)
    html.addEventListener('pointerenter', onEnter)

    // Trace the tapering ribbon outline for a given base half-width. Uses the
    // normals computed once per frame — no allocation here.
    const traceRibbon = (halfWidth) => {
      ctx.beginPath()
      ctx.moveTo(xs[0] + nx[0] * halfWidth * taper[0], ys[0] + ny[0] * halfWidth * taper[0])
      for (let i = 1; i < N; i++) {
        ctx.lineTo(xs[i] + nx[i] * halfWidth * taper[i], ys[i] + ny[i] * halfWidth * taper[i])
      }
      for (let i = N - 1; i >= 0; i--) {
        ctx.lineTo(xs[i] - nx[i] * halfWidth * taper[i], ys[i] - ny[i] * halfWidth * taper[i])
      }
      ctx.closePath()
    }

    let raf = 0
    const render = () => {
      swell = lerp(swell, hoverTarget, 0.09)
      alpha = lerp(alpha, alphaTarget, 0.14)

      // Pointer velocity → the stroke thins as the pen moves faster.
      const vx = pointer.x - lastX
      const vy = pointer.y - lastY
      lastX = pointer.x
      lastY = pointer.y
      speed = lerp(speed, Math.min(1, Math.hypot(vx, vy) / 24), 0.2)

      // Nib locked to the pointer; the chain trails, slower when swollen so
      // links feel magnetic. High damping, low stiffness.
      xs[0] = pointer.x
      ys[0] = pointer.y
      const follow = lerp(0.5, 0.34, swell)
      for (let i = 1; i < N; i++) {
        xs[i] = lerp(xs[i], xs[i - 1], follow)
        ys[i] = lerp(ys[i], ys[i - 1], follow)
      }

      ctx.clearRect(0, 0, w, h)
      if (alpha > 0.01) {
        // per-point normals from the local tangent
        for (let i = 0; i < N; i++) {
          const a = i === 0 ? 0 : i - 1
          const b = i === N - 1 ? N - 1 : i + 1
          let tx = xs[b] - xs[a]
          let ty = ys[b] - ys[a]
          const len = Math.hypot(tx, ty) || 1
          tx /= len
          ty /= len
          nx[i] = -ty
          ny[i] = tx
        }

        const r = Math.round(lerp(INK[0], GOLD[0], swell))
        const g = Math.round(lerp(INK[1], GOLD[1], swell))
        const b = Math.round(lerp(INK[2], GOLD[2], swell))
        const grow = lerp(1, 1.4, swell)
        const halfWidth = (2 + swell * 1.15) * (1 - 0.42 * speed) * grow

        // Two passes fake the ink bleed without a costly blur filter:
        // a wide faint halo, then the fuller stroke body.
        traceRibbon(halfWidth * 1.95)
        ctx.fillStyle = `rgba(${r},${g},${b},${0.09 * alpha})`
        ctx.fill()
        traceRibbon(halfWidth)
        ctx.fillStyle = `rgba(${r},${g},${b},${0.5 * alpha})`
        ctx.fill()

        // The nib — a crisp point exactly under the pointer.
        const nib = (1.7 + swell * 1.1) * grow
        ctx.fillStyle = `rgba(${r},${g},${b},${0.92 * alpha})`
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, nib, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('has-cursor')
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      html.removeEventListener('pointerleave', onLeave)
      html.removeEventListener('pointerenter', onEnter)
    }
  }, [enabled])

  if (!enabled) return null
  return <canvas className="ink-cursor" ref={canvasRef} aria-hidden="true" />
}
