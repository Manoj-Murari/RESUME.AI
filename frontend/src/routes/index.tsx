import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ResumeData, TemplateId } from "../types/resume";
import { DEFAULT_RESUME_DATA, TEMPLATES_META } from "../data/defaultResumeData";
import { TemplateRenderer } from "../components/templates/TemplateRenderer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RESUME.AI — AI Resume Assistant & Modular ATS Template Engine" },
      {
        name: "description",
        content:
          "Tailor your resume to any job description with single source-of-truth data, real-time template switching, ATS match scoring, and AI rewrites.",
      },
      { property: "og:title", content: "RESUME.AI — Modular ATS Resume Engine" },
      {
        property: "og:description",
        content:
          "Single-source resume data model with live template switching and instant ATS optimization.",
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

type VersionSnapshot = {
  id: string;
  name: string;
  timestamp: string;
  score: number;
  data: ResumeData;
};

const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "s1",
    title: "Impact Quantifier",
    rationale: "Your leadership bullet lacks concrete metrics. Linear values outcome-oriented engineers.",
    rewrite:
      "Architected backend infrastructure scaling team velocity by 40% while processing 2B+ monthly active recommendations.",
    targetBulletId: "exp_1_b1",
    priority: true,
  },
  {
    id: "s2",
    title: "Semantic Alignment",
    rationale: 'Replace generic wording with job description\'s vocabulary of low-latency distributed systems.',
    rewrite:
      "Engineered low-latency distributed systems serving personalized recommendation streams to 2B+ users.",
    targetBulletId: "exp_1_b0",
    priority: false,
  },
];

const KEYWORDS = [
  { label: "Distributed Systems", missing: false },
  { label: "eBPF Kernel Capture", missing: true },
  { label: "PyTorch Classifiers", missing: false },
  { label: "Metrics Aggregation", missing: true },
];

const TABS = ["EDITOR", "ANALYSIS", "VERSIONS"] as const;

