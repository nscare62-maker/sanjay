/**
 * Sanjay S - Portfolio Core Data
 * B.Tech AIDS 2nd Year, Gojan School of Business and Technology
 * Full Stack Developer • Data Analyst • Game Developer
 */

const PORTFOLIO_DATA = {
  profile: {
    name: "Sanjay S",
    tagline: "Full Stack Developer • Data Analyst • Game Developer",
    degree: "B.Tech Artificial Intelligence and Data Science (AIDS)",
    year: "2nd Year",
    institution: "Gojan School of Business and Technology",
    location: "Chennai / Tamil Nadu, India",
    phone: "+91 99623 53867",
    whatsapp: "https://wa.me/919962353867",
    email: "nscare62@gmail.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Passionate B.Tech AIDS 2nd-year undergraduate at Gojan School of Business and Technology. Specialized in engineering modern full-stack web applications, extracting actionable predictive patterns from complex data streams, and building interactive, physics-driven 2D/3D game engines."
  },

  projects: [
    {
      id: "svarsh-tech",
      name: "Svarsh Technology Website",
      category: "fullstack",
      badge: "Corporate Web Tech",
      index: "01",
      tagline: "Modern Agency & Technology Services Web Architecture",
      summary: "High-performance corporate web presence engineered for Svarsh Technology, featuring dynamic service showcases, client inquiry pipelines, responsive mobile-first architecture, and sub-second load times.",
      techStack: ["React.js", "Node.js", "Express", "Tailwind CSS", "RESTful APIs", "MongoDB"],
      features: [
        "Interactive services matrix with dynamic pricing & quote calculation",
        "Automated client consultation booking & inquiry management system",
        "Optimized Core Web Vitals achieving 99+ Lighthouse performance scores",
        "Micro-animations and responsive fluid layout across all device viewports"
      ],
      architecture: "Decoupled Single Page Application (SPA) consuming a modular Express REST API backend with rate-limiting, CORS security headers, and MongoDB cluster persistence.",
      liveDemoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "svarsh-ecom-lms",
      name: "Svarsh E-commerce & LMS App",
      category: "fullstack",
      badge: "E-Commerce & LMS Hybrid",
      index: "02",
      tagline: "Unified Digital Commerce & Learning Management System",
      summary: "Comprehensive enterprise hybrid platform combining an online product shopping experience with a full-fledged Learning Management System (LMS) for course enrollment, video lessons, and student progress tracking.",
      techStack: ["MERN Stack", "React", "Redux Toolkit", "Node.js", "JWT Auth", "Cloudinary"],
      features: [
        "Dual-engine architecture: Unified storefront and interactive course portal",
        "Role-based access control (Student, Instructor, and Admin dashboards)",
        "Interactive video player with auto-saved timestamps and quiz assessments",
        "Real-time cart synchronization, discount coupons, and checkout workflow"
      ],
      architecture: "Full-Stack Node/Express server with JWT session verification, Cloudinary CDN asset pipelines, and normalized MongoDB document relationships for courses and orders.",
      liveDemoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "cyberguard",
      name: "CyberGuard App",
      category: "security",
      badge: "Cyber Security & Threat Intel",
      index: "03",
      tagline: "Real-time Threat Monitoring & Vulnerability Auditing Dashboard",
      summary: "Proactive cybersecurity telemetry dashboard designed to identify network anomalies, audit endpoint vulnerabilities, score security postures, and simulate defense mechanisms against unauthorized intrusions.",
      techStack: ["Python", "Node.js", "WebSockets", "Chart.js", "Tailwind CSS", "Security APIs"],
      features: [
        "Real-time simulated network packet inspector with anomaly detection alerts",
        "Vulnerability rating matrix with automated CVE lookup and patch guidance",
        "Interactive threat radar detecting brute-force patterns and suspicious IPs",
        "Automated audit compliance reporting with downloadable PDF summaries"
      ],
      architecture: "Event-driven WebSocket streaming engine piping telemetry signals into a reactive frontend dashboard with high-frequency Canvas/Chart visualizers.",
      liveDemoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "worksession",
      name: "WorkSessionTracker App",
      category: "productivity",
      badge: "Productivity & Time Analytics",
      index: "04",
      tagline: "High-Precision Work Session & Focus Analytics Suite",
      summary: "Productivity intelligence tool that tracks deep work sessions, monitors study intervals, calculates focus efficiency scores, and visualizes longitudinal productivity heatmaps.",
      techStack: ["React.js", "Local Cache / IndexedDB", "Web Workers", "Canvas Charts", "CSS Grid"],
      features: [
        "Configurable Pomodoro cycles and open-ended flow session timers",
        "Tag-based categorical logging with distraction-level scoring",
        "Interactive weekly & monthly productivity heatmaps (GitHub contribution style)",
        "Offline-first capability with instant local persistence and zero latency"
      ],
      architecture: "Client-side state architecture utilizing Web Workers for drift-free background interval timing and IndexedDB for instantaneous local session indexing.",
      liveDemoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "retail-web",
      name: "Retail Website",
      category: "fullstack",
      badge: "Commerce Retail Engine",
      index: "05",
      tagline: "Omnichannel Modern Retail & Inventory Management Platform",
      summary: "Next-gen retail storefront featuring multi-criteria faceted filtering, instant SKU search, live inventory updates, intuitive cart interactions, and frictionless checkout flows.",
      techStack: ["React", "TypeScript", "Node.js", "Express", "Tailwind CSS", "MongoDB"],
      features: [
        "Sub-millisecond product filtering across categories, price, and ratings",
        "Dynamic cart drawer with automatic stock check and tax calculations",
        "Interactive order status tracker with progress timeline visuals",
        "Mobile-optimized touch gestures for browsing product imagery"
      ],
      architecture: "Scalable REST architecture backed by MongoDB indexing for rapid search queries, optimized image lazy-loading, and responsive CSS grid viewports.",
      liveDemoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "automlfe",
      name: "AutoMLFE Website",
      category: "ai-data",
      badge: "AutoML & Feature Engineering",
      index: "06",
      tagline: "Automated Machine Learning & Feature Engineering Web Suite",
      summary: "Advanced AI/Data Science web platform that accepts raw tabular datasets, automatically performs exploratory data analysis, synthesizes engineered features, benchmarks candidate ML models, and outputs predictive metrics.",
      techStack: ["Python", "Flask / FastAPI", "Pandas", "Scikit-Learn", "NumPy", "Plotly / Canvas"],
      features: [
        "Automated missing value imputation, categorical encoding, and feature scaling",
        "Algorithmic feature synthesis (polynomial combinations, interaction terms)",
        "Leaderboard comparing Random Forest, XGBoost, and Logistic Regression models",
        "Interactive correlation heatmaps and ROC/AUC curve visualizers"
      ],
      architecture: "FastAPI computational backend executing Scikit-Learn pipelines asynchronously with WebSocket status updates delivered to a modern reactive frontend.",
      liveDemoUrl: "#",
      githubUrl: "#"
    }
  ],

  gates: [
    { index: 0, z: 0, name: "GATE 0 // ENTRANCE VECTOR", title: "Identity & Origin" },
    { index: 1, z: 1500, name: "GATE 1 // PROFILE DOSSIER", title: "B.Tech AIDS Profile" },
    { index: 2, z: 3000, name: "GATE 2 // PROJECT PORTALS", title: "Flagship Projects (6)" },
    { index: 3, z: 4500, name: "GATE 3 // ARSENAL MATRIX", title: "Technical Skills" },
    { index: 4, z: 6000, name: "GATE 4 // INTERACTIVE LAB", title: "Game & Data Lab" },
    { index: 5, z: 7500, name: "GATE 5 // QUANTUM UPLINK", title: "Contact Terminal" }
  ]
};

// Global exports for browser and node environments
if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}

