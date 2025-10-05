import { NextRequest, NextResponse } from 'next/server';
import { gemini } from '@/lib/supbase/client';

export async function GET() {
    try {
        // Test only the specified model
        const testModels = [
            'gemini-2.5-flash'
        ];

        const results = [];

        for (const modelName of testModels) {
            try {
                const model = gemini.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Test message');
                const response = await result.response;

                results.push({
                    modelName,
                    status: 'success',
                    response: response.text().substring(0, 50) + '...'
                });

                // If we find a working model, break
                break;
            } catch (error: unknown) {
                results.push({
                    modelName,
                    status: 'error',
                    error: error instanceof Error ? error.message.substring(0, 200) : 'Unknown error'
                });
            }
        }

        return NextResponse.json({
            success: results.some(r => r.status === 'success'),
            testResults: results
        });
    } catch (error) {
        console.error('Error in list-models endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check models'
            },
            { status: 500 }
        );
    }
}
