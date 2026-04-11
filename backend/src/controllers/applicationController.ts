import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createApplication, deleteApplication, listApplications, updateApplication } from '../services/applicationService';
import { generateResumeSuggestions, parseJobDescription } from '../services/aiService';

export const getApplications = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const applications = await listApplications(userId);
  res.json({ applications });
};

export const createNewApplication = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const payload = req.body;
  if (!payload.company || !payload.role || !payload.dateApplied || !payload.jobDescription) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }
  const application = await createApplication({ ...payload, userId });
  res.status(201).json({ application });
};

export const editApplication = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const payload = req.body;
  try {
    const application = await updateApplication(id, userId, payload);
    res.json({ application });
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const removeApplication = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  try {
    await deleteApplication(id, userId);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const parseDescription = async (req: AuthRequest, res: Response) => {
  const { jobDescription } = req.body as { jobDescription: string };
  if (!jobDescription) {
    return res.status(400).json({ message: 'Job description is required' });
  }
  try {
    const parsed = await parseJobDescription(jobDescription);
    const suggestions = await generateResumeSuggestions(jobDescription);
    res.json({ parsed, suggestions });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
