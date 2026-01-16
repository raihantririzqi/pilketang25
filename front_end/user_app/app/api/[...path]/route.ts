import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Pastikan ini sesuai dengan port Elysia kamu
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
// Interface untuk params (Next.js 15 mengharuskan Promise, Next.js 14 bisa langsung)
type Props = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

async function proxyRequest(request: Request, { params }: Props) {
  console.log("--- PROXY INCOMING ---");
  const resolvedParams = await Promise.resolve(params);
  console.log("Target Path:", resolvedParams.path.join("/"));
  // 1. Handle params (support Next.js 15 & 14)
  const pathString = resolvedParams.path.join("/");

  // 2. Baca Token
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 3. Siapkan URL
  const url = new URL(request.url);
  const queryString = url.search; // Ambil query param (?page=1&limit=10)
  const targetUrl = `${BACKEND_URL}/${pathString}${queryString}`;
  console.log("🚀 Forwarding to:", targetUrl); // LIHAT INI DI TERMINAL
  // 4. Siapkan Headers
  const headers = new Headers();

  // A. Copy Content-Type dari request asli (PENTING untuk Upload File!)
  // Kalau JSON, dia copy application/json. Kalau Upload, dia copy multipart/form-data.
  const contentType = request.headers.get("Content-Type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // B. Inject Authorization Bearer
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    // 5. Forward Request
    // Gunakan arrayBuffer() agar aman untuk file/gambar maupun JSON
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

    const res = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store", // Jangan cache API request
    });

    // 6. Handle Response (Hati-hati, backend tidak selalu return JSON)
    const resBody = await res.arrayBuffer(); // Baca sebagai buffer mentah dulu

    // Debug: Log response jika error
    if (!res.ok) {
      const decoder = new TextDecoder();
      console.error("Backend Error Response:", decoder.decode(resBody));
    }

    // Return response apa adanya (bisa JSON, bisa file, bisa text)
    return new NextResponse(resBody, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Internal Server Error (Proxy)" }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;