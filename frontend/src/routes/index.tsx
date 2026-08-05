import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RESUME.AI — AI Resume Assistant & ATS Match Editor" },
      {
        name: "description",
        content:
          "Tailor your resume to any job description with AI rewrite suggestions, ATS match scoring, and keyword gap analysis in one quiet, precise workspace.",
      },
      { property: "og:title", content: "RESUME.AI — AI Resume Assistant" },
      {
        property: "og:description",
        content:
          "AI rewrite suggestions, ATS match scoring, and keyword gaps — a minimal workspace for tailoring your resume.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Suggestion = {
  id: string;
  title: string;
  rationale: string;
  rewrite: string;
  targetBulletId: string;
  priority: boolean;
};

type Bullet = { id: string; text: string };

type VersionSnapshot = {
  id: string;
  name: string;
  timestamp: string;
  score: number;
  bullets: Bullet[];
};

type TemplatePreset = {
  id: string;
  name: string;
  category: "Standard" | "Fresher / Student" | "Experienced" | "Tech & Engineering";
  description: string;
  font: "font-sans" | "font-mono" | "font-serif";
  personalInfo: { name: string; location: string; website: string; phone: string };
  roleHeader: string;
  bullets: Bullet[];
  education: { school: string; year: string };
  skills: string[];
};

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "standard",
    name: "Standard Executive",
    category: "Standard",
    description: "Classic ATS-parsed layout for mid-level professionals and general industry roles.",
    font: "font-sans",
    personalInfo: {
      name: "ALEXANDER VOGEL",
      location: "BERLIN, DE",
      website: "AVOGEL.DESIGN",
      phone: "+49 176 000 000",
    },
    roleHeader: "Lead Product Designer — Formless",
    bullets: [
      {
        id: "b1",
        text: "Spearheaded the design of a novel collaborative workspace used by 50k+ users, focusing on low-latency interactions.",
      },
      {
        id: "b2",
        text: "Managed a team of 4 designers and 2 researchers across multiple timezones.",
      },
      {
        id: "b3",
        text: "Implemented a comprehensive design system using token-based architecture to unify three separate web platforms.",
      },
    ],
    education: {
      school: "Universität der Künste Berlin — Visual Communication",
      year: "2017",
    },
    skills: ["Systems Thinking", "Interaction Prototyping", "Figma Plugins", "Distillation"],
  },
  {
    id: "fresher",
    name: "Student & Graduate Fresher",
    category: "Fresher / Student",
    description: "Highlights Education, Coursework, Capstone Projects, and Core Skills for entry-level roles.",
    font: "font-sans",
    personalInfo: {
      name: "ALEXANDER VOGEL",
      location: "BOSTON, MA",
      website: "GITHUB.COM/AVOGEL",
      phone: "+1 617 000 0000",
    },
    roleHeader: "Academic Capstone Project & Design Intern — MIT Media Lab",
    bullets: [
      {
        id: "fb1",
        text: "Developed an interactive web-based data visualization engine using React and TypeScript for final year thesis.",
      },
      {
        id: "fb2",
        text: "Maintained a 3.9 GPA with high honors in Algorithms, Software Architecture, and User Interface Design.",
      },
      {
        id: "fb3",
        text: "Collaborated with a student team of 4 to design and present a low-latency collaborative workspace prototype.",
      },
    ],
    education: {
      school: "Massachusetts Institute of Technology (MIT) — B.S. Computer Science",
      year: "2026 (Expected)",
    },
    skills: ["React", "TypeScript", "UI/UX Design", "Data Structures", "Git & GitHub"],
  },
  {
    id: "experienced",
    name: "Senior Leadership & Lead",
    category: "Experienced",
    description: "Emphasizes revenue impact, team growth, organizational scaling, and strategic metrics.",
    font: "font-serif",
    personalInfo: {
      name: "ALEXANDER VOGEL",
      location: "SAN FRANCISCO, CA",
      website: "AVOGEL.CO",
      phone: "+1 415 000 0000",
    },
    roleHeader: "Director of Product Design — Formless Inc.",
    bullets: [
      {
        id: "eb1",
        text: "Scaled engineering and design org from 6 to 34 members while accelerating annual product shipping velocity by 45%.",
      },
      {
        id: "eb2",
        text: "Architected end-to-end design systems strategy that reduced cross-platform production regressions by 50%.",
      },
      {
        id: "eb3",
        text: "Championed customer-centric product roadmap driving $12M ARR in net new enterprise ARR growth.",
      },
    ],
    education: {
      school: "Stanford University — M.S. Human-Computer Interaction",
      year: "2015",
    },
    skills: ["Executive Leadership", "Revenue Growth", "Design Systems Strategy", "Cross-functional Scale"],
  },
  {
    id: "tech",
    name: "Software & Systems Engineer",
    category: "Tech & Engineering",
    description: "Optimized for Software Engineers, Systems Architects, and Technical Roles.",
    font: "font-mono",
    personalInfo: {
      name: "ALEXANDER VOGEL",
      location: "SEATTLE, WA",
      website: "AVOGEL.DEV",
      phone: "+1 206 000 0000",
    },
    roleHeader: "Senior Staff Software Engineer — Distributed Systems",
    bullets: [
      {
        id: "tb1",
        text: "Architected microservices infrastructure in Node.js and Go handling 120,000 requests/sec with 99.999% uptime.",
      },
      {
        id: "tb2",
        text: "Built real-time streaming data pipeline using Kafka and MongoDB, reducing query latencies from 420ms to 18ms.",
      },
      {
        id: "tb3",
        text: "Pioneered CI/CD test automation framework reducing build failure rates across 14 repository services by 35%.",
      },
    ],
    education: {
      school: "University of Washington — B.S. Computer Engineering",
      year: "2018",
    },
    skills: ["Node.js", "TypeScript", "MongoDB", "Distributed Systems", "Docker & Kubernetes"],
  },
];

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    title: "Impact Quantifier",
    rationale: "Your leadership bullet lacks concrete metrics. Linear values outcome-oriented designers.",
    rewrite:
      "Architected a design-led culture by scaling a multidisciplinary team of 6, reducing design-to-dev handoff time by 40%.",
    targetBulletId: "b2",
    priority: true,
  },
  {
    id: "s2",
    title: "Semantic Alignment",
    rationale: 'Replace "collaborative workspace" with the job description\'s own vocabulary of distilled workflows.',
    rewrite:
      "Distilled complex collaborative workflows into a low-latency workspace now used by 50k+ users.",
    targetBulletId: "b1",
    priority: false,
  },
  {
    id: "s3",
    title: "Systems Thinking Signal",
    rationale: "Name the systems outcome explicitly — the role screens hard for systems thinking.",
    rewrite:
      "Built a token-based design system that unified three web platforms and cut UI regressions by 32%.",
    targetBulletId: "b3",
    priority: false,
  },
];

