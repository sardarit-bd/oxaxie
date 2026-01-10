import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import FormData from "form-data";

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

    let filesAppended = 0;
    let index = 0;
    
    while (true) {
      const file = formData.get(`documents[${index}]`);
      if (!file) break;
      
      if (file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        backendFormData.append(`documents[${index}]`, buffer, {
          filename: file.name,
          contentType: file.type,
        });
        filesAppended++;
      }
      index++;
    }

    console.log(`Total files appended: ${filesAppended}`);
    console.log('Sending to backend:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/case`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/case`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          ...backendFormData.getHeaders(),
        },
        body: backendFormData.getBuffer(),
      }
    );

    const data = await response.json();
    console.log('Backend response:', response.status, data);

    if (!response.ok && data.errors?.upgrade_required) {
      console.log('Transforming upgrade error response');
      return NextResponse.json({
        success: false,
        message: data.message,
        data: {
          upgrade_required: data.errors.upgrade_required,
          current_plan: data.errors.current_plan,
          upgrade_to: data.errors.upgrade_to,
          limit_details: data.errors.limit_details
        }
      }, { status: response.status });
    }


    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create case", error: error.message },
      { status: 500 }
    );
  }
}