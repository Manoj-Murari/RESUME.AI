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

/**
 * Upload PDF or Word binary file to backend for server-side PDF extraction & Gemini parsing
 */
export async function requestParseResumeFile(file: File): Promise<any> {
  console.log(`[FRONTEND LOG 1/3] Uploading binary file "${file.name}" to /api/upload-parse-resume...`);
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-parse-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const data = await response.json();
  console.log("[FRONTEND LOG 2/3] Backend extracted & structured PDF resume:", data);
  return data;
}

export async function requestParseResume(rawText: string): Promise<any> {
  console.log("[FRONTEND LOG 1/3] Sending raw resume text to backend /api/parse-resume...");
  const response = await fetch(`${API_BASE_URL}/parse-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const data = await response.json();
  console.log("[FRONTEND LOG 2/3] Backend returned parsed resume structure:", data);
  return data;
}

export async function requestAtsAnalysis(payload: {
  resumeText: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}): Promise<AtsAnalysisResponse> {
  console.log("[FRONTEND LOG 1/3] Sending payload to Express backend /api/analyze-ats:", payload.jobTitle);
  const response = await fetch(`${API_BASE_URL}/analyze-ats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const resData = await response.json();
  console.log("[FRONTEND LOG 2/3] Received ATS analysis response from backend:", resData);
  return resData;
}

export async function requestUpgradeAts(payload: {
  resumeData: any;
  jobDescription: string;
}): Promise<{ success: boolean; source: string; upgradedBullets: string[]; newScore: number }> {
  console.log("[FRONTEND LOG 1/3] Requesting full ATS upgrade from backend /api/upgrade-ats...");
  const response = await fetch(`${API_BASE_URL}/upgrade-ats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const data = await response.json();
  console.log("[FRONTEND LOG 2/3] Received ATS upgrade response from backend:", data);
  return data;
}
