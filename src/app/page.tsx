'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import AIPanel from '@/components/AIPanel';
import { Alert } from '@/components/AlertCard';

const defaultCode = `import { config } from './config';
import axios from 'axios';

export const fetchUserData = async (userId) => {
  // Fetch user profile from the internal legacy API
  const url = \`https://api.legacy.v1/users/\${userId}?
    key=ABC-123-SECRET\`;
  const response = await axios.get(url);

  if (response.data) {
    return response.data;
  } else {
    return null;
  }
};`;

const sampleFiles = [
  { name: 'index.js', type: 'file' as const, active: true },
  { name: 'utils.js', type: 'file' as const },
  { name: 'styles.css', type: 'file' as const },
];

const sampleBranches = [
  { name: 'feat/auth-service', icon: 'branch' },
  { name: 'fix/api-headers', icon: 'branch' },
];

export default function Home() {
  const [code, setCode] = useState(defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    safety: 'Low' | 'Medium' | 'High';
    optimization: number;
    health: string;
  }>({
    safety: 'Low',
    optimization: 82,
    health: 'A+',
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const handleReviewCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to review code');
      }

      const result = await response.json();
      setMetrics(result.metrics);
      setAlerts(result.alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Review error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertAction = (alertId: string) => {
    // In a real app, this would apply the suggested fix
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleAlertIgnore = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleGenerateReport = () => {
    // In a real app, this would generate a PDF or send to email
    alert('Report generation would be implemented here!');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <Header onReviewClick={handleReviewCode} isLoading={isLoading} />

      {/* Main Content: 2-Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] overflow-hidden">

        {/* Left Column: Review Session */}
        <section className="flex flex-col border-r border-gray-100 overflow-hidden bg-white">
          <div className="p-10 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Review Session</h1>
              <button
                onClick={handleReviewCode}
                disabled={isLoading}
                className="btn-primary flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                <span className="text-[11px] uppercase tracking-[0.2em]">Analyze Code</span>
              </button>
            </div>
            <p className="text-[14px] text-gray-400 font-medium max-w-lg leading-relaxed">
              Upload your source code to perform an automated AI security audit and performance analysis in real-time.
            </p>
          </div>

          <main className="flex-1 p-10 pt-4 overflow-hidden flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[13px] font-bold animate-fadeIn flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">!</span>
                <span><strong>Error:</strong> {error}</span>
              </div>
            )}

            <div className="flex-1 min-h-0">
              <CodeEditor
                code={code}
                onChange={setCode}
                isSafe={alerts.length === 0 && !isLoading && metrics.safety === 'High'}
              />
            </div>
          </main>
        </section>

        {/* Right Column: Analysis Results */}
        <section className="overflow-hidden">
          <AIPanel
            metrics={metrics}
            alerts={alerts}
            alertCount={alerts.length}
            isLoading={isLoading}
            onAlertAction={handleAlertAction}
            onAlertIgnore={handleAlertIgnore}
            onGenerateReport={handleGenerateReport}
          />
        </section>
      </div>
    </div>
  );
}
