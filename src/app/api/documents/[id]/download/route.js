import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;
    const { id } = await params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';

    // Forward request to Laravel backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/${id}/download?format=${format}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Get the blob data
    const blob = await response.blob();
    
    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `document.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Return the file with proper headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 
          (format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to download document' },
      { status: 500 }
    );
  }
}