function Index() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("EDITOR");

  // Single Source of Truth Data Model
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  // Active Template ID
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("jake-faang");

  // Target Job Description State
  const [targetJob, setTargetJob] = useState({
    title: "Senior Backend / Systems Engineer",
    company: "Meta / Linear",
    description:
      "Seeking an engineer with expertise in distributed systems, low-latency microservices, PyTorch pipelines, and performance optimization...",
  });

  // AI & Analysis State
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<string[]>([]);
  const [openSuggestionId, setOpenSuggestionId] = useState<string | null>("s1");
  const [isUpgradingAts, setIsUpgradingAts] = useState(false);

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState<"upload" | "paste" | "scratch">("upload");
  const [pastedText, setPastedText] = useState("");
  const [parseStatus, setParseStatus] = useState<"idle" | "parsing" | "failed" | "success">("idle");

  // Version Control History State
  const [versions, setVersions] = useState<VersionSnapshot[]>([
    {
      id: "v1",
      name: "Initial Data State",
      timestamp: "Aug 5, 2026 • 11:55 PM",
      score: 88,
      data: DEFAULT_RESUME_DATA,
    },
  ]);

  const score = useMemo(
    () => Math.min(99, 88 + appliedSuggestionIds.length * 5),
    [appliedSuggestionIds.length],
  );

  const activeSuggestion = suggestions.find((s) => s.id === openSuggestionId) ?? null;

  // State Updates Handler
  const handleUpdateResumeData = (partial: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...partial }));
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleMakeAtsFriendly = () => {
    setIsUpgradingAts(true);
    setTimeout(() => {
      setResumeData((prev) => ({
        ...prev,
        experience: prev.experience.map((exp, idx) => {
          if (idx === 0) {
            return {
              ...exp,
              bullets: [
                "Engineered low-latency distributed systems with request batching and connection pooling, reducing API response latency by 35%.",
                "Built PyTorch-based automated classifier pipelines processing 10M+ daily events with 97.3% precision.",
                "Architected metrics aggregation and eBPF kernel capture infrastructure across multi-region services.",
              ],
            };
          }
          return exp;
        }),
      }));
      setAppliedSuggestionIds(["s1", "s2"]);
      setSuggestions([]);
      setIsUpgradingAts(false);
    }, 1000);
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    setParseStatus("parsing");
    setTimeout(() => {
      const lines = pastedText.split("\n").filter((l) => l.trim().length > 0);
      setResumeData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: lines[0]?.trim().toUpperCase() || prev.personal.fullName,
        },
      }));
      setParseStatus("success");
      setTimeout(() => {
        setIsImportModalOpen(false);
        setParseStatus("idle");
        setPastedText("");
      }, 800);
    }, 1000);
  };

  const createVersionSnapshot = () => {
    const newVer: VersionSnapshot = {
      id: `v_${Date.now()}`,
      name: `Snapshot ${versions.length + 1}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      score: score,
      data: JSON.parse(JSON.stringify(resumeData)),
    };
    setVersions((prev) => [newVer, ...prev]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-[#1A1A1A] antialiased">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#E5E3DC] bg-white px-8 print:hidden">
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
            🎨 TEMPLATES ({TEMPLATES_META.find((t) => t.id === selectedTemplateId)?.name})
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="border border-[#E5E3DC] text-[#1A1A1A] font-mono text-[11px] uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-[#FAF9F6] transition-colors"
          >
            📄 IMPORT
          </button>
          <button
            onClick={handleMakeAtsFriendly}
            disabled={isUpgradingAts}
            className="bg-[#8B2626] text-white font-mono text-[11px] uppercase tracking-wider font-bold px-5 py-2.5 hover:bg-[#731F1F] transition-colors disabled:opacity-50"
          >
            {isUpgradingAts ? "✨ UPGRADING..." : "✨ MAKE ATS FRIENDLY"}
          </button>
          <button
            onClick={handleExportPdf}
            className="bg-[#1A1A1A] text-white font-mono text-[11px] tracking-wider uppercase font-semibold px-5 py-2.5 hover:bg-[#333333] transition-colors"
          >
            EXPORT PDF
          </button>
        </div>
      </nav>

      {/* TEMPLATE PICKER MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white border border-[#E5E3DC] w-full max-w-[800px] p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E3DC] pb-4">
              <div>
                <h3 className="font-display text-[20px] font-extrabold text-[#1A1A1A]">
                  Select Modular ATS Template
                </h3>
                <p className="text-[12px] text-[#666666]">
                  Every template renders your exact data model dynamically without data loss.
                </p>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-[#888888] hover:text-[#1A1A1A] font-mono text-[14px]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
              {TEMPLATES_META.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setIsTemplateModalOpen(false);
                    }}
                    className={`p-6 border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#FAF0F0] border-[#8B2626] shadow-sm"
                        : "bg-white border-[#E5E3DC] hover:border-[#888888]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest font-bold text-[#8B2626] bg-[#FAF0F0] px-2 py-0.5 border border-[#F0D5D5]">
                        {tmpl.category}
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] text-[#8B2626] font-bold">
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[15px] text-[#1A1A1A] mb-1">{tmpl.name}</h4>
                    <p className="text-[12px] text-[#666666] leading-relaxed mb-4">
                      {tmpl.description}
                    </p>
                    <div className="pt-3 border-t border-[#E5E3DC]/60 text-right text-[11px] font-mono text-[#8B2626] font-bold">
                      Switch Layout →
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* IMPORT RESUME MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 print:hidden">
          <div className="bg-white border border-[#E5E3DC] w-full max-w-[600px] p-8 shadow-xl relative">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E3DC] pb-4">
              <h3 className="font-display text-[20px] font-extrabold text-[#1A1A1A]">
                Import Resume Data
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-[#888888] hover:text-[#1A1A1A] font-mono text-[14px]"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                rows={8}
                placeholder="Paste raw resume text here to auto-populate fields into the single data model..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-4 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
              />
              <button
                onClick={handleParsePastedText}
                className="w-full bg-[#8B2626] text-white font-mono text-[11px] font-bold uppercase tracking-wider py-3 hover:bg-[#731F1F]"
              >
                {parseStatus === "parsing" ? "PARSING..." : "PARSE INTO DATA MODEL"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Split */}
      <main className="flex flex-1 overflow-hidden">
        {/* TAB 1: MODULAR EDITOR VIEW */}
        {activeTab === "EDITOR" && (
          <>
            {/* Left Control Drawer (Data Model Field Inputs) */}
            <aside className="w-[360px] border-r border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto p-6 space-y-6 print:hidden">
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#8B2626] uppercase mb-3 block">
                    TARGET JOB & MATCH DATA
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Target Job Title
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
                  </div>
                </div>

                {/* Personal Information Inputs */}
                <div className="pt-6 border-t border-[#E5E3DC]">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-3 block">
                    PERSONAL INFORMATION
                  </span>
                  <div className="space-y-3">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={resumeData.personal.fullName}
                        onChange={(e) =>
                          handleUpdateResumeData({
                            personal: { ...resumeData.personal, fullName: e.target.value },
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] px-3 py-2 text-[12px] font-bold text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Email Address
                      </label>
                      <input
                        type="text"
                        value={resumeData.personal.email}
                        onChange={(e) =>
                          handleUpdateResumeData({
                            personal: { ...resumeData.personal, email: e.target.value },
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                        Location
                      </label>
                      <input
                        type="text"
                        value={resumeData.personal.location}
                        onChange={(e) =>
                          handleUpdateResumeData({
                            personal: { ...resumeData.personal, location: e.target.value },
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E3DC] px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E3DC] text-[11px] font-mono text-[#888888]">
                💡 Changing values in this sidebar immediately re-renders every ATS template.
              </div>
            </aside>

            {/* Center Resume Workspace (Interactive Live Preview) */}
            <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start print:p-0 print:overflow-visible">
              <div className="w-full max-w-[800px]">
                <TemplateRenderer
                  templateId={selectedTemplateId}
                  data={resumeData}
                  editable={true}
                  onUpdateData={handleUpdateResumeData}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ANALYSIS VIEW */}
        {activeTab === "ANALYSIS" && (
          <>
            <div className="flex flex-1 flex-col items-center overflow-y-auto px-12 py-12">
              <div className="w-full max-w-[800px] mb-8">
                <TemplateRenderer
                  templateId={selectedTemplateId}
                  data={resumeData}
                  editable={false}
                />
              </div>
            </div>

            <aside className="w-[380px] border-l border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto p-8">
              <div>
                <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                  ATS MATCH SCORE
                </span>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-[48px] font-extrabold leading-none text-[#1A1A1A]">
                      {score}
                    </span>
                    <span className="font-display text-[24px] font-bold text-[#1A1A1A]">%</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest font-bold uppercase text-[#8B2626] bg-[#FAF0F0] border border-[#F0D5D5] px-3 py-1">
                    EXCELLENT MATCH
                  </span>
                </div>

                <div className="h-2 w-full bg-[#EAE8E3] overflow-hidden mb-8">
                  <div
                    className="h-full bg-[#8B2626] transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>

                <div className="pt-6 border-t border-[#E5E3DC]">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                    KEYWORD GAPS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {KEYWORDS.map((k) => (
                      <span
                        key={k.label}
                        className={`font-mono text-[11px] px-3 py-1.5 border ${
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
              </div>
            </aside>
          </>
        )}

        {/* TAB 3: VERSIONS VIEW */}
        {activeTab === "VERSIONS" && (
          <div className="flex-1 p-12 overflow-y-auto max-w-[800px] mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-[24px] font-bold text-[#1A1A1A]">
                Version History
              </h2>
              <button
                onClick={createVersionSnapshot}
                className="bg-[#1A1A1A] text-white font-mono text-[11px] uppercase font-semibold px-4 py-2.5"
              >
                + SAVE SNAPSHOT
              </button>
            </div>

            <div className="space-y-4">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="bg-white border border-[#E5E3DC] p-6 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-[14px] text-[#1A1A1A]">{ver.name}</h4>
                      <span className="font-mono text-[10px] text-[#8B2626] bg-[#FAF0F0] border border-[#F0D5D5] px-2 py-0.5 font-bold">
                        {ver.score}% ATS Match
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#888888] mt-1 block">
                      {ver.timestamp}
                    </span>
                  </div>
                  <button
                    onClick={() => setResumeData(ver.data)}
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
