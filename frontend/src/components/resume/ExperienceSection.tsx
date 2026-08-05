import React from "react";
import { ExperienceItem } from "../../types/resume";

interface Props {
  items: ExperienceItem[];
  title?: string;
  variant?: "jake" | "austere" | "modern";
  editable?: boolean;
  onUpdateBullet?: (expId: string, bulletIdx: number, val: string) => void;
  onUpdateHeader?: (expId: string, field: keyof ExperienceItem, val: string) => void;
}

export const ExperienceSection: React.FC<Props> = ({
  items,
  title = "EXPERIENCE",
  variant = "jake",
  editable = true,
  onUpdateBullet,
  onUpdateHeader,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-5">
      <h2
        className={`font-bold tracking-wider text-xs uppercase mb-2 ${
          variant === "austere"
            ? "text-[#8B2626] border-b border-[#E5E3DC] pb-1 font-mono"
            : variant === "modern"
            ? "text-blue-700 border-b-2 border-blue-600 pb-1 font-sans"
            : "text-neutral-900 border-b border-neutral-900 pb-0.5 uppercase tracking-widest font-serif"
        }`}
      >
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="group">
            {/* Header Line (Company & Role & Dates & Location) */}
            {!editable ? (
              <div className="flex justify-between items-baseline text-xs">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <span className="font-bold">{exp.company}</span>
                  <span className="text-neutral-400 font-normal">•</span>
                  <span className="italic font-medium text-neutral-800">{exp.role}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-600 shrink-0">
                  <span>{exp.dates}</span>
                  <span>|</span>
                  <span>{exp.location}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-baseline font-sans text-xs">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => onUpdateHeader?.(exp.id, "company", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 font-bold"
                  />
                  <span className="text-neutral-400 font-normal">•</span>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => onUpdateHeader?.(exp.id, "role", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 italic font-medium text-neutral-800"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-600 shrink-0">
                  <input
                    type="text"
                    value={exp.dates}
                    onChange={(e) => onUpdateHeader?.(exp.id, "dates", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 text-right"
                  />
                  <span>|</span>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => onUpdateHeader?.(exp.id, "location", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 text-right"
                  />
                </div>
              </div>
            )}

            {/* Bullets */}
            <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-[12px] text-neutral-800 leading-relaxed">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="group/bullet relative">
                  {!editable ? (
                    <span className="text-[12px] text-neutral-800 leading-relaxed block">
                      {bullet}
                    </span>
                  ) : (
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) => onUpdateBullet?.(exp.id, idx, e.target.value)}
                      readOnly={!editable}
                      className="w-full bg-transparent focus:outline-none focus:bg-neutral-50 p-0.5 text-[12px] text-neutral-800 leading-relaxed resize-none"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
