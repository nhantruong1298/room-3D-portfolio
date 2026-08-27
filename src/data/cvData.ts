import { CVData, RoomObjectInfo } from '../types';

export const DEFAULT_CV_DATA: CVData = {
  profile: {
    fullName: 'Nguyen Van Nhan',
    title: 'Senior Full Stack & Software Engineer',
    tagline: 'Passionate about building high-performance web applications, scalable cloud systems, and immersive 3D experiences.',
    email: 'nhantruong1298@gmail.com',
    phone: '(+84) 987 654 321',
    location: 'Ho Chi Minh City, Vietnam (Hybrid / Remote)',
    github: 'https://github.com/nhantruong',
    linkedin: 'https://linkedin.com/in/nhantruong',
    portfolio: 'https://nhantruong.dev',
    bio: 'Software Engineer with 5+ years of experience specializing in full-stack architecture, React, TypeScript, Node.js, Cloud/DevOps, and WebGL/Three.js 3D graphical experiences. Dedicated to clean code, performance optimization, and robust CI/CD automation.',
    status: '🟢 Open to new opportunities & exciting projects',
    yearsOfExp: 5,
  },
  skillCategories: [
    {
      category: 'Frontend Development',
      icon: 'Layout',
      items: [
        { name: 'React / Next.js', level: 95, years: '5 yrs', tags: ['Hooks', 'SSR', 'RSC'] },
        { name: 'TypeScript / JavaScript', level: 92, years: '5 yrs', tags: ['Type Safety', 'Generics'] },
        { name: 'Tailwind CSS / UI Systems', level: 95, years: '4 yrs', tags: ['Design System', 'Responsive'] },
        { name: 'Three.js / WebGL 3D', level: 85, years: '3 yrs', tags: ['Shaders', '3D Scene', 'Interactive'] },
      ],
    },
    {
      category: 'Backend & APIs',
      icon: 'Server',
      items: [
        { name: 'Node.js / Express / NestJS', level: 90, years: '4 yrs', tags: ['Microservices', 'REST', 'GraphQL'] },
        { name: 'PostgreSQL / MySQL / Redis', level: 88, years: '4 yrs', tags: ['Indexing', 'Optimization', 'Prisma'] },
        { name: 'Golang / Python (FastAPI)', level: 78, years: '2 yrs', tags: ['High Concurrency', 'Async'] },
      ],
    },
    {
      category: 'DevOps & Cloud',
      icon: 'Cloud',
      items: [
        { name: 'Docker & Containerization', level: 88, years: '4 yrs' },
        { name: 'Kubernetes & CI/CD Actions', level: 80, years: '3 yrs' },
        { name: 'AWS & Google Cloud (GCP)', level: 82, years: '3 yrs' },
      ],
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      role: 'Senior Full Stack Engineer',
      company: 'Tech Solutions Global Inc.',
      location: 'Ho Chi Minh City',
      type: 'Full-time',
      startDate: '01/2023',
      endDate: 'Present',
      description: 'Led architecture design and development for an enterprise SaaS platform serving 500,000+ monthly active users.',
      responsibilities: [
        'Led a team of 6 engineers building scalable web applications with React, TypeScript, and Node.js microservices.',
        'Optimized core web vitals (LCP/FCP) by 45% and reduced cloud server CPU usage by 30%.',
        'Architected PostgreSQL and Redis caching layers handling 10,000 requests/second with zero downtime.',
      ],
      achievements: [
        'Awarded Employee of the Year 2024.',
        'Maintained 99.98% production uptime.',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'GCP', 'Tailwind CSS'],
    },
    {
      id: 'exp-2',
      role: 'Full Stack Software Developer',
      company: 'NextWave Digital Agency',
      location: 'Ho Chi Minh City',
      type: 'Full-time',
      startDate: '06/2021',
      endDate: '12/2022',
      description: 'Developed modern e-commerce web applications and real-time payment gateways for global clients.',
      responsibilities: [
        'Built secure online payment processing modules integrating Stripe, PayPal, and regional gateways.',
        'Developed high-performance interactive interfaces with responsive layouts and smooth animations.',
      ],
      achievements: [
        'Successfully delivered 12 client projects on schedule with excellent quality ratings.',
      ],
      technologies: ['React', 'Next.js', 'Express', 'MongoDB', 'Stripe API', 'Tailwind CSS'],
    },
    {
      id: 'exp-3',
      role: 'Junior Frontend Developer',
      company: 'Innovatech Labs',
      location: 'Ho Chi Minh City',
      type: 'Full-time',
      startDate: '03/2019',
      endDate: '05/2021',
      description: 'Built interactive content management dashboards and product marketing web pages.',
      responsibilities: [
        'Translated complex Figma designs into pixel-perfect, responsive React components.',
        'Improved cross-browser compatibility and SEO search indexing performance.',
      ],
      achievements: [
        'Promoted to full software engineer after 3 months of outstanding performance.',
      ],
      technologies: ['JavaScript ES6', 'React', 'CSS3/SCSS', 'REST API', 'Git'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: '3D Developer Room & Interactive CV',
      role: 'Sole Architect & Developer',
      category: 'Frontend',
      period: '2025',
      description: 'Isometric interactive 3D developer workspace featuring a virtual PC workstation and seamless CV experience.',
      highlights: [
        'Precise Isometric 3D rendering with Three.js and ambient lighting.',
        'Authentic virtual desktop OS interface with direct resume access.',
      ],
      technologies: ['React 19', 'Three.js', 'TypeScript', 'Tailwind CSS'],
      githubUrl: 'https://github.com/nhantruong/3d-room-portfolio',
      liveUrl: 'https://3d-room-cv.demo',
      featured: true,
    },
    {
      id: 'proj-2',
      title: 'CloudOps Monitoring Dashboard SaaS',
      role: 'Lead Full Stack Engineer',
      category: 'Full Stack',
      period: '2024',
      description: 'Real-time server, container, and network monitoring system with automated alerting.',
      highlights: [
        'Real-time WebSocket telemetry charts with sub-50ms latency.',
        'Multi-channel incident alerts via Telegram, Discord, and Email webhooks.',
      ],
      technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker'],
      githubUrl: 'https://github.com/nhantruong/cloudops-dashboard',
      liveUrl: 'https://cloudops.demo.io',
      featured: true,
    },
    {
      id: 'proj-3',
      title: 'AI Code Reviewer & Assistant Extension',
      role: 'Creator & Developer',
      category: 'AI / Game',
      period: '2024',
      description: 'AI-assisted code diff analyzer detecting security vulnerabilities and suggesting automated pull request optimizations.',
      highlights: [
        'AST static parsing for anti-patterns and performance smells.',
        'Integrated with LLM coding reasoning models.',
      ],
      technologies: ['TypeScript', 'Gemini API', 'Node.js'],
      githubUrl: 'https://github.com/nhantruong/ai-code-reviewer',
      featured: true,
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Software Engineering',
      major: 'Computer Science & Information Technology',
      school: 'University of Science / VNU-HCM',
      year: '2015 - 2019',
      gpa: 'GPA: 3.6 / 4.0 (Distinction)',
      honors: 'Academic Excellence Scholarship (4 consecutive semesters)',
      description: 'Specialized in Software Engineering, Distributed Systems, Data Structures & Algorithms.',
    },
  ],
  certifications: [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2024',
      credentialId: 'AWS-SAA-982143',
    },
    {
      title: 'Meta Frontend Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      issueDate: '2023',
    },
  ],
  languages: [
    { language: 'Vietnamese', level: 'Native', percent: 100 },
    { language: 'English', level: 'Professional Working Proficiency (IELTS 7.0)', percent: 85 },
  ],
  interests: [
    '🎮 Arcade & Indie Game Development',
    '☕ Specialty Coffee Brewing',
    '📖 System Architecture & Clean Code',
    '🏋️ Fitness & Strength Training',
  ],
};

