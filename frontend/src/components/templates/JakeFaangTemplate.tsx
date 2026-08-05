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

export const JakeFaangTemplate: React.FC<Props> = ({
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

  const handleUpdateProjectBullet = (projId: string, bulletIdx: number, val: string) => {
    if (onUpdateData) {
      const updatedProj = data.projects.map((proj) => {
        if (proj.id === projId) {
          const newBullets = [...proj.bullets];
          newBullets[bulletIdx] = val;
          return { ...proj, bullets: newBullets };
        }
        return proj;
      });
      onUpdateData({ projects: updatedProj });
    }
  };

  return (
    <div className="jake-template w-full bg-white text-black p-10 print:p-0 shadow-sm border border-neutral-200">
      <ResumeHeader
        personal={data.personal}
        layout="centered"
        editable={editable}
        onUpdate={handleUpdateHeader}
      />

      <EducationSection
        items={data.education}
        title="EDUCATION"
        variant="jake"
        editable={editable}
      />

      <ExperienceSection
        items={data.experience}
        title="EXPERIENCE"
        variant="jake"
        editable={editable}
        onUpdateBullet={handleUpdateExperienceBullet}
      />

      <ProjectsSection
        items={data.projects}
        title="PROJECTS"
        variant="jake"
        editable={editable}
        onUpdateBullet={handleUpdateProjectBullet}
      />

      <SkillsSection
        categories={data.skills}
        title="TECHNICAL SKILLS"
        variant="jake"
        editable={editable}
      />
    </div>
  );
};
