import React from "react";
import { ResumeData } from "../../types/resume";
import { ResumeHeader } from "../resume/ResumeHeader";
import { ExperienceSection } from "../resume/ExperienceSection";
import { EducationSection } from "../resume/EducationSection";
import { SkillsSection } from "../resume/SkillsSection";

interface Props {
  data: ResumeData;
  editable?: boolean;
  onUpdateData?: (newData: Partial<ResumeData>) => void;
}

export const ExecutiveTemplate: React.FC<Props> = ({
  data,
  editable = true,
  onUpdateData,
}) => {
  return (
    <div className="w-full bg-white text-neutral-900 font-serif p-12 print:p-0 shadow-sm border border-neutral-300">
      <ResumeHeader
        personal={data.personal}
        layout="centered"
        editable={editable}
      />

      {data.summary && (
        <section className="mb-6 text-center italic border-b border-neutral-300 pb-4">
          <p className="text-xs text-neutral-800 max-w-xl mx-auto leading-relaxed">
            "{data.summary}"
          </p>
        </section>
      )}

      <ExperienceSection
        items={data.experience}
        title="PROFESSIONAL EXPERIENCE"
        variant="jake"
        editable={editable}
      />

      <EducationSection
        items={data.education}
        title="EDUCATION"
        variant="jake"
        editable={editable}
      />

      <SkillsSection
        categories={data.skills}
        title="CORE COMPETENCIES"
        variant="jake"
        editable={editable}
      />
    </div>
  );
};
