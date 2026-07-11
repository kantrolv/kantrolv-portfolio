import { forwardRef } from 'react'

/**
 * The K·V monogram — stroke-only so it can be drawn in, line by line.
 * Every shape carries data-draw for prepareStrokeDraw().
 */
const Monogram = forwardRef(function Monogram({ className = '', title }, ref) {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 120 120"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      <circle data-draw cx="60" cy="60" r="55" stroke="#B08D57" strokeWidth="1.1" />
      <circle data-draw cx="60" cy="60" r="50.5" stroke="#B08D57" strokeWidth="0.5" opacity="0.55" />
      {/* K */}
      <path data-draw d="M41 38 V 82" stroke="#1A1A18" strokeWidth="1.9" />
      <path data-draw d="M41 63 L 60.5 38" stroke="#1A1A18" strokeWidth="1.9" />
      <path data-draw d="M47.5 55 L 63 82" stroke="#1A1A18" strokeWidth="1.9" />
      {/* V */}
      <path data-draw d="M59 38 L 72.5 82 L 86 38" stroke="#1E3A2F" strokeWidth="1.9" />
      {/* serif ticks */}
      <path data-draw d="M37 38 H 45" stroke="#1A1A18" strokeWidth="1.4" />
      <path data-draw d="M37 82 H 45" stroke="#1A1A18" strokeWidth="1.4" />
      <path data-draw d="M55.5 38 H 63" stroke="#1E3A2F" strokeWidth="1.4" />
      <path data-draw d="M82.5 38 H 89.5" stroke="#1E3A2F" strokeWidth="1.4" />
      {/* flanking diamonds */}
      <path data-draw d="M22 60 l 3.5 -3.5 3.5 3.5 -3.5 3.5 Z" stroke="#B08D57" strokeWidth="1" />
      <path data-draw d="M91 60 l 3.5 -3.5 3.5 3.5 -3.5 3.5 Z" stroke="#B08D57" strokeWidth="1" />
    </svg>
  )
})

export default Monogram
