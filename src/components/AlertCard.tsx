'use client';

import { FiMoreHorizontal } from 'react-icons/fi';

export type AlertType = 'security' | 'improvement' | 'performance' | 'warning';

export interface Alert {
    id: string;
    type: AlertType;
    line?: number | string;
    title: string;
    description: string;
    codeSnippet?: string;
    actionLabel?: string;
}

interface AlertCardProps {
    alert: Alert;
    onAction?: (alertId: string) => void;
    onIgnore?: (alertId: string) => void;
}

const typeConfig: Record<AlertType, { badge: string; class: string }> = {
    security: { badge: 'SECURITY', class: 'badge-security' },
    improvement: { badge: 'IMPROVEMENT', class: 'badge-improvement' },
    performance: { badge: 'PERFORMANCE', class: 'badge-performance' },
    warning: { badge: 'WARNING', class: 'badge-warning' },
};

export default function AlertCard({ alert, onAction, onIgnore }: AlertCardProps) {
    const config = typeConfig[alert.type];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group animate-fadeIn">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase ${alert.type === 'security' ? 'text-red-600 bg-red-50' :
                            alert.type === 'performance' ? 'text-green-600 bg-green-50' :
                                'text-blue-600 bg-blue-50'
                        }`}>
                        {config.badge}
                    </span>
                    {alert.line && (
                        <span className="text-[11px] text-gray-400 font-bold">Line {alert.line}</span>
                    )}
                </div>
                <button className="text-gray-300 hover:text-gray-500 transition-all">
                    <FiMoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <h4 className="font-bold text-gray-900 text-[15px] mb-2 leading-tight">{alert.title}</h4>
            <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">{alert.description}</p>

            {/* Code Snippet */}
            {alert.codeSnippet && (
                <div className="bg-blue-50/30 rounded-xl px-4 py-3 mb-5 font-mono text-[12px] text-blue-700/80 overflow-x-auto whitespace-pre border border-blue-50/50">
                    <code>{alert.codeSnippet}</code>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onAction?.(alert.id)}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                    {alert.actionLabel || 'Apply Fix'}
                </button>
                <button
                    onClick={() => onIgnore?.(alert.id)}
                    className="px-5 py-3 text-gray-400 hover:text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all bg-gray-50 hover:bg-gray-100"
                >
                    Ignore
                </button>
            </div>
        </div>
    );
}
