'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, full_name: fullName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-950 py-12">
      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 mb-6">
            <ClipboardCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">AttendEase</h1>
          <p className="text-slate-400 font-medium">Create your account to get started.</p>
        </div>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/50 p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name (Optional)
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                className="bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-600 h-11 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                disabled={loading}
                className="bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-600 h-11 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                className="bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-600 h-11 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={loading}
                className="bg-slate-950/50 border-slate-700/50 text-white placeholder:text-slate-600 h-11 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !username || !email || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 mt-2"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
