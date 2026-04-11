import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthForm from './components/AuthForm';
import Board from './components/Board';
import JobDescriptionParser from './components/JobDescriptionParser';
import LoadingSpinner from './components/LoadingSpinner';
import { login, register } from './api/auth';
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  parseJobDescription,
  updateApplication,
} from './api/applications';
import { Application, ApplicationStatus, ParsedJob } from './types';
import { useAuth } from './hooks/useAuth';

const statuses: ApplicationStatus[] = ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];

const initialDraft: Partial<Application> = {
  company: '',
  role: '',
  jobDescription: '',
  jdLink: '',
  notes: '',
  dateApplied: new Date().toISOString().slice(0, 10),
  status: 'Applied',
  salaryRange: '',
  skills: [],
  niceToHave: [],
  seniority: '',
  location: '',
};

const App = () => {
  const { token, saveToken, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | undefined>();
  const [authLoading, setAuthLoading] = useState(false);
  const [draft, setDraft] = useState<Partial<Application>>(initialDraft);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [, setParseLoading] = useState(false);

  const queryClient = useQueryClient();

  const applicationsQuery = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    enabled: !!token,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setDraft(initialDraft);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Application> }) => updateApplication(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setSelectedApp(null);
    },
  });

  const handleAuthSubmit = async (email: string, password: string) => {
    setAuthError(undefined);
    setAuthLoading(true);
    try {
      const data = authMode === 'login' ? await login(email, password) : await register(email, password);
      saveToken(data.token);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Authentication failed';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleParse = async (jobDescription: string) => {
    setParseError(null);
    setParseLoading(true);
    try {
      const result = await parseJobDescription(jobDescription);
      const parsed: ParsedJob = result.parsed;
      setDraft((prev) => ({
        ...prev,
        company: parsed.company || prev.company,
        role: parsed.role || prev.role,
        location: parsed.location || prev.location,
        seniority: parsed.seniority || prev.seniority,
        skills: parsed.requiredSkills || prev.skills,
        niceToHave: parsed.niceToHave || prev.niceToHave,
        jobDescription,
        dateApplied: prev.dateApplied || new Date().toISOString().slice(0, 10),
      }));
      return result;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to parse job description';
      setParseError(message);
      throw error;
    } finally {
      setParseLoading(false);
    }
  };

  const handleCreateApplication = async () => {
    await createMutation.mutateAsync({
      ...draft,
      company: draft.company || 'Unknown company',
      role: draft.role || 'Unknown role',
      jobDescription: draft.jobDescription || '',
      dateApplied: draft.dateApplied || new Date().toISOString().slice(0, 10),
      status: draft.status || 'Applied',
      skills: draft.skills || [],
      niceToHave: draft.niceToHave || [],
      seniority: draft.seniority || '',
      location: draft.location || '',
    });
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateMutation.mutateAsync({ id, payload: { status } });
  };

  const handleSelectSuggestion = (text: string) => {
    setDraft((prev) => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n- ${text}` : `- ${text}`,
    }));
  };

  const applications = applicationsQuery.data ?? [];

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-12">
        <AuthForm mode={authMode} onModeChange={setAuthMode} onSubmit={handleAuthSubmit} error={authError} loading={authLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">AI Job Application Tracker</p>
            <h1 className="text-3xl font-semibold text-slate-900">Your applications board</h1>
          </div>
          <button onClick={logout} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Sign out
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Create an application</h2>
                  <p className="text-sm text-slate-500">Use the AI parser to fill fields faster.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateApplication}
                  disabled={createMutation.isPending}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createMutation.isPending ? 'Saving…' : 'Save application'}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm text-slate-600">
                  Company
                  <input
                    value={draft.company ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, company: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  Role
                  <input
                    value={draft.role ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, role: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  Date applied
                  <input
                    type="date"
                    value={draft.dateApplied ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, dateApplied: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  Status
                  <select
                    value={draft.status ?? 'Applied'}
                    onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as ApplicationStatus }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 text-sm text-slate-600 sm:col-span-2">
                  Job description
                  <textarea
                    rows={4}
                    value={draft.jobDescription ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, jobDescription: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600 sm:col-span-2">
                  Notes
                  <textarea
                    rows={3}
                    value={draft.notes ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  Location
                  <input
                    value={draft.location ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, location: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600">
                  Seniority
                  <input
                    value={draft.seniority ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, seniority: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
                <label className="block space-y-2 text-sm text-slate-600 sm:col-span-2">
                  Salary range
                  <input
                    value={draft.salaryRange ?? ''}
                    onChange={(event) => setDraft((prev) => ({ ...prev, salaryRange: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
                  />
                </label>
              </div>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <JobDescriptionParser onParse={handleParse} onSelectSuggestion={handleSelectSuggestion} />
              {parseError ? <p className="mt-4 text-sm text-red-600">{parseError}</p> : null}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Board stats</h2>
                  <p className="text-sm text-slate-500">Drag cards across columns to update status.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {applications.length} cards
                </span>
              </div>
              <div className="grid gap-3">
                {statuses.map((status) => (
                  <div key={status} className="rounded-3xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span>{status}</span>
                      <strong>{applications.filter((app) => app.status === status).length}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {selectedApp ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Application details</h2>
                  <button onClick={() => setSelectedApp(null)} className="text-sm font-semibold text-slate-500 underline">
                    Close
                  </button>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-900">Company:</span> {selectedApp.company}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Role:</span> {selectedApp.role}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Status:</span> {selectedApp.status}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Applied:</span> {new Date(selectedApp.dateApplied).toLocaleDateString()}
                  </p>
                  {selectedApp.notes ? <p className="whitespace-pre-line">{selectedApp.notes}</p> : null}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => selectedApp && deleteMutation.mutate(selectedApp._id)}
                    className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Delete card
                  </button>
                </div>
              </section>
            ) : null}
          </aside>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Kanban board</h2>
              <p className="text-sm text-slate-500">Drag card titles into another column to move them.</p>
            </div>
            {applicationsQuery.isFetching ? <div className="text-sm text-slate-500">Refreshing…</div> : null}
          </div>
          {applicationsQuery.isLoading ? (
            <LoadingSpinner />
          ) : (
            <Board applications={applications} onStatusChange={handleStatusChange} onSelect={setSelectedApp} />
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
