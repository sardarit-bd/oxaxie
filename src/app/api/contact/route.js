import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const laravelUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

        const res = await fetch(`${laravelUrl}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}