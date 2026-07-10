/**
 * Single source of truth for identity, copy, and links.
 * Replace the '#' placeholders with real URLs — nothing else needs touching.
 */
export const site = {
  name: 'Kantrol Vamshi Krishna',
  nameLines: ['Kantrol', 'Vamshi', 'Krishna'],
  role: 'AI & Full-Stack Developer',
  location: 'Pune · India',
  coordinates: '18.5204° N · 73.8567° E',
  timezone: 'Asia/Kolkata',
  year: 'MMXXVI',
  email: 'kantrol.vamshikrishna@adypu.edu.in',

  pullQuote: 'Intelligent systems, finished by hand.',

  summary: [
    'At the meeting point of artificial intelligence and full-stack engineering, I build software that thinks as well as it runs. My work spans retrieval-augmented generation, agentic workflows with LangGraph and CrewAI, and vector search over FAISS — grounded in the practical discipline of shipping real products with React, Node.js, and modern data layers.',
    'I am reading for a Bachelor of Engineering in AI & Machine Learning at Newton School of Technology, Pune, and I spend my evenings building: a research assistant with conversational memory, a multi-region commerce platform, a job portal serving recruiters and candidates alike. I care about token budgets and type safety, about latency and letter-spacing — because intelligence delivered without craft is only half the work.',
  ],

  education: 'B.E. — Artificial Intelligence & Machine Learning · Newton School of Technology, Pune · Class of 2028',

  certifications: [
    'AI for Everyone — DeepLearning.AI, 2025',
    'Generative AI for Everyone — DeepLearning.AI, 2024',
  ],

  socials: [
    { label: 'Email', value: 'kantrol.vamshikrishna@adypu.edu.in', href: 'mailto:kantrol.vamshikrishna@adypu.edu.in' },
    { label: 'GitHub', value: 'github.com/kantrolv', href: 'https://github.com/kantrolv' },
    { label: 'LinkedIn', value: 'linkedin.com/in/vamshi-krishna', href: 'https://www.linkedin.com/in/vamshi-krishna-4b5873333/' },
    { label: 'Codeforces', value: 'codeforces.com/profile/kantrolv', href: 'https://codeforces.com/profile/kantrolv' },
    { label: 'CodeChef', value: 'codechef.com/users/kantrol_vamshi', href: 'https://www.codechef.com/users/kantrol_vamshi' },
  ],
}

/**
 * Original epigraphs set between movements — one per transition.
 * Unattributed by design; members'-club motto energy.
 */
export const epigraphs = [
  'Enter quietly — the work will introduce itself.',
  'Ability whispers; it never needs to raise its voice.',
  'What follows was built slowly, on purpose, to last.',
  'Good work opens the door. Good company walks through.',
]

/**
 * The honours board. Add a row to a cluster and it simply appears, ruled,
 * marked, and ticked. Each row is `{ name, icon }`; `icon` is a simple-icons
 * slug mapped in src/lib/icons.js. Omit `icon` (or use a slug with no clean
 * glyph) to get a tasteful diamond ornament instead of a mismatched logo.
 */
export const skillClusters = [
  {
    numeral: 'i',
    title: 'Intelligence',
    sub: 'AI & Machine Learning',
    rows: [
      { name: 'Retrieval-Augmented Generation' },
      { name: 'LangChain & LangGraph', icon: 'langchain' },
      { name: 'FAISS & Vector Embeddings' },
      { name: 'CrewAI · Agentic Systems' },
      { name: 'PyTorch', icon: 'pytorch' },
      { name: 'Natural Language Processing' },
      { name: 'OpenAI API · Groq' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    numeral: 'ii',
    title: 'Front of House',
    sub: 'Interface Engineering',
    rows: [
      { name: 'React', icon: 'react' },
      { name: 'TypeScript · JavaScript', icon: 'typescript' },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
      { name: 'Three.js', icon: 'threejs' },
      { name: 'HTML & CSS', icon: 'html5' },
      { name: 'Figma · UI/UX', icon: 'figma' },
    ],
  },
  {
    numeral: 'iii',
    title: 'Back of House',
    sub: 'Servers & Data',
    rows: [
      { name: 'Node.js · Express', icon: 'node' },
      { name: 'Prisma ORM', icon: 'prisma' },
      { name: 'PostgreSQL · MySQL', icon: 'postgresql' },
      { name: 'MongoDB · NoSQL', icon: 'mongodb' },
      { name: 'JWT · OAuth 2.0', icon: 'jwt' },
      { name: 'SQL' },
    ],
  },
  {
    numeral: 'iv',
    title: 'The Workshop',
    sub: 'Infrastructure & Tools',
    rows: [
      { name: 'Docker', icon: 'docker' },
      { name: 'AWS' },
      { name: 'Git & GitHub', icon: 'git' },
      { name: 'n8n Automation', icon: 'n8n' },
      { name: 'Pandas · NumPy', icon: 'pandas' },
      { name: 'Vercel · Vite', icon: 'vite' },
    ],
  },
]
