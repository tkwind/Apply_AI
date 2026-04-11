import { useState } from 'react';

type AuthMode = 'login' | 'register';

type Props = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
  loading: boolean;
};

const AuthForm = ({ mode, onModeChange, onSubmit, error, loading }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">AI Job Tracker</h1>
        <p className="text-slate-500">{mode === 'login' ? 'Log in to manage your applications' : 'Create an account and start tracking'}</p>
      </div>
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-600"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          disabled={loading}
          onClick={() => onSubmit(email.trim(), password)}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <button onClick={() => onModeChange('register')} className="font-semibold text-slate-900 underline">
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => onModeChange('login')} className="font-semibold text-slate-900 underline">
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
