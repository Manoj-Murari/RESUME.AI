import React from "react";
import { ResumeData } from "../../types/resume";
import { ResumeHeader } from "../resume/ResumeHeader";
import { ExperienceSection } from "../resume/ExperienceSection";
import { EducationSection } from "../resume/EducationSection";
import { ProjectsSection } from "../resume/ProjectsSection";
import { SkillsSection } from "../resume/SkillsSection";

interface Props {
  data: ResumeData;
  editable?: boolean;
  onUpdateData?: (newData: Partial<ResumeData>) => void;
}

export const AlexWebbTemplate: React.FC<Props> = ({
  data,
  editable = true,
  onUpdateData,
}) => {
  return (
    <div className="alex-webb-template w-full bg-white text-emerald-950 p-10 print:p-0 shadow-sm border border-emerald-100">
      <ResumeHeader
        personal={data.personal}
        layout="left"
        editable={editable}
      />

      <ExperienceSection
        items={data.experience}
        title="EXPERIENCE & ACHIEVEMENTS"
        variant="modern"
        editable={editable}
      />

      <ProjectsSection
        items={data.projects}
        title="FEATURED PROJECTS"
        variant="modern"
        editable={editable}
      />

      <EducationSection
        items={data.education}
        title="EDUCATION & DEGREES"
        variant="modern"
        editable={editable}
      />

      <SkillsSection
        categories={data.skills}
        title="SKILLS & TECHNOLOGIES"
        variant="modern"
        editable={editable}
      />
    </div>
  );
};
