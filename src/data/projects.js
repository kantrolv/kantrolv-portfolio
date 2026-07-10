/**
 * The Catalogue. Every entry renders from this array — add № 04, 05, …
 * and the section, navigation counts, and staging scale automatically.
 *
 * Shape:
 *   number      two-digit string, sets the giant numeral
 *   title       serif display title
 *   year        integer — counts up on reveal
 *   filedUnder  small-caps marginalia label
 *   description editorial paragraph (staged line by line)
 *   metric      { value, prefix?, suffix?, label } — kinetic gold figure
 *   tags        small-caps index terms
 *   github/demo '#' placeholders until real links are pasted in
 */
export const projects = [
  {
    number: '01',
    title: 'AI Research Assistant',
    year: 2026,
    filedUnder: 'Intelligent Systems',
    description:
      'A research companion that reads, remembers, and reasons. Built on LangGraph with Groq inference and FAISS retrieval, it runs semantic web-search pipelines, holds conversational memory across a session, and files its findings into exportable PDF reports — with follow-up questions drafted before you think to ask them.',
    metric: { value: 52, suffix: '%', label: 'reduction in token usage' },
    tags: ['LangGraph', 'Groq', 'FAISS', 'RAG', 'Python'],
    github: 'https://github.com/kantrolv/research_ai_assistant.git',
    demo: 'https://research-aiassistant.streamlit.app/',
  },
  {
    number: '02',
    title: 'Tennis, Worldwide',
    subtitle: 'Multi-Region E-Commerce Platform',
    year: 2026,
    filedUnder: 'Commerce',
    description:
      'A lawn-tennis outfitter for a bordered world. React and Node.js under the hood; regional pricing, currency handling, and inventory logic at the counter. JWT-secured accounts, an analytics back office, and low-stock telemetry keep the shop floor immaculate in every region it serves.',
    metric: { value: 3, label: 'regions · one storefront' },
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/kantrolv/tennis-wilson-.git',
    demo: 'https://tennis-wilson.vercel.app/',
  },
  {
    number: '03',
    title: 'The Job Portal',
    year: 2025,
    filedUnder: 'Platforms',
    description:
      'A meeting place for recruiters and the newly qualified. Node.js, Express, and Prisma over PostgreSQL give it a spine; JWT authentication and role-based access give it manners. Students apply, recruiters shortlist, and every route knows exactly who is asking.',
    metric: { value: 2, label: 'roles · recruiter & candidate' },
    tags: ['Node.js', 'Prisma', 'PostgreSQL', 'Express', 'RBAC'],
    github: 'https://github.com/SravanthDev/Job-Portal.git',
    demo: 'https://job-portal-hazel-phi.vercel.app/',
  },
  
]


