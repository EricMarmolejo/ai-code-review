'use client';

import { FiCpu, FiAlertCircle } from 'react-icons/fi';
import AlertCard, { Alert } from './AlertCard';

interface Metrics {
    safety: 'Low' | 'Medium' | 'High';
    optimization: number;
    health: string;
}

interface AIPanelProps {
    metrics: Metrics;
    alerts: Alert[];
    alertCount: number;
    isLoading?: boolean;
    onAlertAction?: (alertId: string) => void;
    onAlertIgnore?: (alertId: string) => void;
    onGenerateReport?: () => void;
}

const getSafetyClass = (safety: string) => {
    switch (safety) {
        case 'Low': return 'text-red-500';
        case 'Medium': return 'text-orange-500';
        case 'High': return 'text-green-500';
        default: return 'text-gray-900';
    }
};

const getOptimClass = (optim: number) => {
    if (optim >= 80) return 'text-blue-500';
    if (optim >= 50) return 'text-orange-500';
    return 'text-red-500';
};

export default function AIPanel({
    metrics,
    alerts,
    alertCount,
    isLoading,
    onAlertAction,
    onAlertIgnore,
    onGenerateReport,
}: AIPanelProps) {
    return (
        <aside className="h-full bg-[#fcfdfe] border-l border-gray-100 flex flex-col pt-6 relative">
            {/* Header */}
            <div className="px-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                            <FiCpu className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Intelligence</h2>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 shadow-sm">
                        {alertCount} ALERTS
                    </span>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="px-6 mb-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Safety</div>
                        <div className={`text-xl font-black ${getSafetyClass(metrics.safety)}`}>
                            {metrics.safety}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Optim.</div>
                        <div className={`text-xl font-black ${getOptimClass(metrics.optimization)}`}>
                            {metrics.optimization}%
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Health</div>
                        <div className="text-xl font-black text-green-500">{metrics.health}</div>
                    </div>
                </div>
            </div>

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[13px] font-bold tracking-widest uppercase">Analyzing Code Session...</p>
                    </div>
                ) : alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onAction={onAlertAction}
                            onIgnore={onAlertIgnore}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <FiAlertCircle className="w-12 h-12 mb-4 text-gray-200" />
                        <p className="text-sm font-bold text-gray-700">No alerts found</p>
                        <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest">
                            Ready for analysis
                        </p>
                    </div>
                )}
            </div>

            {/* Generate Report Button - Styled to match screenshot footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fcfdfe] to-transparent">
                <button
                    onClick={onGenerateReport}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[11px] uppercase tracking-[0.2em]">Generate Executive Report</span>
                </button>
            </div>
        </aside>
    );
}
