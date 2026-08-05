const API_BASE_URL = "http://localhost:5000/api";

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

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  return response.json();
}

export async function requestEnhanceBullet(payload: {
  bullet: string;
  jobDescription: string;
}): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/enhance-bullet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  const data = await response.json();
  return data.enhancedBullet;
}

export async function requestUpgradeAts(payload: {
  resumeData: any;
  jobDescription: string;
}): Promise<{ success: boolean; source: string; upgradedBullets: string[]; newScore: number }> {
  const response = await fetch(`${API_BASE_URL}/upgrade-ats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  return response.json();
}
