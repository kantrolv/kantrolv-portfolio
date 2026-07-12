import { iconPath } from '../lib/icons'

/**
 * A quiet engraved mark to the left of a skill row. Renders a monochrome
 * simple-icons glyph (currentColor — ink at rest, gold on row hover) or,
 * where no clean logo exists, a small diamond ornament in the same box so
 * the ruled column stays perfectly aligned.
 */
export default function SkillMark({ icon }) {
  const path = iconPath(icon)

  if (!path) {
    return (
      <svg className="skill-mark skill-mark--diamond" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8.2 15.8 12 12 15.8 8.2 12Z" />
      </svg>
    )
  }

  return (
    <svg className="skill-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}
