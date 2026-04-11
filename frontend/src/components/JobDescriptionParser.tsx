import { useState } from 'react';
import { ParsedJob, ResumeSuggestion } from '../types';

type Props = {
  onParse: (jobDescription: string) => Promise<{ parsed: ParsedJob; suggestions: ResumeSuggestion[] }>;
  onSelectSuggestion: (text: string) => void;
};

const JobDescriptionParser = ({ onParse, onSelectSuggestion }: Props) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedJob | null>(null);
  const [suggestions, setSuggestions] = useState<ResumeSuggestion[]>([]);

  const handleParse = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await onParse(jobDescription);
      setParsed(result.parsed);
      setSuggestions(result.suggestions);
    } catch (err) {
      setError((err as Error).message || 'Unable to parse job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Parse Job Description</h2>
        <p className="text-sm text-slate-500">Paste a JD and let the AI extract role details and resume bullets.</p>
      </div>
      <textarea
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        rows={10}
        placeholder="Paste the full job description here"
        className="w-full rounded-3xl border border-slate-300 p-4 text-sm outline-none focus:border-slate-600"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading || !jobDescription.trim()}
          onClick={handleParse}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Parsing…' : 'Parse JD'}
        </button>
        <span className="text-sm text-slate-500">Drag or paste a job description to get started.</span>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {parsed ? (
        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-500">Company</p>
              <p className="text-sm font-semibold text-slate-900">{parsed.company || 'Not found'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Role</p>
              <p className="text-sm font-semibold text-slate-900">{parsed.role || 'Not found'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Location</p>
              <p className="text-sm font-semibold text-slate-900">{parsed.location || 'Not found'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Seniority</p>
              <p className="text-sm font-semibold text-slate-900">{parsed.seniority || 'Not found'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Required Skills</p>
            <p className="mt-2 text-sm text-slate-700">{parsed.requiredSkills.join(', ') || 'None detected'}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Nice to Have</p>
            <p className="mt-2 text-sm text-slate-700">{parsed.niceToHave.join(', ') || 'None detected'}</p>
          </div>
        </div>
      ) : null}
      {suggestions.length > 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-slate-900">Resume Suggestions</div>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-700">{suggestion}</p>
                <button
                  type="button"
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="mt-3 text-sm font-semibold text-slate-900 underline"
                >
                  Copy suggestion to notes
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default JobDescriptionParser;
