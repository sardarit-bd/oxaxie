import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value;
}

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  return {
    id: cookieStore.get("ID")?.value,
    role: cookieStore.get("role")?.value,
    name: cookieStore.get("name")?.value,
  };
}