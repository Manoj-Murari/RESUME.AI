import { ResumeData, TemplateMeta } from "../types/resume";

export const DEFAULT_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "Jake Thompson",
    jobTitle: "Senior Software Engineer",
    email: "jake.thompson@email.com",
    phone: "(512) 555-0147",
    location: "Austin, TX",
    website: "jakethompson.dev",
    linkedin: "linkedin.com/in/jakethompson",
    github: "github.com/jakethompson",
  },
  summary:
    "Driven Senior Software Engineer with 5+ years of experience designing and scaling high-throughput distributed backend services, real-time collaboration platforms, and cloud infrastructure.",
  experience: [
    {
      id: "exp_1",
      company: "Meta Platforms, Inc.",
      role: "Software Engineer",
      location: "Menlo Park, CA",
      dates: "Jul 2023 – Present",
      bullets: [
        "Developed and maintained backend services for Instagram Reels recommendation system, serving personalized content to 2B+ monthly active users.",
        "Reduced API response latency by 35% by implementing request batching and connection pooling optimizations in the content delivery service.",
        "Built an automated content moderation pipeline using PyTorch-based classifiers, processing 10M+ pieces of content daily with 97.3% accuracy.",
        "Collaborated with product and data science teams to design and execute A/B experiments, driving a 6% increase in user engagement metrics.",
      ],
    },
    {
      id: "exp_2",
      company: "Amazon Web Services",
      role: "Software Engineering Intern",
      location: "Seattle, WA",
      dates: "May 2022 – Aug 2022",
      bullets: [
        "Designed and implemented a CloudWatch metrics aggregation service in Java, reducing monitoring costs by 40% for enterprise customers.",
        "Created an automated testing framework that increased integration test coverage from 62% to 91% across the monitoring service codebase.",
        "Presented project results to a team of 40+ engineers and received a return offer.",
      ],
    },
    {
      id: "exp_3",
      company: "Salesforce",
      role: "Software Engineering Intern",
      location: "San Francisco, CA",
      dates: "May 2021 – Aug 2021",
      bullets: [
        "Built a REST API for the Einstein Analytics platform using Python and Flask, enabling third-party developers to access predictive insights programmatically.",
        "Implemented OAuth 2.0 authentication flow and role-based access control, ensuring secure API access for 500+ beta partner organizations.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      institution: "University of Texas at Austin",
      degree: "B.S. Computer Science",
      location: "Austin, TX",
      dates: "Aug 2019 – May 2023",
      gpa: "3.82/4.00",
      coursework: [
        "Data Structures",
        "Algorithms",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
        "Database Management",
        "Machine Learning",
      ],
    },
  ],
  projects: [
    {
      id: "proj_1",
      title: "TaskFlow — Collaborative Project Management Tool",
      technologies: ["React", "Node.js", "PostgreSQL", "WebSocket", "Docker"],
      link: "github.com/jakethompson/taskflow",
      dates: "2023",
      bullets: [
        "Built a real-time project management application with drag-and-drop Kanban boards, team chat, and automated sprint analytics.",
        "Implemented WebSocket-based real-time collaboration supporting 50+ concurrent users per workspace with conflict resolution.",
      ],
    },
    {
      id: "proj_2",
      title: "PacketViz — Network Traffic Analyzer",
      technologies: ["Go", "eBPF", "React", "D3.js"],
      link: "github.com/jakethompson/packetviz",
      dates: "2022",
      bullets: [
        "Developed a network traffic visualization tool using eBPF for kernel-level packet capture with zero-copy performance.",
        "Created interactive D3.js dashboards displaying real-time network topology, bandwidth utilization, and anomaly detection alerts.",
      ],
    },
  ],
  skills: [
    {
      id: "sk_1",
      category: "Languages",
      skills: ["Python", "Java", "C++", "Go", "JavaScript/TypeScript", "SQL", "Hack"],
    },
    {
      id: "sk_2",
      category: "Frameworks",
      skills: ["React", "Node.js", "Flask", "Spring Boot", "PyTorch", "GraphQL"],
    },
    {
      id: "sk_3",
      category: "Tools & Cloud",
      skills: ["Git", "Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    },
    {
      id: "sk_4",
      category: "Databases",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Apache Cassandra"],
    },
  ],
  certifications: [
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
};

export const TEMPLATES_META: TemplateMeta[] = [
  {
    id: "jake-faang",
    name: "Jake / FAANG Classic",
    category: "Software & Engineering",
    description: "The gold-standard Overleaf LaTeX single-page ATS layout used by top tech companies.",
    previewColor: "#1A1A1A",
  },
  {
    id: "austere",
    name: "Austere Minimalist",
    category: "Executive & Clean",
    description: "Ultra-clean spacing with crimson accent section dividers for high readability.",
    previewColor: "#8B2626",
  },
  {
    id: "modern-split",
    name: "Modern Two-Column",
    category: "Design & Product",
    description: "Structured split layout featuring a dedicated skills/contact column.",
    previewColor: "#2563EB",
  },
  {
    id: "alex-webb",
    name: "Alex Webb Modern",
    category: "Full Stack & Web",
    description: "Balanced single-column design with subtle divider accents and clean metadata alignment.",
    previewColor: "#059669",
  },
  {
    id: "executive",
    name: "Executive Leadership",
    category: "Management & Senior",
    description: "Serif typography layout tailored for directors, managers, and senior leaders.",
    previewColor: "#4F46E5",
  },
];
