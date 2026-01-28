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

      const analysisResults = await response.json();
      setMetrics(analysisResults.metrics);
      setAlerts(analysisResults.alerts);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'An error occurred');
      console.error('Review error:', reviewError);
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
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-gray-900 font-sans">
      {/* Header */}
      <Header onReviewClick={handleReviewCode} isLoading={isLoading} />

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 lg:p-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* Left Column: Editor & Controls */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
                    Review Session
                  </h1>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    Secure your code with real-time AI security audits.
                  </p>
                </div>
                <button
                  onClick={handleReviewCode}
                  disabled={isLoading}
                  className="btn-primary group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    {isLoading ? (
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Analyze Code</span>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span>{error}</span>
              </div>
            )}

            <div className="flex-1 min-h-[500px] lg:min-h-0 bg-white rounded-3xl p-1 shadow-sm border border-gray-100">
              <CodeEditor
                code={code}
                onChange={setCode}
                isSafe={alerts.length === 0 && !isLoading && metrics.safety === 'High'}
              />
            </div>
          </section>

          {/* Right Column: AI Results */}
          <section className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
            <div className="h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <AIPanel
                metrics={metrics}
                alerts={alerts}
                alertCount={alerts.length}
                isLoading={isLoading}
                onAlertAction={handleAlertAction}
                onAlertIgnore={handleAlertIgnore}
                onGenerateReport={handleGenerateReport}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
