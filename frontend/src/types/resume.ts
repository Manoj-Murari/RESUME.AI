export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  location: string;
  dates: string;
  coursework?: string[];
  gpa?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  technologies: string[];
  link: string;
  dates: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalDetails;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
}

export type TemplateId = "jake-faang" | "austere" | "modern-split" | "alex-webb" | "executive";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  previewColor: string;
}
