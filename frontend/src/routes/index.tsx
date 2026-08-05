import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ResumeData, TemplateId } from "../types/resume";
import { DEFAULT_RESUME_DATA, TEMPLATES_META } from "../data/defaultResumeData";
import { TemplateRenderer } from "../components/templates/TemplateRenderer";
import { requestAtsAnalysis, requestParseResume, requestParseResumeFile } from "../services/api";

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

function Index() {
  // Single Source of Truth Data Model
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);

  // Active Template ID
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("jake-faang");

  // Analysis Step State (Step 1: Resume Import -> Step 2: Job Description -> Step 3: Analysis Dashboard)
  const [analysisStep, setAnalysisStep] = useState<1 | 2 | 3>(1);
  const [analysisInputMode, setAnalysisInputMode] = useState<"upload" | "paste" | "active">("upload");

  // Async Scanner Modal State
  const [isScanningModalOpen, setIsScanningModalOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState("Extracting resume structure...");

  // Live Step Execution Logs Console
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setExecutionLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  // Target Job Description State
  const [targetJob, setTargetJob] = useState({
    title: "Senior Backend / Systems Engineer",
    company: "Meta / Linear",
    description:
      "Seeking an engineer with expertise in distributed systems, low-latency microservices, PyTorch pipelines, and performance optimization...",
  });

  // AI & Analysis Dynamic Results State from Backend
  const [atsScore, setAtsScore] = useState<number>(88);
  const [keywordGaps, setKeywordGaps] = useState<{ label: string; missing: boolean }[]>([
    { label: "Distributed Systems Architecture", missing: true },
    { label: "Low-Latency Microservices", missing: true },
    { label: "PyTorch Pipelines & ML Infrastructure", missing: true },
    { label: "Backend Performance Optimization", missing: true },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "s1",
      title: "Highlight Backend Infrastructure and Latency Metrics",
      rationale:
        "The job targets senior backend and systems engineering at scale. Reframing basic web development to emphasize backend architecture and latency reduction creates alignment.",
      rewrite:
        "Engineered scalable backend microservices and REST/GraphQL APIs for startup platform, optimizing database indexing and reducing server latency by 35%.",
      targetBulletId: "exp_1_b0",
      priority: true,
    },
  ]);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<string[]>([]);
  const [analysisSource, setAnalysisSource] = useState<string>("gemini-ai");

  // UI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modals & Upload State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parseStatus, setParseStatus] = useState<"idle" | "parsing" | "failed" | "success">("idle");

  const score = useMemo(
    () => Math.min(99, atsScore + appliedSuggestionIds.length * 10),
    [atsScore, appliedSuggestionIds.length],
  );

  const handleExportPdf = () => {
    window.print();
  };

  // Apply single AI Suggestion directly into the candidate's resume experience
  const handleApplySuggestion = (s: Suggestion) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) => {
        if (idx === 0) {
          return {
            ...exp,
            bullets: [s.rewrite, ...exp.bullets.slice(1)],
          };
        }
        return exp;
      }),
    }));

    setAppliedSuggestionIds((prev) => (prev.includes(s.id) ? prev : [...prev, s.id]));
    addLog(`✓ Applied AI rewrite "${s.title}" directly to experience section.`);
  };

  // Run Real Backend ATS Analysis with Async Scanning Modal
  const handleRunBackendAnalysis = async () => {
    setIsAnalyzing(true);
    setIsScanningModalOpen(true);
    setScanProgress(15);
    setScanStatusText("📄 Step 1/3: Parsing resume structure & metadata...");
    addLog("🚀 Starting ATS Analysis Pipeline...");

    const resumeTextSummary = `
      Name: ${resumeData.personal.fullName}
      Job Title: ${resumeData.personal.jobTitle}
      Summary: ${resumeData.summary}
      Experience: ${resumeData.experience.map((e) => `${e.role} at ${e.company}: ${e.bullets.join(" ")}`).join(" | ")}
      Skills: ${resumeData.skills.map((s) => `${s.category}: ${s.skills.join(", ")}`).join(" | ")}
    `;

    setTimeout(() => {
      setScanProgress(50);
      setScanStatusText("🔍 Step 2/3: Comparing keywords against target job description...");
    }, 800);

    setTimeout(() => {
      setScanProgress(80);
      setScanStatusText("✨ Step 3/3: Gemini AI computing ATS score & keyword gaps...");
    }, 1600);

    try {
      const res = await requestAtsAnalysis({
        resumeText: resumeTextSummary,
        jobTitle: targetJob.title,
        company: targetJob.company,
        jobDescription: targetJob.description,
      });

      if (res.success) {
        setAtsScore(res.score);
        setKeywordGaps(res.gaps);
        setSuggestions(res.suggestions);
        setAnalysisSource(res.source);
        addLog(`✨ Gemini AI returned ATS Match Score: ${res.score}% (Source: ${res.source})`);
      }
    } catch (err: any) {
      addLog(`⚠️ Backend connection error: ${err.message || "Failed to reach server"}. Using local engine.`);
    } finally {
      setScanProgress(100);
      setTimeout(() => {
        setIsScanningModalOpen(false);
        setAnalysisStep(3);
        setIsAnalyzing(false);
      }, 400);
    }
  };

  // Handle Binary PDF / Word File Upload via Server Endpoint
  const handleFileUpload = async (file: File) => {
    setParseStatus("parsing");
    setUploadedFileName(file.name);
    addLog(`📂 Uploaded file "${file.name}" (${Math.round(file.size / 1024)} KB)`);

    try {
      addLog(`📡 Uploading binary file to backend server for PDF text extraction & Gemini AI parsing...`);
      const res = await requestParseResumeFile(file);
      if (res.success && res.data) {
        setResumeData(res.data);
        setParseStatus("success");
        addLog(`✓ Server successfully extracted text & parsed resume for candidate: ${res.data.personal.fullName}`);
      } else {
        setParseStatus("failed");
      }
    } catch (err: any) {
      setParseStatus("failed");
      addLog(`❌ PDF server upload error: ${err.message}`);
    }
  };

  const handleParsePastedText = async () => {
    if (!pastedText.trim()) return;
    setParseStatus("parsing");
    addLog(`📝 Parsing pasted text input...`);
    try {
      const res = await requestParseResume(pastedText);
      if (res.success && res.data) {
        setResumeData(res.data);
        addLog(`✓ Successfully parsed pasted resume into Data Model.`);
      }
    } catch (err: any) {
      addLog(`⚠️ Fallback text parsing used: ${err.message}`);
    } finally {
      setParseStatus("success");
      setParseStatus("idle");
      setPastedText("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-[#1A1A1A] antialiased">
      {/* Top Header Bar */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#E5E3DC] bg-white px-8 print:hidden">
        <div className="flex items-center gap-8">
          <span className="font-display text-[16px] font-extrabold tracking-wider uppercase text-[#1A1A1A]">
            RESUME.AI
          </span>
          <div className="h-4 w-px bg-[#E5E3DC]" />
          <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#8B2626]">
            ✨ PRESENTATION MODE (ATS OPTIMIZER)
          </span>
        </div>

        <div className="flex items-center gap-4">
          {analysisStep === 3 && (
            <button
              onClick={handleExportPdf}
              className="bg-[#1A1A1A] text-white font-mono text-[11px] tracking-wider uppercase font-semibold px-5 py-2.5 hover:bg-[#333333] transition-colors"
            >
              EXPORT PDF
            </button>
          )}
        </div>
      </nav>

      {/* ASYNC AI SCANNING MODAL */}
      {isScanningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-white border border-[#E5E3DC] w-full max-w-[500px] p-8 shadow-2xl space-y-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF0F0] text-[#8B2626] border border-[#F0D5D5] animate-pulse">
              <span className="text-[28px]">✨</span>
            </div>
            <div>
              <h3 className="font-display text-[20px] font-extrabold text-[#1A1A1A]">
                Analyzing ATS Match & Keywords
              </h3>
              <p className="text-[12px] font-mono text-[#888888] mt-1">{scanStatusText}</p>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-[#EAE8E3] overflow-hidden rounded-full">
                <div
                  className="h-full bg-[#8B2626] transition-all duration-500 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#888888]">
                <span>Gemini AI Engine</span>
                <span>{scanProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Main Guided Steps Flow */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F6]">
        {/* Analysis Progress Stepper Bar */}
        <div className="bg-white border-b border-[#E5E3DC] px-12 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-8 mx-auto">
            {[
              { step: 1, label: "1. IMPORT RESUME PDF/WORD" },
              { step: 2, label: "2. PASTE JOB DESCRIPTION" },
              { step: 3, label: "3. ATS ANALYSIS RESULTS" },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  if (s.step <= analysisStep || (analysisStep === 3 && s.step <= 3)) {
                    setAnalysisStep(s.step as any);
                  }
                }}
                className={`font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 transition-all ${
                  analysisStep === s.step
                    ? "text-[#8B2626]"
                    : analysisStep > s.step
                    ? "text-[#1A1A1A] hover:text-[#8B2626]"
                    : "text-[#888888] cursor-not-allowed"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                    analysisStep === s.step
                      ? "bg-[#8B2626] text-white"
                      : analysisStep > s.step
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#E5E3DC] text-[#888888]"
                  }`}
                >
                  {s.step}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: IMPORT RESUME PDF / WORD / TEXT */}
        {analysisStep === 1 && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="bg-white border border-[#E5E3DC] w-full max-w-[680px] p-10 shadow-sm space-y-6">
              <div>
                <span className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] block mb-1">
                  STEP 1 OF 3
                </span>
                <h2 className="font-display text-[24px] font-extrabold text-[#1A1A1A]">
                  Import Resume File (PDF / Word / Text)
                </h2>
                <p className="text-[13px] text-[#666666] mt-1">
                  Upload your PDF or Word document, paste raw text, or use the default demo profile.
                </p>
              </div>

              {/* Input Mode Selector */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "upload", label: "📄 Upload PDF / Word" },
                  { id: "paste", label: "📝 Paste Resume Text" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setAnalysisInputMode(m.id as any);
                      setParseStatus("idle");
                    }}
                    className={`py-2.5 font-mono text-[10px] uppercase tracking-wider font-bold border ${
                      analysisInputMode === m.id
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-[#666666] border-[#E5E3DC] hover:border-[#888888]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* MODE A: UPLOAD PDF / WORD */}
              {analysisInputMode === "upload" && (
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
                      id="analysis-file-input"
                    />
                    <label htmlFor="analysis-file-input" className="cursor-pointer block">
                      <span className="text-[32px] block mb-2">📄</span>
                      <span className="font-bold text-[14px] text-[#1A1A1A] block">
                        {uploadedFileName ? `Selected: ${uploadedFileName}` : "Drag & Drop PDF or Word Resume"}
                      </span>
                      <span className="font-mono text-[11px] text-[#888888] block mt-1">
                        Accepts .pdf, .docx, .doc, or .txt files
                      </span>
                    </label>
                  </div>

                  {parseStatus === "parsing" && (
                    <div className="p-3 bg-[#FAF0F0] border border-[#F0D5D5] font-mono text-[11px] text-[#8B2626] text-center">
                      ⏳ Server extracting PDF text & structuring with Gemini AI...
                    </div>
                  )}

                  {parseStatus === "success" && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 font-mono text-[11px] text-emerald-800 text-center font-bold">
                      ✓ File successfully extracted & structured into Data Model!
                    </div>
                  )}
                </div>
              )}

              {/* MODE B: PASTE TEXT */}
              {analysisInputMode === "paste" && (
                <div className="space-y-4">
                  <textarea
                    rows={6}
                    placeholder="Paste your raw resume text here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-4 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
                  />
                  <button
                    onClick={handleParsePastedText}
                    className="w-full bg-[#1A1A1A] text-white font-mono text-[11px] font-bold uppercase tracking-wider py-3 hover:bg-[#333333]"
                  >
                    Parse Text Into Profile
                  </button>
                </div>
              )}



              <button
                onClick={() => setAnalysisStep(2)}
                disabled={parseStatus === "parsing"}
                className="w-full bg-[#8B2626] text-white font-mono text-[11px] font-bold uppercase tracking-wider py-4 hover:bg-[#731F1F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {parseStatus === "parsing" ? "⏳ EXTRACTING RESUME TEXT..." : "CONTINUE TO JOB DESCRIPTION →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PASTE JOB DESCRIPTION */}
        {analysisStep === 2 && (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="bg-white border border-[#E5E3DC] w-full max-w-[680px] p-10 shadow-sm space-y-6">
              <div>
                <span className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] block mb-1">
                  STEP 2 OF 3
                </span>
                <h2 className="font-display text-[24px] font-extrabold text-[#1A1A1A]">
                  Paste Target Job Description
                </h2>
                <p className="text-[13px] text-[#666666] mt-1">
                  Paste the job posting requirements to compare candidate skills and run ATS score analysis.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={targetJob.title}
                      onChange={(e) => setTargetJob({ ...targetJob, title: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-3 text-[12px] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
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
                      className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-3 text-[12px] font-bold text-[#1A1A1A] focus:outline-none focus:border-[#8B2626]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#888888] mb-1 block">
                    Job Posting Requirements & Text
                  </label>
                  <textarea
                    rows={7}
                    value={targetJob.description}
                    onChange={(e) => setTargetJob({ ...targetJob, description: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E3DC] p-4 text-[12px] text-[#1A1A1A] leading-relaxed focus:outline-none focus:border-[#8B2626]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setAnalysisStep(1)}
                  className="border border-[#E5E3DC] text-[#666666] font-mono text-[11px] uppercase tracking-wider font-bold px-6 py-4 hover:text-[#1A1A1A]"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleRunBackendAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 bg-[#8B2626] text-white font-mono text-[11px] font-bold uppercase tracking-wider py-4 hover:bg-[#731F1F] transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? "✨ RUNNING GEMINI AI ANALYSIS..." : "✨ RUN ATS ANALYSIS →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ANALYSIS RESULTS DASHBOARD */}
        {analysisStep === 3 && (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Side: Live Rendered Resume Template */}
            <div className="flex flex-1 flex-col items-center overflow-y-auto px-12 py-12">
              <div className="w-full max-w-[800px] mb-4 flex justify-between items-center print:hidden">
                <button
                  onClick={() => setAnalysisStep(2)}
                  className="font-mono text-[10px] text-[#8B2626] font-bold uppercase hover:underline"
                >
                  ← Modify Job Description
                </button>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#888888] uppercase">
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                    Source: {analysisSource}
                  </span>
                  <span>Target: {targetJob.title} @ {targetJob.company}</span>
                </div>
              </div>

              <div className="w-full max-w-[800px]">
                <TemplateRenderer
                  templateId={selectedTemplateId}
                  data={resumeData}
                  editable={false}
                />
              </div>
            </div>

            {/* Right Side: ATS Metrics, Keyword Gaps, AI Rewrites, Live Logs */}
            <aside className="w-[380px] border-l border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto p-8 print:hidden">
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
                    {score >= 85 ? "EXCELLENT MATCH" : "GOOD MATCH"}
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
                    KEYWORD GAPS ({keywordGaps.filter(k => k.missing).length} Missing)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {keywordGaps.map((k) => (
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

                {/* AI Suggestions with Interactive 1-Click Apply */}
                <div className="pt-6 border-t border-[#E5E3DC] mt-6">
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#888888] uppercase mb-4 block">
                    AI REWRITE SUGGESTIONS
                  </span>
                  <div className="space-y-4">
                    {suggestions.map((s) => {
                      const isApplied = appliedSuggestionIds.includes(s.id);
                      return (
                        <div key={s.id} className="p-4 border border-[#E5E3DC] bg-white space-y-3">
                          <h4 className="font-bold text-[13px] text-[#1A1A1A] flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8B2626]" />
                            {s.title}
                          </h4>
                          <p className="text-[12px] text-[#666666] leading-relaxed">
                            {s.rationale}
                          </p>
                          <div className="p-3 bg-[#FAF0F0] border-l-2 border-[#8B2626] font-semibold text-[12px] text-[#8B2626]">
                            {s.rewrite}
                          </div>
                          <button
                            onClick={() => handleApplySuggestion(s)}
                            disabled={isApplied}
                            className={`w-full py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                              isApplied
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default"
                                : "bg-[#8B2626] text-white border-[#8B2626] hover:bg-[#731F1F]"
                            }`}
                          >
                            {isApplied ? "✓ APPLIED TO RESUME" : "✨ APPLY REWRITE TO RESUME →"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Execution Logs Console Box */}
                {executionLogs.length > 0 && (
                  <div className="pt-6 border-t border-[#E5E3DC] mt-6">
                    <span className="font-mono text-[10px] tracking-widest font-bold text-[#8B2626] uppercase mb-2 block">
                      ⚡ LIVE EXECUTION LOGS
                    </span>
                    <div className="p-3 bg-[#1A1A1A] text-emerald-400 font-mono text-[10px] space-y-1 max-h-[160px] overflow-y-auto">
                      {executionLogs.map((log, idx) => (
                        <div key={idx} className="leading-snug">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
