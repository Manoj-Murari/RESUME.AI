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

const INITIAL_BULLETS: Bullet[] = [
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
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("ANALYSIS");
  const [bullets, setBullets] = useState<Bullet[]>(INITIAL_BULLETS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<string[]>([]);
  const [openSuggestionId, setOpenSuggestionId] = useState<string | null>("s1");

  const score = useMemo(
    () => Math.min(98, 84 + appliedSuggestionIds.length * 5),
    [appliedSuggestionIds.length],
  );

  const activeSuggestion = suggestions.find((s) => s.id === openSuggestionId) ?? null;

  const dismiss = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    if (openSuggestionId === id) setOpenSuggestionId(null);
  };

  const apply = (suggestion: Suggestion) => {
    setBullets((prev) =>
      prev.map((b) => (b.id === suggestion.targetBulletId ? { ...b, text: suggestion.rewrite } : b)),
    );
    setAppliedSuggestionIds((prev) => [...prev, suggestion.id]);
    dismiss(suggestion.id);
  };

  const rescan = () => {
    setSuggestions(INITIAL_SUGGESTIONS);
    setBullets(INITIAL_BULLETS);
    setAppliedSuggestionIds([]);
    setOpenSuggestionId("s1");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] font-sans text-[#1A1A1A] antialiased">
      {/* Top Navigation */}
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
        <div className="flex items-center gap-6">
          <button className="bg-[#1A1A1A] text-white font-mono text-[11px] tracking-wider uppercase font-semibold px-6 py-2.5 hover:bg-[#333333] transition-colors rounded-none">
            EXPORT PDF
          </button>
        </div>
      </nav>

      <main className="flex flex-1 overflow-hidden">
        {/* Main Content Workspace */}
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
                Senior Product Designer <span className="text-[#666666] font-normal">@ Linear</span>
              </h2>
              <p className="mt-2 text-[13px] text-[#666666] leading-relaxed italic">
                "Seeking a designer with obsession for craft, systems thinking, and ability to distill complex workflows into elegant interfaces..."
              </p>
            </div>
          </div>

          {/* Resume Preview Sheet */}
          <div className="w-full max-w-[720px] bg-white border border-[#E5E3DC] p-12 shadow-sm">
            <header className="mb-10">
              <h1 className="font-display text-[36px] leading-none font-extrabold tracking-tight text-[#1A1A1A]">
                ALEXANDER VOGEL
              </h1>
              <div className="mt-3 flex gap-5 font-mono text-[10px] tracking-wider uppercase text-[#888888]">
                <span>BERLIN, DE</span>
                <span>AVOGEL.DESIGN</span>
                <span>+49 176 000 000</span>
              </div>
            </header>

            {/* Experience Section */}
            <section className="mb-10">
              <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                PROFESSIONAL EXPERIENCE
              </h2>

              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                  Lead Product Designer — Formless
                </h3>
                <span className="font-mono text-[10px] tracking-wider text-[#888888] uppercase">
                  2021–PRESENT
                </span>
              </div>

              <ul className="space-y-4 text-[13px] leading-relaxed text-[#333333]">
                <li>
                  Spearheaded the design of a novel collaborative workspace used by 50k+ users, focusing on low-latency interactions.
                </li>
                <li>
                  Managed a team of 4 designers and 2 researchers across multiple timezones.
                </li>

                {/* AI Suggestion Highlighted Box */}
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

                <li>
                  Implemented a comprehensive design system using token-based architecture to unify three separate web platforms.
                </li>
              </ul>
            </section>

            {/* Education Section */}
            <section>
              <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-5 pb-1 border-b border-[#E5E3DC]">
                EDUCATION
              </h2>
              <div className="flex items-baseline justify-between">
                <h3 className="text-[14px] font-medium text-[#1A1A1A]">
                  Universität der Künste Berlin — Visual Communication
                </h3>
                <span className="font-mono text-[10px] tracking-wider text-[#888888]">
                  2017
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Right Sidebar Panel */}
        <aside className="w-[380px] border-l border-[#E5E3DC] bg-white flex flex-col justify-between overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Match Score Section */}
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

              {/* Crimson Progress Bar */}
              <div className="mt-4 h-2 w-full bg-[#EAE8E3] rounded-none overflow-hidden">
                <div
                  className="h-full bg-[#8B2626] transition-all duration-700 ease-out"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Keyword Gaps Section */}
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

            {/* Rewrite Suggestions Section */}
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
                              onClick={() => apply(suggestion)}
                              className="w-full bg-[#8B2626] text-white font-mono text-[11px] uppercase tracking-wider font-bold py-2.5 hover:bg-[#731F1F] transition-colors text-center block rounded-none"
                            >
                              APPLY CHANGE
                            </button>
                            <button
                              onClick={() => dismiss(suggestion.id)}
                              className="w-full bg-white border border-[#E5E3DC] text-[#666666] font-mono text-[11px] uppercase tracking-wider font-bold py-2.5 hover:text-[#1A1A1A] hover:border-[#CCCCCC] transition-colors text-center block rounded-none"
                            >
                              IGNORE
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (isSelected) {
                                apply(suggestion);
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

          {/* Rescan Footer */}
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
      </main>
    </div>
  );
}
