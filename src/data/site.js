/**
 * Single source of truth for identity, copy, and links.
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
 * The honours board — RANKED. Order is meaning: the top of each cluster is
 * the headline, and the Intelligence cluster leads the whole board.
 *
 * Each row's annotation must SAY something:
 *   cite      — the catalogue entries the skill shipped in ('№ 01 · 02'),
 *               set in gold like a citation. Only claim what the catalogue
 *               actually backs.
 *   standing  — an honest tier where there is no shipped reference:
 *               'Core practice' · 'Working fluency' · 'In study'.
 *   lead      — sets the row in serif as a headline strength.
 *
 * `icon` is a simple-icons slug mapped in src/lib/icons.js; omit it for a
 * tasteful diamond ornament instead of a mismatched logo.
 */
export const skillClusters = [
  {
    numeral: 'i',
    title: 'Intelligence',
    sub: 'AI & Machine Learning',
    lead: true,
    rows: [
      { name: 'Retrieval-Augmented Generation', cite: '№ 01', lead: true },
      { name: 'LangChain & LangGraph', icon: 'langchain', cite: '№ 01', lead: true },
      { name: 'CrewAI · Agentic Systems', standing: 'Core practice', lead: true },
      { name: 'FAISS & Vector Embeddings', cite: '№ 01' },
      { name: 'OpenAI API · Groq', cite: '№ 01' },
      { name: 'Python', icon: 'python', cite: '№ 01' },
      { name: 'Natural Language Processing', standing: 'Core practice' },
      { name: 'PyTorch', icon: 'pytorch', standing: 'In study' },
    ],
  },
  {
    numeral: 'ii',
    title: 'Front of House',
    sub: 'Interface Engineering',
    rows: [
      { name: 'React', icon: 'react', cite: '№ 02' },
      { name: 'TypeScript · JavaScript', icon: 'typescript', standing: 'Working fluency' },
      { name: 'Tailwind CSS', icon: 'tailwindcss', standing: 'Working fluency' },
      { name: 'HTML & CSS', icon: 'html5', standing: 'Working fluency' },
      { name: 'Figma · UI/UX', icon: 'figma', standing: 'Working fluency' },
      { name: 'Three.js', icon: 'threejs', standing: 'In study' },
    ],
  },
  {
    numeral: 'iii',
    title: 'Back of House',
    sub: 'Servers & Data',
    rows: [
      { name: 'Node.js · Express', icon: 'node', cite: '№ 02 · 03' },
      { name: 'Prisma ORM', icon: 'prisma', cite: '№ 03' },
      { name: 'PostgreSQL · MySQL', icon: 'postgresql', cite: '№ 03' },
      { name: 'MongoDB · NoSQL', icon: 'mongodb', cite: '№ 02' },
      { name: 'JWT · OAuth 2.0', icon: 'jwt', cite: '№ 02 · 03' },
      { name: 'SQL', standing: 'Working fluency' },
    ],
  },
  {
    numeral: 'iv',
    title: 'The Workshop',
    sub: 'Infrastructure & Tools',
    rows: [
      { name: 'Git & GitHub', icon: 'git', standing: 'Core practice' },
      { name: 'Vercel · Vite', icon: 'vite', cite: '№ 02 · 03' },
      { name: 'Docker', icon: 'docker', standing: 'Working fluency' },
      { name: 'Pandas · NumPy', icon: 'pandas', standing: 'Working fluency' },
      { name: 'n8n Automation', icon: 'n8n', standing: 'Working fluency' },
      { name: 'AWS', standing: 'In study' },
    ],
  },
]
