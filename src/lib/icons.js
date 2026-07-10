/**
 * Monochrome skill marks. We pull single-path glyphs from simple-icons but
 * only ever use their `.path` — never their brand `.hex` — so every mark is
 * rendered engraved in the site palette (ink → gold), not as a sponsor wall.
 *
 * Named imports tree-shake: only the ~19 glyphs referenced below are bundled,
 * not the full simple-icons set. Slugs with no clean icon (RAG, FAISS,
 * agentic systems, NLP, OpenAI/Groq, AWS, SQL) intentionally have no entry —
 * SkillMark falls back to a diamond ornament for those.
 */
import {
  siLangchain,
  siPytorch,
  siPython,
  siReact,
  siTypescript,
  siTailwindcss,
  siThreedotjs,
  siHtml5,
  siFigma,
  siNodedotjs,
  siPrisma,
  siPostgresql,
  siMongodb,
  siJsonwebtokens,
  siDocker,
  siGit,
  siN8n,
  siPandas,
  siVite,
} from 'simple-icons'

const PATHS = {
  langchain: siLangchain.path,
  pytorch: siPytorch.path,
  python: siPython.path,
  react: siReact.path,
  typescript: siTypescript.path,
  tailwindcss: siTailwindcss.path,
  threejs: siThreedotjs.path,
  html5: siHtml5.path,
  figma: siFigma.path,
  node: siNodedotjs.path,
  prisma: siPrisma.path,
  postgresql: siPostgresql.path,
  mongodb: siMongodb.path,
  jwt: siJsonwebtokens.path,
  docker: siDocker.path,
  git: siGit.path,
  n8n: siN8n.path,
  pandas: siPandas.path,
  vite: siVite.path,
}

/** Returns the SVG path `d` for a slug, or null (→ diamond fallback). */
export function iconPath(slug) {
  return (slug && PATHS[slug]) || null
}
