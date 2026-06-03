'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Task Manager</h1>
        <p className="text-slate-400 mb-8">Redirecting...</p>
      </div>
    </div>
  );
}

