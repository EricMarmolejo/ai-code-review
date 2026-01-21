import { GoogleGenerativeAI } from '@google/generative-ai';
import { Alert, AlertType } from '@/components/AlertCard';

export interface CodeReviewResult {
    metrics: {
        safety: 'Low' | 'Medium' | 'High';
        optimization: number;
        health: string;
    };
    alerts: Alert[];
}

const REVIEW_PROMPT = `You are an expert code reviewer. Analyze the following code and provide a detailed security, performance, and code quality review.

Return your analysis in the following JSON format ONLY (no markdown, no code blocks, just valid JSON):
{
  "metrics": {
    "safety": "Low" | "Medium" | "High",
    "optimization": <number 0-100>,
    "health": "A+" | "A" | "B" | "C" | "D" | "F"
  },
  "alerts": [
    {
      "id": "<unique-id>",
      "type": "security" | "improvement" | "performance" | "warning",
      "line": <line number or "Global">,
      "title": "<short title>",
      "description": "<detailed description of the issue and how to fix it>",
      "codeSnippet": "<optional code suggestion>",
      "actionLabel": "<button label like 'Apply Secure Fix' or 'Refactor' or 'Optimize'>"
    }
  ]
}

Guidelines for analysis:
1. SECURITY: Look for hardcoded secrets, SQL injection, XSS vulnerabilities, insecure dependencies, etc.
2. IMPROVEMENT: Suggest better patterns, cleaner code, optional chaining, null safety, etc.
3. PERFORMANCE: Identify caching opportunities, unnecessary computations, memory leaks, etc.
4. WARNING: Flag deprecated APIs, potential runtime errors, missing error handling, etc.

Be thorough but practical. Limit to the top 5 most important issues. If the code is perfect, return an empty alerts array.

CODE TO REVIEW:
`;

export async function reviewCode(code: string): Promise<CodeReviewResult> {
    try {
        // Initialize client inside function to ensure env var is available
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent(REVIEW_PROMPT + code);
        const response = await result.response;
        const text = response.text();

        // Clean up the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        const parsed = JSON.parse(cleanedText) as CodeReviewResult;

        // Validate and sanitize the response
        return {
            metrics: {
                safety: parsed.metrics?.safety || 'Medium',
                optimization: Math.min(100, Math.max(0, parsed.metrics?.optimization || 50)),
                health: parsed.metrics?.health || 'B',
            },
            alerts: (parsed.alerts || []).map((alert: Alert, index: number) => ({
                id: alert.id || `alert-${index}`,
                type: (['security', 'improvement', 'performance', 'warning'].includes(alert.type)
                    ? alert.type
                    : 'improvement') as AlertType,
                line: alert.line,
                title: alert.title || 'Untitled Alert',
                description: alert.description || 'No description provided',
                codeSnippet: alert.codeSnippet,
                actionLabel: alert.actionLabel || 'Apply Fix',
            })),
        };
    } catch (error) {
        console.error('Error reviewing code:', error);
        const actualMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Gemini API Error: ${actualMessage}`);
    }
}