const KEYWORDS = [
  { label: "Systems Thinking", missing: true },
  { label: "Interaction Prototyping", missing: true },
  { label: "Figma Plugins", missing: false },
  { label: "Distillation", missing: true },
];

const TABS = ["EDITOR", "ANALYSIS", "VERSIONS"] as const;

function Index() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("EDITOR");

  // Document Content State
  const [activeTemplateId, setActiveTemplateId] = useState<string>("standard");
  const [targetJob, setTargetJob] = useState({
    title: "Senior Product Designer",
    company: "Linear",
    description:
      "Seeking a designer with obsession for craft, systems thinking, and ability to distill complex workflows into elegant interfaces...",
  });

  const [personalInfo, setPersonalInfo] = useState({
    name: "ALEXANDER VOGEL",
    location: "BERLIN, DE",
    website: "AVOGEL.DESIGN",
    phone: "+49 176 000 000",
  });

  const [roleHeader, setRoleHeader] = useState("Lead Product Designer — Formless");
  const [bullets, setBullets] = useState<Bullet[]>(TEMPLATE_PRESETS[0]!.bullets);
  const [education, setEducation] = useState({
    school: "Universität der Künste Berlin — Visual Communication",
    year: "2017",
  });
  const [skillsList, setSkillsList] = useState<string[]>(TEMPLATE_PRESETS[0]!.skills);

  // Editor Styling State
  const [selectedFont, setSelectedFont] = useState<"font-sans" | "font-mono" | "font-serif">("font-sans");
  const [density, setDensity] = useState<"compact" | "normal" | "spacious">("normal");

  // AI & Analysis State
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<string[]>([]);
  const [openSuggestionId, setOpenSuggestionId] = useState<string | null>("s1");
  const [activeBulletHover, setActiveBulletHover] = useState<string | null>(null);
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Import & Templates Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<"upload" | "paste" | "scratch">("upload");
  const [pastedResumeText, setPastedResumeText] = useState("");
  const [parseStatus, setParseStatus] = useState<"idle" | "parsing" | "failed" | "success">("idle");
  const [isUpgradingAts, setIsUpgradingAts] = useState(false);

  // Version Control History State
  const [versions, setVersions] = useState<VersionSnapshot[]>([
    {
      id: "v1",
      name: "Initial Import",
      timestamp: "Aug 5, 2026 • 11:40 PM",
      score: 84,
      bullets: TEMPLATE_PRESETS[0]!.bullets,
    },
  ]);

  const score = useMemo(
    () => Math.min(98, 84 + appliedSuggestionIds.length * 5),
    [appliedSuggestionIds.length],
  );

  const activeSuggestion = suggestions.find((s) => s.id === openSuggestionId) ?? null;

  // Select Template Action
  const handleSelectTemplate = (preset: TemplatePreset) => {
    setActiveTemplateId(preset.id);
    setSelectedFont(preset.font);
    setPersonalInfo(preset.personalInfo);
    setRoleHeader(preset.roleHeader);
    setBullets(preset.bullets);
    setEducation(preset.education);
    setSkillsList(preset.skills);
    setIsTemplateModalOpen(false);
  };

  // Actions
  const updateBulletText = (id: string, newText: string) => {
    setBullets((prev) => prev.map((b) => (b.id === id ? { ...b, text: newText } : b)));
  };

  const addBullet = () => {
    const newId = `b_${Date.now()}`;
    setBullets((prev) => [...prev, { id: newId, text: "Click to write a new key achievement..." }]);
  };

  const deleteBullet = (id: string) => {
    setBullets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAiEnhanceBullet = (id: string) => {
    setAiGeneratingId(id);
    setTimeout(() => {
      setBullets((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            return {
              ...b,
              text: b.text.includes("reducing")
                ? b.text
                : `${b.text} Architected a design-led culture that reduced handoff times by 40%.`,
            };
          }
          return b;
        }),
      );
      setAiGeneratingId(null);
    }, 1000);
  };

  const handleFileUpload = (file: File) => {
    setParseStatus("parsing");
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.name.endsWith(".txt") && content && content.trim().length > 10) {
        setTimeout(() => {
          parseRawTextIntoResume(content);
          setParseStatus("success");
          setTimeout(() => setIsImportModalOpen(false), 800);
        }, 800);
      } else {
        setTimeout(() => {
          setParseStatus("failed");
        }, 1000);
      }
    };

    reader.onerror = () => {
      setParseStatus("failed");
    };

    if (file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        setParseStatus("failed");
      }, 1000);
    }
  };

  const parseRawTextIntoResume = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      setPersonalInfo((prev) => ({
        ...prev,
        name: lines[0]?.trim().toUpperCase() || prev.name,
      }));
    }
    const extractedBullets = lines.slice(1, 6).map((line, idx) => ({
      id: `imported_${idx}_${Date.now()}`,
      text: line.trim(),
    }));

    if (extractedBullets.length > 0) {
      setBullets(extractedBullets);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedResumeText.trim()) return;
    setParseStatus("parsing");
    setTimeout(() => {
      parseRawTextIntoResume(pastedResumeText);
      setParseStatus("success");
      setTimeout(() => {
        setIsImportModalOpen(false);
        setParseStatus("idle");
        setPastedResumeText("");
      }, 800);
    }, 1000);
  };

  const handleStartBlankResume = () => {
    setPersonalInfo({
      name: "YOUR NAME",
      location: "LOCATION, CITY",
      website: "YOURWEBSITE.COM",
      phone: "+1 000 000 0000",
    });
    setBullets([
      { id: `blank_1`, text: "Click here to write your first key achievement or bullet point." },
    ]);
    setIsImportModalOpen(false);
  };

  const handleMakeAtsFriendly = () => {
    setIsUpgradingAts(true);
    setTimeout(() => {
      setBullets([
        {
          id: "b1_ats",
          text: "Spearheaded the design of a novel collaborative workspace with interactive prototyping, serving 50k+ users with low-latency workflows.",
        },
        {
          id: "b2_ats",
          text: "Architected a design-led culture by scaling a multidisciplinary team of 6, reducing design-to-dev handoff time by 40%.",
        },
        {
          id: "b3_ats",
          text: "Implemented a comprehensive token-based design system with systems thinking signal that unified 3 web platforms and reduced UI regressions by 32%.",
        },
      ]);
      setAppliedSuggestionIds(["s1", "s2", "s3"]);
      setSuggestions([]);
      setIsUpgradingAts(false);
    }, 1200);
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    if (openSuggestionId === id) setOpenSuggestionId(null);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    setBullets((prev) =>
      prev.map((b) => (b.id === suggestion.targetBulletId ? { ...b, text: suggestion.rewrite } : b)),
    );
    setAppliedSuggestionIds((prev) => [...prev, suggestion.id]);
    dismissSuggestion(suggestion.id);
  };

  const createVersionSnapshot = () => {
    const newVer: VersionSnapshot = {
      id: `v_${Date.now()}`,
      name: `Draft Version ${versions.length + 1}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      score: score,
      bullets: [...bullets],
    };
    setVersions((prev) => [newVer, ...prev]);
  };

  const restoreVersion = (v: VersionSnapshot) => {
    setBullets(v.bullets);
  };

  const rescan = () => {
    setSuggestions(INITIAL_SUGGESTIONS);
    setBullets(TEMPLATE_PRESETS[0]!.bullets);
    setAppliedSuggestionIds([]);
    setOpenSuggestionId("s1");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-[#1A1A1A] antialiased">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#E5E3DC] bg-white px-8">
        <div className="flex items-center gap-8">
          <span className="font-display text-[16px] font-extrabold tracking-wider uppercase text-[#1A1A1A]">
            RESUME.AI
          </span>
          <div className="h-4 w-px bg-[#E5E3DC]" />
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-[11px] tracking-widest font-semibold uppercase transition-colors relative py-5 ${
                  activeTab === tab
                    ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]"
                    : "text-[#888888] hover:text-[#1A1A1A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="border border-[#E5E3DC] text-[#1A1A1A] font-mono text-[11px] uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-[#FAF9F6] transition-colors"
          >
            🎨 TEMPLATES
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="border border-[#E5E3DC] text-[#1A1A1A] font-mono text-[11px] uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-[#FAF9F6] transition-colors"
          >
            📄 IMPORT RESUME
          </button>
          <button
            onClick={handleMakeAtsFriendly}
            disabled={isUpgradingAts}
            className="bg-[#8B2626] text-white font-mono text-[11px] uppercase tracking-wider font-bold px-5 py-2.5 hover:bg-[#731F1F] transition-colors disabled:opacity-50"
          >
            {isUpgradingAts ? "✨ UPGRADING..." : "✨ MAKE ATS FRIENDLY"}
          </button>
          <button className="bg-[#1A1A1A] text-white font-mono text-[11px] tracking-wider uppercase font-semibold px-5 py-2.5 hover:bg-[#333333] transition-colors">
            EXPORT PDF
          </button>
        </div>
      </nav>

      {/* TEMPLATES PRESET SELECTION MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E3DC] w-full max-w-[780px] p-8 shadow-xl relative animate-rise">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E3DC] pb-4">
              <div>
                <h3 className="font-display text-[20px] font-extrabold text-[#1A1A1A]">
                  Select ATS-Friendly Resume Template
                </h3>
                <p className="text-[12px] text-[#666666]">
                  Choose a tailored layout designed for your career stage (Freshers, Students, Experienced, or Tech).
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-[#888888] hover:text-[#1A1A1A] font-mono text-[14px]"
              >
                ✕
              </button>
            </div>

            {/* Template Preset Cards Grid */}
            <div className="grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
              {TEMPLATE_PRESETS.map((preset) => {
                const isSelected = activeTemplateId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectTemplate(preset)}
                    className={`p-6 border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#FAF0F0] border-[#8B2626] shadow-sm"
                        : "bg-white border-[#E5E3DC] hover:border-[#888888]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-[#8B2626] bg-[#FAF0F0] px-2 py-0.5 border border-[#F0D5D5]">
                        {preset.category}
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] text-[#8B2626] font-bold">
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[15px] text-[#1A1A1A] mb-1">{preset.name}</h4>
                    <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                      {preset.description}
                    </p>
                    <div className="pt-3 border-t border-[#E5E3DC]/60 flex items-center justify-between text-[11px] font-mono text-[#888888]">
                      <span>Font: {preset.font.replace("font-", "")}</span>
                      <span className="text-[#8B2626] font-bold">Use Template →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* IMPORT / UPLOAD RESUME MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E3DC] w-full max-w-[620px] p-8 shadow-xl relative animate-rise">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E3DC] pb-4">
              <div>
                <h3 className="font-display text-[20px] font-extrabold text-[#1A1A1A]">
                  Import or Create Resume
                </h3>
                <p className="text-[12px] text-[#666666]">
                  Upload your existing resume, paste raw text, or start fresh from scratch.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParseStatus("idle");
                }}
                className="text-[#888888] hover:text-[#1A1A1A] font-mono text-[14px]"
              >
                ✕
              </button>
            </div>

            {/* Import Mode Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { id: "upload", label: "📄 Upload PDF / Word" },
                { id: "paste", label: "📝 Paste Resume Text" },
                { id: "scratch", label: "✨ Start Blank" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setImportMode(m.id as any);
                    setParseStatus("idle");
                  }}
                  className={`py-2.5 font-mono text-[10px] uppercase tracking-wider font-bold border ${
                    importMode === m.id
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#666666] border-[#E5E3DC] hover:border-[#888888]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* MODE 1: FILE UPLOAD DROPZONE */}
            {importMode === "upload" && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  className="border-2 border-dashed border-[#E5E3DC] hover:border-[#8B2626] p-10 text-center bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                    className="hidden"
                    id="resume-file-input"
                  />
                  <label htmlFor="resume-file-input" className="cursor-pointer block">
                    <span className="text-[32px] block mb-2">📄</span>
                    <span className="font-bold text-[14px] text-[#1A1A1A] block">
                      Drag & Drop your Resume here
                    </span>
                    <span className="font-mono text-[11px] text-[#888888] block mt-1">
                      Supports PDF, DOCX, DOC, or TXT
                    </span>
                  </label>
                </div>

                {/* Parsing Status Messages */}
                {parseStatus === "parsing" && (
                  <div className="p-4 bg-[#FAF0F0] border border-[#F0D5D5] font-mono text-[11px] text-[#8B2626] text-center">
                    ⏳ Extracting resume content & formatting with AI...
                  </div>
                )}

                {parseStatus === "failed" && (
                  <div className="p-4 bg-[#FAF0F0] border border-[#F0D5D5] space-y-2">
                    <div className="font-mono text-[11px] text-[#8B2626] font-bold">
                      ⚠️ Could not extract text automatically from this file format.
                    </div>
                    <p className="text-[12px] text-[#666666]">
                      Don't worry! You can easily paste your resume text manually.
                    </p>
                    <button
                      onClick={() => setImportMode("paste")}
                      className="bg-[#8B2626] text-white font-mono text-[10px] uppercase font-bold px-4 py-2 mt-1 inline-block"
                    >
                      👉 Switch to Paste Resume Text
                    </button>
                  </div>
                )}

                {parseStatus === "success" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 font-mono text-[11px] text-emerald-800 text-center font-bold">
                    ✓ Resume successfully parsed into the editor!
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: PASTE TEXT */}
            {importMode === "paste" && (
              <div className="space-y-4">
                <textarea
                  rows={8}
                  placeholder="Paste your raw resume content here (Name, Summary, Experience bullet points, Education)..."
                  value={pastedResumeText}
                  onChange={(e) => setPastedResumeText(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-4 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
                />
                <button
                  onClick={handleParsePastedText}
                  disabled={!pastedResumeText.trim() || parseStatus === "parsing"}
                  className="w-full bg-[#8B2626] text-white font-mono text-[11px] font-bold uppercase tracking-wider py-3 hover:bg-[#731F1F] transition-colors disabled:opacity-50"
                >
                  {parseStatus === "parsing" ? "✨ PARSING WITH AI..." : "✨ PARSE WITH AI"}
                </button>
              </div>
            )}

            {/* MODE 3: START BLANK */}
            {importMode === "scratch" && (
              <div className="space-y-4 text-center py-6">
                <p className="text-[13px] text-[#666666] leading-relaxed max-w-[440px] mx-auto">
                  Don't have an existing resume? No problem! Start with a clean slate and build your resume section by section in our interactive editor.
                </p>
                <button
                  onClick={handleStartBlankResume}
                  className="bg-[#1A1A1A] text-white font-mono text-[11px] font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-[#333333] transition-colors"
                >
                  ✨ CREATE BLANK RESUME
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Workspace Split */}
      <main className="flex flex-1 overflow-hidden">
        {/* TAB 1: INTERACTIVE EDITOR */}
        {activeTab === "EDITOR" && (
          <>
            {/* Left Control Drawer */}
            <aside className="w-[340px] border-r border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto p-6 space-y-8">
              <div className="space-y-6">
                {/* Target Position Form */}
                <div>
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#8B2626] uppercase mb-3 block">
                    TARGET JOB POSTING
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={targetJob.title}
                        onChange={(e) => setTargetJob({ ...targetJob, title: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={targetJob.company}
                        onChange={(e) => setTargetJob({ ...targetJob, company: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Job Description Context
                      </label>
                      <textarea
                        rows={3}
                        value={targetJob.description}
                        onChange={(e) => setTargetJob({ ...targetJob, description: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-3 text-[11px] text-[#666666] leading-relaxed focus:outline-none focus:border-[#8B2626]"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography & Styling Controls */}
                <div className="pt-6 border-t border-[#E5E3DC]">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-3 block">
                    TYPOGRAPHY & DENSITY
                  </span>
                  <div className="space-y-4">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-2 block">
                        Font Family
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["font-sans", "font-mono", "font-serif"] as const).map((font) => (
                          <button
                            key={font}
                            onClick={() => setSelectedFont(font)}
                            className={`py-2 text-[11px] border font-mono uppercase ${
                              selectedFont === font
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                : "bg-white text-[#666666] border-[#E5E3DC] hover:border-[#888888]"
                            }`}
                          >
                            {font.replace("font-", "")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-2 block">
                        Layout Density
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["compact", "normal", "spacious"] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setDensity(d)}
                            className={`py-2 text-[10px] border font-mono uppercase ${
                              density === d
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                : "bg-white text-[#666666] border-[#E5E3DC] hover:border-[#888888]"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor Quick Actions */}
                <div className="pt-6 border-t border-[#E5E3DC] space-y-2">
                  <button
                    onClick={addBullet}
                    className="w-full border border-[#1A1A1A] text-[#1A1A1A] font-mono text-[11px] font-bold uppercase tracking-wider py-2.5 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                  >
                    + ADD BULLET POINT
                  </button>
                  <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="w-full border border-[#E5E3DC] text-[#666666] font-mono text-[11px] font-bold uppercase tracking-wider py-2 hover:border-[#888888] transition-colors"
                  >
                    🎨 SWITCH TEMPLATE
                  </button>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#888888]">
                💡 Tip: Click directly on the resume text to edit it in real-time.
              </div>
            </aside>

            {/* Center Interactive Resume Sheet Workspace */}
            <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start">
              <div
                className={`w-full max-w-[760px] bg-white border border-[#E5E3DC] shadow-sm transition-all ${selectedFont} ${
                  density === "compact" ? "p-8" : density === "spacious" ? "p-16" : "p-12"
                }`}
              >
                {/* Header Info (Interactive Input) */}
                <header className="mb-10 group relative border-b border-transparent hover:border-[#E5E3DC] pb-4">
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="font-display text-[36px] leading-none font-extrabold tracking-tight text-[#1A1A1A] bg-transparent w-full focus:outline-none focus:bg-[#FAF9F6] px-1"
                  />
                  <div className="mt-3 flex gap-4 font-mono text-[10px] tracking-wider uppercase text-[#888888]">
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                      className="bg-transparent focus:outline-none focus:bg-[#FAF9F6] px-1 w-24"
                    />
                    <span>•</span>
                    <input
                      type="text"
                      value={personalInfo.website}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                      className="bg-transparent focus:outline-none focus:bg-[#FAF9F6] px-1 w-32"
                    />
                    <span>•</span>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="bg-transparent focus:outline-none focus:bg-[#FAF9F6] px-1 w-36"
                    />
                  </div>
                </header>

                {/* Interactive Experience Section */}
                <section className="mb-10">
                  <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                    PROFESSIONAL EXPERIENCE & HIGHLIGHTS
                  </h2>

                  <div className="mb-3 flex items-baseline justify-between">
                    <input
                      type="text"
                      value={roleHeader}
                      onChange={(e) => setRoleHeader(e.target.value)}
                      className="text-[14px] font-bold text-[#1A1A1A] bg-transparent focus:outline-none focus:bg-[#FAF9F6] w-full"
                    />
                    <span className="font-mono text-[10px] tracking-wider text-[#888888] uppercase shrink-0">
                      2021–PRESENT
                    </span>
                  </div>

                  {/* Bullet Points with Floating AI Toolbars */}
                  <ul className="space-y-4 text-[13px] leading-relaxed text-[#333333]">
                    {bullets.map((bullet) => {
                      const isHovered = activeBulletHover === bullet.id;
                      const isGenerating = aiGeneratingId === bullet.id;

                      return (
                        <li
                          key={bullet.id}
                          onMouseEnter={() => setActiveBulletHover(bullet.id)}
                          onMouseLeave={() => setActiveBulletHover(null)}
                          className="relative group p-2 rounded-none hover:bg-[#FAF9F6] border border-transparent hover:border-[#E5E3DC] transition-all"
                        >
                          <textarea
                            rows={2}
                            value={bullet.text}
                            onChange={(e) => updateBulletText(bullet.id, e.target.value)}
                            className="w-full bg-transparent text-[13px] leading-relaxed text-[#333333] focus:outline-none resize-none"
                          />

                          {/* Floating Contextual AI Toolbar */}
                          {isHovered && (
                            <div className="absolute -top-3 right-2 flex items-center gap-1 bg-[#1A1A1A] text-white px-2 py-1 shadow-md z-10">
                              <button
                                onClick={() => handleAiEnhanceBullet(bullet.id)}
                                disabled={isGenerating}
                                className="font-mono text-[9px] uppercase tracking-wider text-[#F0D5D5] hover:text-white px-2 py-0.5 flex items-center gap-1"
                              >
                                {isGenerating ? "✨ Enhancing..." : "✨ AI Enhance"}
                              </button>
                              <div className="h-3 w-px bg-neutral-700" />
                              <button
                                onClick={() => deleteBullet(bullet.id)}
                                className="font-mono text-[9px] text-red-400 hover:text-red-300 px-1"
                              >
                                🗑
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Skills Tag Cloud Section */}
                <section className="mb-10">
                  <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-4 pb-1 border-b border-[#E5E3DC]">
                    CORE SKILLS & TECHNOLOGIES
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] px-3 py-1 bg-[#FAF9F6] border border-[#E5E3DC] text-[#1A1A1A]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Interactive Education Section */}
                <section>
                  <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                    EDUCATION & CREDENTIALS
                  </h2>
                  <div className="flex items-baseline justify-between">
                    <input
                      type="text"
                      value={education.school}
                      onChange={(e) => setEducation({ ...education, school: e.target.value })}
                      className="text-[14px] font-medium text-[#1A1A1A] bg-transparent focus:outline-none focus:bg-[#FAF9F6] w-full"
                    />
                    <input
                      type="text"
                      value={education.year}
                      onChange={(e) => setEducation({ ...education, year: e.target.value })}
                      className="font-mono text-[10px] tracking-wider text-[#888888] bg-transparent focus:outline-none focus:bg-[#FAF9F6] text-right w-24 shrink-0"
                    />
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ANALYSIS (REFERENCE DESIGN) */}
        {activeTab === "ANALYSIS" && (
          <>
            <div className="flex flex-1 flex-col items-center overflow-y-auto px-12 py-12">
              {/* Target Position Box */}
              <div className="w-full max-w-[720px] mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8B2626]" />
                  <span className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626]">
                    TARGET POSITION
                  </span>
                </div>
                <div className="bg-white border border-[#E5E3DC] p-6 shadow-none">
                  <h2 className="text-[15px] font-bold tracking-tight text-[#1A1A1A]">
                    {targetJob.title} <span className="text-[#666666] font-normal">@ {targetJob.company}</span>
                  </h2>
                  <p className="mt-2 text-[13px] text-[#666666] leading-relaxed italic">
                    "{targetJob.description}"
                  </p>
                </div>
              </div>

              {/* Resume Preview Sheet */}
              <div className="w-full max-w-[720px] bg-white border border-[#E5E3DC] p-12 shadow-sm">
                <header className="mb-10">
                  <h1 className="font-display text-[36px] leading-none font-extrabold tracking-tight text-[#1A1A1A]">
                    {personalInfo.name}
                  </h1>
                  <div className="mt-3 flex gap-5 font-mono text-[10px] tracking-wider uppercase text-[#888888]">
                    <span>{personalInfo.location}</span>
                    <span>{personalInfo.website}</span>
                    <span>{personalInfo.phone}</span>
                  </div>
                </header>

                <section className="mb-10">
                  <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                    PROFESSIONAL EXPERIENCE & HIGHLIGHTS
                  </h2>

                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                      {roleHeader}
                    </h3>
                    <span className="font-mono text-[10px] tracking-wider text-[#888888] uppercase">
                      2021–PRESENT
                    </span>
                  </div>

                  <ul className="space-y-4 text-[13px] leading-relaxed text-[#333333]">
                    {bullets.map((b) => (
                      <li key={b.id}>{b.text}</li>
                    ))}
                    {activeSuggestion && (
                      <div className="my-4 p-5 bg-[#FAF0F0] border-l-2 border-[#8B2626]">
                        <span className="font-mono text-[9px] tracking-widest font-bold uppercase text-[#8B2626] mb-2 block">
                          AI SUGGESTION
                        </span>
                        <p className="text-[13px] font-semibold leading-relaxed text-[#8B2626]">
                          {activeSuggestion.rewrite}
                        </p>
                      </div>
                    )}
                  </ul>
                </section>

                <section>
                  <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                    EDUCATION & CREDENTIALS
                  </h2>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-medium text-[#1A1A1A]">{education.school}</h3>
                    <span className="font-mono text-[10px] tracking-wider text-[#888888]">
                      {education.year}
                    </span>
                  </div>
                </section>
              </div>
            </div>

            {/* Right Sidebar Panel */}
            <aside className="w-[380px] border-l border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto">
              <div className="p-8 space-y-8">
                <div>
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                    MATCH SCORE
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-[48px] font-extrabold leading-none text-[#1A1A1A]">
                        {score}
                      </span>
                      <span className="font-display text-[24px] font-bold text-[#1A1A1A]">%</span>
                    </div>
                    <span className="font-mono text-[9px] tracking-widest font-bold uppercase text-[#8B2626] bg-[#FAF0F0] border border-[#F0D5D5] px-3 py-1 rounded-none">
                      STRONG MATCH
                    </span>
                  </div>
                  <div className="mt-4 h-2 w-full bg-[#EAE8E3] rounded-none overflow-hidden">
                    <div
                      className="h-full bg-[#8B2626] transition-all duration-700 ease-out"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5E3DC]">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                    KEYWORD GAPS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {KEYWORDS.map((k) => (
                      <span
                        key={k.label}
                        className={`font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-none border ${
                          k.missing
                            ? "bg-[#FAF0F0] border-[#F0D5D5] text-[#8B2626]"
                            : "bg-white border-[#E5E3DC] text-[#666666]"
                        }`}
                      >
                        {k.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5E3DC]">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                    REWRITE SUGGESTIONS
                  </span>

                  {suggestions.length === 0 ? (
                    <div className="p-5 bg-[#FAF9F6] border border-[#E5E3DC] text-[12px] text-[#666666] leading-relaxed">
                      All suggestions resolved. Your resume is fully optimized for this role!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {suggestions.map((suggestion) => {
                        const isSelected = openSuggestionId === suggestion.id;
                        const isImpactCard = suggestion.id === "s1";

                        return (
                          <div
                            key={suggestion.id}
                            className={`p-5 border transition-all ${
                              isSelected
                                ? "bg-white border-[#E5E3DC] shadow-sm"
                                : "bg-white border-[#E5E3DC]"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#8B2626]" />
                              <h4 className="font-bold text-[13px] text-[#1A1A1A]">
                                {suggestion.title}
                              </h4>
                            </div>
                            <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                              {suggestion.rationale}
                            </p>

                            {isImpactCard ? (
                              <div className="space-y-2">
                                <button
                                  onClick={() => applySuggestion(suggestion)}
                                  className="w-full bg-[#8B2626] text-white font-mono text-[11px] uppercase tracking-wider font-bold py-2.5 hover:bg-[#731F1F] transition-colors text-center block rounded-none"
                                >
                                  APPLY CHANGE
                                </button>
                                <button
                                  onClick={() => dismissSuggestion(suggestion.id)}
                                  className="w-full bg-white border border-[#E5E3DC] text-[#666666] font-mono text-[11px] uppercase tracking-wider font-bold py-2.5 hover:text-[#1A1A1A] hover:border-[#CCCCCC] transition-colors text-center block rounded-none"
                                >
                                  IGNORE
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  if (isSelected) {
                                    applySuggestion(suggestion);
                                  } else {
                                    setOpenSuggestionId(suggestion.id);
                                  }
                                }}
                                className="w-full bg-white border border-[#E5E3DC] text-[#1A1A1A] font-mono text-[11px] uppercase tracking-wider font-bold py-2.5 hover:bg-[#FAF9F6] transition-colors text-center block rounded-none"
                              >
                                {isSelected ? "APPLY CHANGE" : "REVIEW"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-[#E5E3DC] bg-[#FAF9F6]">
                <button
                  onClick={rescan}
                  className="w-full font-mono text-[11px] uppercase tracking-widest font-bold text-[#888888] hover:text-[#1A1A1A] transition-colors flex items-center justify-between"
                >
                  <span>RESCAN DRAFT</span>
                  <span className="text-[10px] tracking-normal">⌘R</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* TAB 3: VERSION HISTORY */}
        {activeTab === "VERSIONS" && (
          <div className="flex-1 p-12 overflow-y-auto max-w-[800px] mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-[24px] font-bold text-[#1A1A1A]">
                  Version History
                </h2>
                <p className="text-[13px] text-[#666666]">
                  Restore or review previous iterations of your tailored resume.
                </p>
              </div>
              <button
                onClick={createVersionSnapshot}
                className="bg-[#1A1A1A] text-white font-mono text-[11px] uppercase font-semibold px-4 py-2.5"
              >
                + SAVE NEW SNAPSHOT
              </button>
            </div>

            <div className="space-y-4">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="bg-[#white] border border-[#E5E3DC] p-6 flex items-center justify-between hover:border-[#1A1A1A] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-[14px] text-[#1A1A1A]">{ver.name}</h4>
                      <span className="font-mono text-[10px] text-[#8B2626] bg-[#FAF0F0] border border-[#F0D5D5] px-2 py-0.5 font-bold">
                        {ver.score}% ATS Match
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#888888] mt-1 block">
                      {ver.timestamp} • {ver.bullets.length} bullets recorded
                    </span>
                  </div>
                  <button
                    onClick={() => restoreVersion(ver)}
                    className="border border-[#E5E3DC] text-[#1A1A1A] font-mono text-[11px] font-bold uppercase px-4 py-2 hover:bg-[#FAF9F6]"
                  >
                    RESTORE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
