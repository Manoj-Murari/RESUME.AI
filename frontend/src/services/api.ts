const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface AtsAnalysisResponse {
  success: boolean;
  source: string;
  score: number;
  gaps: { label: string; missing: boolean }[];
  suggestions: {
    id: string;
    title: string;
    rationale: string;
    rewrite: string;
    targetBulletId: string;
    priority: boolean;
  }[];
}

/** Upload a PDF or Word file to the backend for text extraction and AI parsing */
export async function requestParseResumeFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-parse-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  return response.json();
}

/** Send pasted resume text to the backend for AI parsing */
export async function requestParseResume(rawText: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/parse-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  return response.json();
}

/** Run ATS keyword gap analysis against a target job description */
export async function requestAtsAnalysis(payload: {
  resumeText: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}): Promise<AtsAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze-ats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Server error ${response.status}`);
  return response.json();
}
