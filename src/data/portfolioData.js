export const PERSONAL_INFO = {
  name: "Sahay Reddy",
  role: "Creative Technologist & Systems Architect",
  clearance: "ALPHA / LEVEL 5",
  idNumber: "SR-94021",
  location: "San Francisco, CA & Global Remote",
  email: "sahayreddy6916@gmail.com",
  bioHeadline: "Architecting high-frequency digital realities, spatial computing interfaces, and resilient distributed architectures.",
  experienceYears: "8+",
  productionDeployments: "40+",
  uptimeRecord: "99.99%",
  openSourceContributions: "18k+",
  avatarImage: "/src/assets/images/engineer_portrait_1793330766023.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com", handle: "@sahayreddy" },
    { name: "LinkedIn", url: "https://linkedin.com", handle: "sahay-reddy" },
    { name: "X / Twitter", url: "https://x.com", handle: "@sahay_dev" },
    { name: "Bluesky", url: "https://bsky.app", handle: "@sahay.bsky.social" }
  ]
};

export const PROJECTS_DATA = [
  {
    id: "spatial-arcology",
    title: "Spatial Arcology AI Studio",
    category: "AI & Spatial",
    shortDescription: "Generative node-based spatial canvas engine rendering multidimensional architecture topologies at 120 FPS.",
    fullDescription: "A groundbreaking browser-based spatial computing studio that fuses generative AI node graphs with WebGL shaders. Engineers and architects can prompt, chain, and synthesize 3D physical structures with real-time parametric constraints.",
    image: "/src/assets/images/project_spatial_interface_1793330766619.jpg",
    tags: ["React", "WebGL", "Three.js", "Web Workers", "WebAssembly", "Tailwind CSS"],
    metrics: "120 FPS render loop · <12ms latency · 85k monthly simulations",
    architecture: [
      "Custom WebAssembly spatial geometry partitioner for zero-copy mesh transfers",
      "Asynchronous node execution scheduler with backpressure regulation",
      "Procedural WebGL shader pipeline for photorealistic bioluminescent refraction"
    ],
    liveUrl: "https://spatial-arcology.internal-demo.app",
    githubUrl: "https://github.com/sahayreddy/spatial-arcology"
  },
  {
    id: "quantum-cloud-mesh",
    title: "Hyper-Telemetry Distributed Mesh",
    category: "Cloud Systems",
    shortDescription: "Ultra-low-latency distributed cluster orchestrator with real-time topological telemetry stream visualization.",
    fullDescription: "An enterprise telemetry engine monitoring distributed container clusters across 14 multi-cloud zones. Uses high-throughput binary WebSockets and canvas-based graph rendering to track millions of metrics per second with zero UI jank.",
    image: "/src/assets/images/project_distributed_cloud_1793330768089.jpg",
    tags: ["Go", "TypeScript", "gRPC", "WebSockets", "Canvas2D", "Distributed Systems"],
    metrics: "2.4M metrics/sec · 99.999% reliability · 4.8ms p99 ingestion",
    architecture: [
      "Ring-buffer memory pool preventing V8 garbage collection stutter",
      "Dynamic quadtree spatial indexing for 100,000+ interactive cluster nodes",
      "Automated edge failover reconciliation protocol with Paxos consensus"
    ],
    liveUrl: "https://telemetry-mesh.internal-demo.app",
    githubUrl: "https://github.com/sahayreddy/distributed-mesh"
  },
  {
    id: "neurosynth-soundscape",
    title: "NeuroSynth Generative Audio Engine",
    category: "Audio & Visual",
    shortDescription: "WebAudio DSP synthesizer with algorithmic grain synthesis and interactive spectral spectrogram projection.",
    fullDescription: "An avant-garde sound creation platform running custom AudioWorklet processors directly in client browsers. Features granular synthesis, wavetable interpolation, and real-time Fourier spectrogram visualization.",
    image: "/src/assets/images/project_creative_synth_1793330767197.jpg",
    tags: ["Web Audio API", "AudioWorklet", "DSP", "React", "Canvas", "Framer Motion"],
    metrics: "48kHz 32-bit float · 0 buffer under-runs · 14 internal DSP modules",
    architecture: [
      "Dedicated AudioWorklet thread decoupled from main UI event loop",
      "SIMD-accelerated FFT calculation for high-resolution visual waterfall",
      "Interactive physics-modeled tactile dials with momentum dampening"
    ],
    liveUrl: "https://neurosynth.internal-demo.app",
    githubUrl: "https://github.com/sahayreddy/neurosynth"
  }
];

