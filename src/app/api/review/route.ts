import { NextRequest, NextResponse } from 'next/server';
import { reviewCode } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Code is required and must be a string' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured' },
                { status: 500 }
            );
        }

        const result = await reviewCode(code);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in code review API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to review code';
        const errorStack = error instanceof Error ? error.stack : '';
        console.error('Error stack:', errorStack);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
