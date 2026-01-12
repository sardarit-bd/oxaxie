import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    
    const backendFormData = new FormData();
    backendFormData.append('issue_type', formData.get('issue_type'));
    backendFormData.append('location_city', formData.get('location_city'));
    backendFormData.append('location_state', formData.get('location_state'));
    backendFormData.append('location_country', formData.get('location_country'));
    backendFormData.append('situation_description', formData.get('situation_description'));
    backendFormData.append('status', formData.get('status'));

    const files = formData.getAll('documents[]');
    files.forEach((file, index) => {
      if (file.size > 0) {
        backendFormData.append(`documents[${index}]`, file);
      }
    });

    console.log('Sending to backend:', `${process.env.API_BASE_URL}/case`);

    const response = await fetch(
      `${process.env.API_BASE_URL}/case`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: backendFormData,
      }
    );

    const data = await response.json();
    console.log('Backend response:', response.status, data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create case", error: error.message },
      { status: 500 }
    );
  }
}