export const SKILLS_CATEGORIES = [
  {
    category: "Human Resource Management Resource",
    direction: "left",
    skills: [
      { name: "React 19 & Next.js", level: 90, highlight: "Component concurrency & server rendering" },
      { name: "Javascript", level: 70, highlight: "Dynamic DOM manipulation, event-driven, and efficient client-side logic." },
      { name: "Webpack-CLI & Vite", level: 75, highlight: "Build tools & bundlers" },
      { name: "TailwindCSS & HTML-CSS", level: 70, highlight: "Atomic tokens & responsive design" }
    ]
  },
  {
    category: "Autocrat Engineers - Advanced Manufacturing Systems",
    direction: "right",
    skills: [
      { name: "Typescript", level: 85, highlight: "Enhancing JavaScript development with static typing, structured interfaces, and advanced type definitions to build scalable, maintainable, and reliable application architectures." },
      { name: "React.js & .env", level: 70, highlight: "Intermediate knowledge" },
      { name: "Recharts & Three.js", level: 70, highlight: "Geometry and material manipulation" },
      { name: "TailwindCSS & HTML-CSS", level: 85, highlight: "Advanced knowledge" }
    ]
  },
  {
    category: "Scancraft -  Barcode & QR generator",
    direction: "left",
    skills: [
      { name: "Gemini API & LLM Agents", level: 70, highlight: "Used for Natural Language Understanding and Task Automation." },
      { name: "bcryptjs & Jwt-auth", level: 89, highlight: "Used for Secure Password Hashing and Authentication." },
      { name: "QRcode.React", level: 82, highlight: "Enabling seamless data sharing, URL encoding, and interactive user experiences through customizable QR components." },
      { name: "Typescript", level: 85, highlight: "Enhancing JavaScript development with static typing, structured interfaces, and advanced type definitions to build scalable, maintainable, and reliable application architectures." }
    ]
  }
];

export const EXPERIENCE_DATA = [
  {
    period: "[Jan]2026 — Present",
    role: "Autocrat Engineers - Advanced Manufacruing systems",
    company: "Autocrat Engineers",
    location: "Bangalore, Karnataka",
    summary: "Designed and developed an advanced manufacturing management system, integrating intelligent production workflows, streamlined operational processes, and data-driven monitoring to enhance manufacturing efficiency and process visibility.",
    highlights: [
      "Engineered a comprehensive manufacturing management dashboard for real-time production oversight and operational analytics.",
      "Implemented dynamic visualization modules to track machine performance, production throughput, and process metrics with interactive clarity.",
      "As a frontend Developer i had Optimize data flow and state management for high-frequency updates, ensuring responsive and reliable system performance."
    ],
    tech: ["React.js & TailwindCSS", "Javascript", "Recharts & Shadcn", "Node.js"]
  },
  {
    period: "[Aug]-2026 — [Nov]2026",
    role: "Alto Shaam - Master label System",
    company: "Autocrat Engineers",
    location: "Bangalore, Karnataka",
    summary: "This project is the Alto-Shaam Master Label System (MLS), an enterprise-grade web application built for generating, validating, and printing supply-chain shipment labels compliant with the AIAG B-10 Master Label Standard.",
    highlights: [
      "Input Validation & Sanitization: Validates required shipping manifest columns, extracts numbers, and cleans whitespace before sending to the backend.",
      "Dual-State Sidebar (Hover + Pin Lock): Collapses to a compact 72px icon rail and expands to 260px on hover or manual lock, persisting preference in localStorage.",
      "Fuzzy Header Aliasing: Normalizes and matches varying column headers through alias mapping (e.g., cust po num, part no., rev level, no of labels to be printed, packing list #)."
    ],
    tech: ["React19 & Vite 7", "JS Barcode", "Gemini API & LLM Agents", "Style.css"]
  },
  {
    period: "[Jan]-2026 — [Oct]-2026",
    role: "Human Resource Management System [HRMS]",
    company: "Autocrat Engineers",
    location: "Bangalore, Karnataka",
    summary: "This project is a Human Resource Management System (HRMS) web application built for managing employee information, attendance tracking, and leave management within an organization.",
    highlights: [
      "Employee Records: Manages employee details including personal information, contact details, emergency contacts, and employment history.",
      "Attendance Tracking: Records employee check-ins and check-outs, calculates daily working hours, and generates attendance summaries.",
      "Leave Management: Allows employees to apply for leave, and managers to review and approve/reject requests with status tracking."
    ],
    tech: ["JavaScript", "React.js", "Axios", "Bootstrap", "Webpack-CLI"]
  }
];

export const EDUCATION_DATA = [
  {
    degree: "B.S. in Computer Science & Interactive Media",
    institution: "University of California, Berkeley",
    period: "2014 — 2018",
    honors: "Summa Cum Laude · Dean's Honors List (All Semesters)",
    details: "Specialized in Computer Graphics, Distributed Algorithms, and Human-Computer Interaction. Senior capstone: Procedural Spatial Raymarching in WebGL."
  },
  {
    degree: "Advanced Certification in Distributed Cloud Systems",
    institution: "Cloud Native Computing Foundation (CNCF)",
    period: "2021",
    honors: "Top 2% Distinction Score",
    details: "Rigorous certification covering multi-cluster orchestration, fault-tolerant consensus architectures, and high-performance network topologies."
  }
];
