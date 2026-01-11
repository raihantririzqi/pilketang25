import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function proxyRequest(request: Request, { params }: { params: { path: string[] } }) {
  // 1. Baca Access Token dari Cookie (yang diset saat login tadi)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 2. Siapkan URL Backend Golang
  const path = params.path.join("/"); // misal: "users/me"
  const queryString = request.url.split("?")[1] || "";
  const url = `${BACKEND_URL}/${path}${queryString ? "?" + queryString : ""}`;

  // 3. KONVERSI: Cookie -> Header Bearer
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Backend Golang senang nerima ini!
  }

  try {
    const body = request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined;

    const res = await fetch(url, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    return NextResponse.json({ message: "Proxy Error" }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;