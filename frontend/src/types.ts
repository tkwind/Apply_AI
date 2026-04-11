export type ApplicationStatus = 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';

export type Application = {
  _id: string;
  company: string;
  role: string;
  jobDescription: string;
  jdLink?: string;
  notes?: string;
  dateApplied: string;
  status: ApplicationStatus;
  salaryRange?: string;
  skills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
  createdAt: string;
};

export type ParsedJob = {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
};

export type ResumeSuggestion = string;