// Default Isometric Overview Camera for Anime Cozy Room (Zoomed out slightly for spacious view)
export const ROOM_STATIC_CAMERA = {
  position: [5.4, 4.3, 5.4] as [number, number, number],
  target: [0, 0.65, 0] as [number, number, number],
  fov: 37,
};

export const ROOM_OBJECTS_CONFIG: RoomObjectInfo[] = [
  {
    id: 'computer',
    name: 'Workstation Monitor',
    vietnameseName: 'Computer Monitor & CV',
    shortDesc: 'Open the computer to explore the interactive desktop and resume',
    category: 'Workstation',
    badge: 'MAIN / IT CV',
    camera: {
      position: [0, 1.25, 0.9],
      target: [0, 1.15, -0.4],
      fov: 30,
    },
    details: {
      title: 'Developer PC Workstation',
      subtitle: 'Explore Developer Profile, Experience, Projects & Resume',
      description: 'Main workstation monitor. Click to launch the virtual desktop with direct resume access.',
      highlights: [
        '📄 Resume: Direct access to online resume',
        '💼 Experience: Engineering background & history',
        '🚀 Projects: Key featured software projects',
        '✉️ Contact: Get in touch & direct channels',
      ],
      actions: [
        { label: 'Open Computer Monitor', icon: 'Monitor', onClickId: 'open_pc' },
      ],
    },
  },
];
