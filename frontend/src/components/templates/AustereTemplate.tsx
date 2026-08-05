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

export const AustereTemplate: React.FC<Props> = ({
  data,
  editable = true,
  onUpdateData,
}) => {
  const handleUpdateHeader = (field: any, val: string) => {
    if (onUpdateData) {
      onUpdateData({
        personal: { ...data.personal, [field]: val },
      });
    }
  };

  const handleUpdateExperienceBullet = (expId: string, bulletIdx: number, val: string) => {
    if (onUpdateData) {
      const updatedExp = data.experience.map((exp) => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIdx] = val;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      });
      onUpdateData({ experience: updatedExp });
    }
  };

  return (
    <div className="w-full bg-white text-[#1A1A1A] font-sans p-12 print:p-0 shadow-sm border border-[#E5E3DC]">
      <ResumeHeader
        personal={data.personal}
        layout="left"
        editable={editable}
        onUpdate={handleUpdateHeader}
      />

      {data.summary && (
        <section className="mb-6">
          <h2 className="font-mono text-[10px] tracking-widest font-bold uppercase text-[#8B2626] mb-2 pb-1 border-b border-[#E5E3DC]">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-[13px] text-[#333333] leading-relaxed italic">
            {data.summary}
          </p>
        </section>
      )}

      <ExperienceSection
        items={data.experience}
        title="PROFESSIONAL EXPERIENCE"
        variant="austere"
        editable={editable}
        onUpdateBullet={handleUpdateExperienceBullet}
      />

      <EducationSection
        items={data.education}
        title="EDUCATION & CREDENTIALS"
        variant="austere"
        editable={editable}
      />

      <ProjectsSection
        items={data.projects}
        title="KEY PROJECTS"
        variant="austere"
        editable={editable}
      />

      <SkillsSection
        categories={data.skills}
        title="CORE COMPETENCIES & TECH STACK"
        variant="austere"
        editable={editable}
      />
    </div>
  );
};
