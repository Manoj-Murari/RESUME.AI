import React from "react";
import { ProjectItem } from "../../types/resume";

interface Props {
  items: ProjectItem[];
  title?: string;
  variant?: "jake" | "austere" | "modern";
  editable?: boolean;
  onUpdateBullet?: (projId: string, bulletIdx: number, val: string) => void;
  onUpdateHeader?: (projId: string, field: keyof ProjectItem, val: any) => void;
}

export const ProjectsSection: React.FC<Props> = ({
  items,
  title = "PROJECTS",
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
        {items.map((proj) => (
          <div key={proj.id}>
            {!editable ? (
              <div className="flex justify-between items-baseline text-xs">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <span className="font-bold">{proj.title}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-neutral-600 font-normal italic">
                      | {proj.technologies.join(", ")}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-600 shrink-0">
                  {proj.dates}
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-baseline text-xs font-sans">
                <div className="flex items-center gap-1.5 flex-wrap font-bold text-neutral-900">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => onUpdateHeader?.(proj.id, "title", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 font-bold"
                  />
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-neutral-600 font-normal italic">
                      | {proj.technologies.join(", ")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-600 shrink-0">
                  <input
                    type="text"
                    value={proj.dates}
                    onChange={(e) => onUpdateHeader?.(proj.id, "dates", e.target.value)}
                    readOnly={!editable}
                    className="bg-transparent focus:outline-none focus:bg-neutral-50 px-0.5 text-right"
                  />
                </div>
              </div>
            )}

            <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-[12px] text-neutral-800 leading-relaxed">
              {proj.bullets.map((bullet, idx) => (
                <li key={idx}>
                  {!editable ? (
                    <span className="text-[12px] text-neutral-800 leading-relaxed block">
                      {bullet}
                    </span>
                  ) : (
                    <textarea
                      rows={2}
                      value={bullet}
                      onChange={(e) => onUpdateBullet?.(proj.id, idx, e.target.value)}
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
