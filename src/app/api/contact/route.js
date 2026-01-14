import { NextResponse } from 'next/server';

const laravelUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET() {
    try {
        const res = await fetch(`${laravelUrl}/contact-info`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            return NextResponse.json(null, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Proxy GET Error:', error);
        return NextResponse.json(null, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

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