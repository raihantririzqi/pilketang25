import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

/**
 * Fungsi untuk memanggil endpoint refresh di backend
 */
async function tryRefreshToken(originalRequest: Request): Promise<{ accessToken: string | null; setCookieHeader: string | null }> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString(); // Ambil semua cookie untuk diteruskan

    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": allCookies, // Kirim refresh_token_cookie ke backend
      },
    });

    if (!res.ok) return { accessToken: null, setCookieHeader: null };

    const data = await res.json();
    const setCookie = res.headers.get("set-cookie"); // Ambil cookie baru jika ada

    return {
      accessToken: data.result?.access_token || null,
      setCookieHeader: setCookie
    };
  } catch (err) {
    return { accessToken: null, setCookieHeader: null };
  }
}

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${pathString}${url.search}`;

  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  const getHeaders = (tokenStr?: string) => {
    const h = new Headers();
    const contentType = request.headers.get("Content-Type");
    if (contentType) h.set("Content-Type", contentType);
    if (tokenStr) h.set("Authorization", `Bearer ${tokenStr}`);
    return h;
  };

  try {
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

    // --- REQUEST PERTAMA ---
    let res = await fetch(targetUrl, {
      method: request.method,
      headers: getHeaders(token),
      body: body,
      cache: "no-store",
    });

    // --- LOGIC REFRESH TOKEN ---
    // Jika 401 dan bukan sedang memanggil endpoint refresh/login
    if (res.status === 401 && !pathString.includes("auth/refresh")) {
      console.log("🔄 Access Token expired, attempting refresh...");

      const { accessToken, setCookieHeader } = await tryRefreshToken(request);

      if (accessToken) {
        console.log("✅ Refresh success, retrying original request");

        // Retry request dengan token baru
        res = await fetch(targetUrl, {
          method: request.method,
          headers: getHeaders(accessToken),
          body: body,
          cache: "no-store",
        });

        // Buat response baru agar kita bisa menyisipkan token baru ke client (opsional)
        const resBody = await res.arrayBuffer();
        const response = new NextResponse(resBody, {
          status: res.status,
          headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
        });

        // Jika ada cookie baru (seperti refresh_token baru), teruskan ke browser
        if (setCookieHeader) {
          response.headers.append("Set-Cookie", setCookieHeader);
        }

        return response;
      }
    }

    // Response standar jika tidak 401 atau refresh gagal
    const resBody = await res.arrayBuffer();
    return new NextResponse(resBody, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });

  } catch (error) {
    return NextResponse.json({ message: "Proxy Error" }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;