import React from "react";
import { ResumeData } from "../../types/resume";

interface Props {
  data: ResumeData;
  editable?: boolean;
  onUpdateData?: (newData: Partial<ResumeData>) => void;
}

export const ModernSplitTemplate: React.FC<Props> = ({
  data,
  editable = true,
  onUpdateData,
}) => {
  return (
    <div className="w-full bg-white text-neutral-900 font-sans shadow-sm border border-neutral-200 grid grid-cols-12 min-h-[900px]">
      {/* Left Sidebar (35% width) */}
      <aside className="col-span-4 bg-slate-900 text-slate-100 p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {data.personal.fullName}
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-6">
            {data.personal.jobTitle}
          </p>

          {/* Contact Details */}
          <div className="space-y-3 mb-8 text-xs font-mono text-slate-300 border-b border-slate-800 pb-6">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Email</span>
              {data.personal.email}
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Phone</span>
              {data.personal.phone}
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Location</span>
              {data.personal.location}
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Links</span>
              {data.personal.github}
              <br />
              {data.personal.linkedin}
            </div>
          </div>

          {/* Skills Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 font-mono">
              CORE SKILLS
            </h3>
            <div className="space-y-3">
              {data.skills.map((cat) => (
                <div key={cat.id}>
                  <span className="text-[11px] font-bold text-slate-200 block">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded-none font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (65% width) */}
      <main className="col-span-8 p-10 space-y-6">
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-neutral-200 pb-1 font-mono">
              PROFILE SUMMARY
            </h2>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 border-b border-neutral-200 pb-1 font-mono">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-neutral-900">
                  <span>{exp.role} — <span className="font-semibold text-neutral-700">{exp.company}</span></span>
                  <span className="text-[10px] font-mono text-neutral-500">{exp.dates}</span>
                </div>
                <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-[12px] text-neutral-700 leading-relaxed">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-neutral-200 pb-1 font-mono">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-xs">
              <span className="font-bold text-neutral-900">{edu.institution} — <span className="font-normal italic">{edu.degree}</span></span>
              <span className="text-[10px] font-mono text-neutral-500">{edu.dates}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
