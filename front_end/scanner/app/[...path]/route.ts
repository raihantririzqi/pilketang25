import { NextResponse } from "next/server";

// Konfigurasi dari .env
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const SCANNER_SECRET = process.env.SCANNER_SECRET || "";

type Props = {
  params: Promise<{ path: string[] }> | { path: string[] };
};

async function proxyRequest(request: Request, { params }: Props) {
  // 1. Ambil path dari URL Next.js
  const resolvedParams = await Promise.resolve(params);
  const pathString = resolvedParams.path.join("/");

  // 2. Buang prefix 'api/' agar sinkron dengan route Elysia kamu
  const cleanPath = pathString.replace(/^api\//, "");

  // 3. Susun URL Target ke Backend
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${cleanPath}${url.search}`;

  console.log("--- 🖥️ KIOSK PROXY ACTIVE ---");
  console.log(`📡 Inbound: /${pathString}`);
  console.log(`🚀 Forwarding: ${targetUrl}`);

  // 4. Siapkan Headers Khusus Scanner
  const headers = new Headers();

  // A. Copy Content-Type asli (Penting untuk JSON body)
  const contentType = request.headers.get("Content-Type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // B. SUNTIKKAN SECRET SCANNER (Wajib untuk lolos Middleware Backend)
  // Kita tidak pakai Authorization Bearer di sini karena ini mode Kiosk
  if (SCANNER_SECRET) {
    headers.set("X-Scanner-Secret", SCANNER_SECRET);
    console.log("🛡️  X-Scanner-Secret Injected [OK]");
  } else {
    console.warn("⚠️  WARNING: SCANNER_SECRET is empty in .env!");
  }

  try {
    // 5. Ambil Body Request (untuk POST/PUT)
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

    // 6. Tembak ke Backend Elysia
    const res = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      cache: "no-store",
    });

    const resBody = await res.arrayBuffer();

    // Log jika terjadi error di sisi backend
    if (!res.ok) {
      const decoder = new TextDecoder();
      // Clone body atau decode arrayBuffer yang sudah diambil
      console.error(`❌ Backend Rejected (${res.status}):`, decoder.decode(resBody));
    }

    // 7. Kembalikan Response ke Scanner/Frontend
    return new NextResponse(resBody, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });

  } catch (error) {
    console.error("🔥 Proxy Fatal Error:", error);
    return NextResponse.json(
      { message: "Kiosk Connection Failed", error: String(error) },
      { status: 500 }
    );
  }
}

// Support semua method yang dibutuhkan scanner (terutama POST)
export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;