import api from './axios';
import { Application, ParsedJob, ResumeSuggestion } from '../types';

export const fetchApplications = async () => {
  const response = await api.get('/applications');
  return response.data.applications as Application[];
};

export const createApplication = async (payload: Partial<Application>) => {
  const response = await api.post('/applications', payload);
  return response.data.application as Application;
};

export const updateApplication = async (id: string, payload: Partial<Application>) => {
  const response = await api.put(`/applications/${id}`, payload);
  return response.data.application as Application;
};

export const deleteApplication = async (id: string) => {
  await api.delete(`/applications/${id}`);
};

export const parseJobDescription = async (jobDescription: string) => {
  const response = await api.post('/applications/parse', { jobDescription });
  return response.data as { parsed: ParsedJob; suggestions: ResumeSuggestion[] };
};
