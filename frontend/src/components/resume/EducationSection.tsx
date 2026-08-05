import React from "react";
import { EducationItem } from "../../types/resume";

interface Props {
  items: EducationItem[];
  title?: string;
  variant?: "jake" | "austere" | "modern";
  editable?: boolean;
  onUpdate?: (eduId: string, field: keyof EducationItem, val: any) => void;
}

export const EducationSection: React.FC<Props> = ({
  items,
  title = "EDUCATION",
  variant = "jake",
  editable = true,
  onUpdate,
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

      <div className="space-y-3">
        {items.map((edu) => (
          <div key={edu.id}>
            {!editable ? (
              <div className="flex justify-between items-baseline text-xs">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <span className="font-bold">{edu.institution}</span>
                  <span className="text-neutral-400 font-normal">•</span>
                  <span className="italic font-medium text-neutral-800">{edu.degree}</span>
                </div>
                <div className="text-[11px] text-neutral-600 shrink-0">
                  {edu.dates}
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-baseline text-xs font-sans">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => onUpdate?.(edu.id, "institution", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 font-bold"
                  />
                  <span className="text-neutral-400 font-normal">•</span>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => onUpdate?.(edu.id, "degree", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 italic font-medium text-neutral-800"
                  />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-600 shrink-0">
                  <input
                    type="text"
                    value={edu.dates}
                    onChange={(e) => onUpdate?.(edu.id, "dates", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 text-right"
                  />
                </div>
              </div>
            )}

            {edu.coursework && edu.coursework.length > 0 && (
              <div className="mt-1 text-[11px] text-neutral-700 leading-normal">
                <span className="font-semibold text-neutral-900">Relevant Coursework: </span>
                {edu.coursework.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
