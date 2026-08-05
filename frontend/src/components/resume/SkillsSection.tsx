import React from "react";
import { SkillCategory } from "../../types/resume";

interface Props {
  categories: SkillCategory[];
  title?: string;
  variant?: "jake" | "austere" | "modern";
  editable?: boolean;
  onUpdateCategory?: (catId: string, categoryName: string, skills: string[]) => void;
}

export const SkillsSection: React.FC<Props> = ({
  categories,
  title = "TECHNICAL SKILLS",
  variant = "jake",
  editable = true,
  onUpdateCategory,
}) => {
  if (!categories || categories.length === 0) return null;

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

      <div className="space-y-1 text-xs text-neutral-800 leading-relaxed">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-wrap items-baseline gap-1">
            <span className="font-bold text-neutral-900 min-w-[90px]">
              {cat.category}:
            </span>
            {!editable ? (
              <span className="text-neutral-800">
                {cat.skills.join(", ")}
              </span>
            ) : (
              <input
                type="text"
                value={cat.skills.join(", ")}
                onChange={(e) =>
                  onUpdateCategory?.(
                    cat.id,
                    cat.category,
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                readOnly={!editable}
                className="flex-1 bg-transparent focus:outline-none focus:bg-neutral-50 px-1 text-xs text-neutral-800"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
