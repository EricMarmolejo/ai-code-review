'use client';

import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import { FiCheck, FiSettings, FiChevronRight } from 'react-icons/fi';

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    language?: string;
    fileName?: string;
    filePath?: string[];
    isSafe?: boolean;
}

const detectLanguage = (code: string): string => {
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('import react') || lowerCode.includes('export default function')) return 'typescript';
    if (lowerCode.includes('import ') || lowerCode.includes('const ') || lowerCode.includes('let ')) return 'javascript';
    if (lowerCode.includes('def ') || lowerCode.includes('import pandas') || lowerCode.includes('print(')) return 'python';
    if (lowerCode.includes('public class ') || lowerCode.includes('System.out.println')) return 'java';
    if (lowerCode.includes('#include <') || lowerCode.includes('std::cout')) return 'cpp';
    if (lowerCode.includes('package main') || lowerCode.includes('func ')) return 'go';
    if (lowerCode.includes('fn main()') || lowerCode.includes('let mut ')) return 'rust';
    if (lowerCode.includes('<?php')) return 'php';
    return 'javascript';
};

export default function CodeEditor({
    code,
    onChange,
    isSafe = false,
}: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const [language, setLanguage] = useState('javascript');
    const [highlightedCode, setHighlightedCode] = useState(code);

    useEffect(() => {
        const detected = detectLanguage(code);
        setLanguage(detected);
        const highlighted = Prism.highlight(code, Prism.languages[detected] || Prism.languages.javascript, detected);
        setHighlightedCode(highlighted);
    }, [code]);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const lines = code.split('\n');

    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-lg">index.js</span>
                    {isSafe ? (
                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Safe to Deploy
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Vulnerabilities Found
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                        <span className="text-[10px] text-gray-400 uppercase mr-1">Detected:</span>
                        {language.toUpperCase()}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FiSettings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 relative overflow-hidden font-mono text-[14px] leading-relaxed">
                <div className="absolute inset-0 flex">
                    {/* Line Numbers */}
                    <div className="flex-shrink-0 py-6 px-4 text-right select-none border-r border-gray-50 bg-white min-w-[3.5rem]">
                        {lines.map((_, index) => (
                            <div key={index} className="text-gray-300">
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 relative overflow-hidden">
                        {/* Highlights (Background) */}
                        <pre
                            ref={preRef}
                            className="absolute inset-0 py-6 px-8 m-0 pointer-events-none whitespace-pre text-gray-900"
                            aria-hidden="true"
                            suppressHydrationWarning
                        >
                            <code
                                className={`language-${language}`}
                                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                                suppressHydrationWarning
                            />
                        </pre>

                        {/* Interactive Textarea (Foreground) */}
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => onChange(e.target.value)}
                            onScroll={handleScroll}
                            className="absolute inset-0 py-6 px-8 w-full h-full resize-none bg-transparent text-transparent caret-blue-500 outline-none whitespace-pre overflow-auto"
                            spellCheck="false"
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
