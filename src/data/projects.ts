import drishyaImg from '@/assets/projectImage/drishya.webp';
import innexImg from '@/assets/projectImage/innex.webp';
import project1Img from '@/assets/projectImage/p1.webp';
import project2Img from '@/assets/projectImage/p2.webp';
import project3Img from '@/assets/projectImage/p3.webp';

export interface CaseStudy {
  /** One or two sentences under the title. */
  lede: string;
  facts: { label: string; value: string }[];
  sections: { heading: string; body?: string[]; points?: string[] }[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Empty when there is nothing public to link to. */
  github: string;
  live: string;
  image?: string;
  /** Private work: shown without a repository or live link. */
  isPrivate?: boolean;
  caseStudy?: CaseStudy;
}

export const projects: Project[] = [
  {
    slug: 'drishya',
    title: 'Drishya',
    description: 'An immersive AI assisted tourism experience for exploring the districts, places, and stories of Nepal’s Sudurpashchim Province.',
    tags: ['Next.js', 'React', 'TypeScript', 'Leaflet', 'Prisma', 'PostgreSQL'],
    github: 'https://github.com/Niteshh-DeV/Drishya.git',
    live: 'https://drishya-fwu.vercel.app',
    image: drishyaImg,
    caseStudy: {
      lede: 'An interactive tourism platform for Sudurpashchim Province, Nepal: a scroll-driven map of the province, a page for each of its nine districts, and a structured layer of destination data underneath.',
      facts: [
        { label: 'Type', value: 'Tourism platform' },
        { label: 'Region', value: 'Sudurpashchim Province, Nepal — nine districts' },
        { label: 'Stack', value: 'Next.js 16, React 19, TypeScript, Tailwind CSS v4, Motion, Leaflet, Prisma 7, PostgreSQL on Neon' },
      ],
      sections: [
        {
          heading: 'What it is',
          body: [
            'Drishya is built to show the tourism value of Sudurpashchim. The landing page opens on a pinned map of the province that responds to scroll, and each district leads to its own page of places and stories.',
          ],
        },
        {
          heading: 'What is built',
          points: [
            'A province-wide landing experience with a pinned hero map and a listing of every district',
            'District detail pages with their own routes and structured content',
            'Leaflet maps for district geography and destination markers',
            'A Prisma and PostgreSQL data model for destinations, read through one data-access layer',
            'Seed data and map assets for the whole province',
            'Structure prepared for guide connections, a blog and AI assistant features',
          ],
        },
        {
          heading: 'How it is put together',
          body: [
            'The landing map and the district maps are deliberately separate. The hero is a custom SVG map whose camera framing is calculated from the district paths, which keeps the scroll interaction light. District pages switch to Leaflet and real geographic geometry, loaded only in the browser.',
            'Pages never touch the database directly. Destination records are defined in Prisma, converted into plain serialisable objects in one place, and every page renders from that layer.',
          ],
        },
      ],
    },
  },
  {
    slug: 'innex',
    title: 'INNEX 1.0',
    description: 'The event website for INNEX 1.0 — “Innovation × Excellence”, a 48-hour national-level hackathon by the Innovative Computer Engineering Club, Far Western University.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Motion'],
    github: 'https://github.com/Niteshh-DeV/INNEX',
    live: 'https://innex-hackathon.vercel.app',
    image: innexImg,
    caseStudy: {
      lede: 'The official website for INNEX 1.0, a 48-hour hackathon run by the Innovative Computer Engineering Club at Far Western University (ICEC-FWU) and billed as Sudurpashchim’s first national-level hackathon.',
      facts: [
        { label: 'Type', value: 'Event website' },
        { label: 'For', value: 'ICEC-FWU — Innovative Computer Engineering Club, Far Western University' },
        { label: 'Stack', value: 'React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lenis, Zod' },
      ],
      sections: [
        {
          heading: 'What it is',
          body: [
            'A responsive, animated landing page that carries everything a participant needs before the event: what INNEX is, when it runs, how it is judged and how to register.',
          ],
        },
        {
          heading: 'What is built',
          points: [
            'Event information, timeline, tracks, judging criteria and FAQs',
            'Registration calls to action and a registration QR code',
            'Edition-aware content and countdown behaviour',
            'Accessible navigation with skip-to-content and reduced-motion handling',
            'Open Graph artwork and event JSON-LD metadata',
          ],
        },
        {
          heading: 'How it is put together',
          body: [
            'Event content lives apart from the components, in edition files that are validated against a schema. A future edition is a new content file rather than a rewrite of the page.',
          ],
        },
      ],
    },
  },
  {
    slug: 'panchdev-store',
    title: 'Panchdev Store',
    description: 'An offline-first khata app for our family shop, Panchdev General Store: customer and supplier ledgers, expenses, end-of-day cash close and reports, in English and नेपाली.',
    tags: ['React', 'TypeScript', 'PWA', 'Hono', 'PostgreSQL', 'Offline-first'],
    github: '',
    live: '',
    isPrivate: true,
    caseStudy: {
      lede: 'A khata (ledger) app built for our own shop, Panchdev General Store. It keeps working with no internet and syncs across the family’s phones when a connection returns.',
      facts: [
        { label: 'Type', value: 'Private project — built for our own shop' },
        { label: 'Status', value: 'Version 1 complete' },
        { label: 'Stack', value: 'React 19, TypeScript, Vite PWA, Dexie, Hono, Drizzle, PostgreSQL on Neon, Playwright' },
      ],
      sections: [
        {
          heading: 'What it is',
          body: [
            'The shop’s paper khata, rebuilt as an installable app. Every sale on credit, payment, purchase and expense is recorded on the phone in hand, whether or not there is a signal.',
          ],
        },
        {
          heading: 'What is built',
          points: [
            'Customer khata: customers, ledgers, new entries and cancellations',
            'Supplier khata: purchases with bill number and due date, payments and overdue bills',
            'Shop expenses kept separate from home use',
            'End-of-day close: expected against counted cash, with a day lock',
            'Owner reports: monthly rough profit, day by day, owed and overdue, exported to Excel and PDF',
            'A quick bill for a running tally, and shared shop notes with reminders',
            'English and नेपाली, with Nepali digits and Bikram Sambat dates',
          ],
        },
        {
          heading: 'How it is put together',
          body: [
            'The app is offline-first. Entries are written to a local database on the phone and queued in an outbox; a sync API pushes and pulls changes in the background once the phone is online. Money is stored in paisa to avoid rounding errors.',
            'The first owner sets up the shop with a PIN. Other phones join with a one-time code, and after the first unlock each person can open the app with their PIN even when offline.',
          ],
        },
        {
          heading: 'Why there are no links',
          body: ['This is a private project holding a real shop’s records, so the repository and the live app are not public.'],
        },
      ],
    },
  },
  {
    slug: 'portfolio',
    title: 'Personal Portfolio Website',
    description: 'Built a responsive and interactive personal portfolio website to showcase my projects, skills, and experience.',
    tags: ['TypeScript', 'React', 'Vite', 'Motion'],
    github: 'https://github.com/Niteshh-DeV/portfolio',
    live: 'https://niteshjoshi.me',
    image: project1Img,
  },
  {
    slug: 'weather-app',
    title: 'Weather App',
    description: 'Build an interactive weather application that fetches real-time data from a public API and displays it with dynamic backgrounds based on weather conditions.',
    tags: ['C++', 'Qt', 'API', 'JSON'],
    github: 'https://github.com/Niteshh-DeV/OOP_In_CPP/tree/main/Weather_App',
    live: '',
    image: project2Img,
  },
  {
    slug: 'loan-prediction',
    title: 'Loan Prediction System',
    description: 'Developed a machine learning model to predict loan approval status based on applicant data, improving accuracy using feature engineering and different learning algorithms.',
    tags: ['Python', 'Scikit-learn', 'Pandas', 'Data Analysis', 'Seaborn', 'Matplotlib', 'Numpy', 'Jupyter'],
    github: 'https://github.com/Niteshh-DeV/AI-ML-Journey-With-Learning-Utsav/tree/main/loan-approval-final-project',
    live: '',
    image: project3Img,
  },
  {
    slug: 'python-projects',
    title: 'Collection Of Python Small Projects',
    description: 'A repository of small Python projects demonstrating various concepts such as Password generator, To-Do List and data analysis.',
    tags: ['Python', 'Data Analysis', 'Numpy', 'Pandas'],
    github: 'https://github.com/Niteshh-DeV/Python_Projects.git',
    live: '',
  },
  {
    slug: 'cpp-projects',
    title: 'Collection Of C++ Small Projects',
    description: 'A repository of small C++ projects demonstrating various concepts such as Student Management System and Library Management System.',
    tags: ['C++', 'OOP', 'STL'],
    github: 'https://github.com/Niteshh-DeV/Projects-.cpp.git',
    live: '',
  },
];
