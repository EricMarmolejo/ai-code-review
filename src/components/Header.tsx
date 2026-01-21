'use client';

import { FiSearch, FiPlay, FiBell, FiTerminal } from 'react-icons/fi';

interface HeaderProps {
    onReviewClick: () => void;
    isLoading?: boolean;
}

export default function Header({ onReviewClick, isLoading }: HeaderProps) {
    return (
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 z-10">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <FiTerminal className="w-4 h-4" />
                    </div>
                    <span className="font-black text-gray-900 tracking-tighter text-xl">CODE<span className="text-blue-500">SENSE</span></span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200 mx-2" />
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    SYSTEM ONLINE
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 tracking-widest uppercase">
                    v2.5.0 <span className="text-gray-200">|</span> STABLE
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                        <FiBell className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs ring-4 ring-gray-50">
                        JD
                    </div>
                </div>
            </div>
        </header>
    );
}
