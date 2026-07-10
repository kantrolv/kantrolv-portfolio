import { useEffect, useState } from 'react'

/**
 * Debounced viewport *width* — height changes (mobile URL bar) are ignored so
 * scroll-linked scenes are not needlessly torn down and rebuilt mid-scroll.
 * Sections key their GSAP effects on this so text re-splits after real resizes.
 */
export default function useWidthBucket() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  )

  useEffect(() => {
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => setWidth(window.innerWidth), 250)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return width
}
