import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// Gunakan 127.0.0.1 untuk koneksi internal VPS agar lebih cepat di CPU 2-Core
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

/**
 * Fungsi internal untuk memanggil endpoint refresh di Elysia
 */
async function tryRefreshToken() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": allCookies,
      },
    });

    if (!res.ok) return { accessToken: null, setCookieHeader: null };

    const data = await res.json();
    // Menangkap Set-Cookie dari Elysia (untuk rotasi refresh token)
    const setCookie = res.headers.get("set-cookie");

    return {
      accessToken: data.result?.access_token || null,
      setCookieHeader: setCookie
    };
  } catch (err) {
    return { accessToken: null, setCookieHeader: null };
  }
}

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${pathString}${url.search}`;

  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  const getHeaders = (tokenStr?: string) => {
    const h = new Headers();
    // Teruskan Content-Type asli dari client
    const contentType = request.headers.get("Content-Type");
    if (contentType) h.set("Content-Type", contentType);

    // Inject Authorization header jika token ada
    if (tokenStr) h.set("Authorization", `Bearer ${tokenStr}`);
    return h;
  };

  try {
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.arrayBuffer()
      : undefined;

    // --- EXECUTE ORIGINAL REQUEST ---
    let res = await fetch(targetUrl, {
      method: request.method,
      headers: getHeaders(token),
      body: body,
      cache: "no-store",
    });

    // --- SILENT REFRESH LOGIC ---
    // Jika 401 dan bukan sedang di rute auth/refresh atau login
    if (res.status === 401 && !pathString.includes("auth/refresh") && !pathString.includes("auth/google")) {
      console.log(`🔄 Proxy: Token expired for ${pathString}, attempting silent refresh...`);

      const { accessToken, setCookieHeader } = await tryRefreshToken();

      if (accessToken) {
        console.log("✅ Proxy: Refresh success, retrying original request...");

        // Ulangi request asli dengan token baru
        res = await fetch(targetUrl, {
          method: request.method,
          headers: getHeaders(accessToken),
          body: body,
          cache: "no-store",
        });

        const resBody = await res.arrayBuffer();
        const response = new NextResponse(resBody, {
          status: res.status,
          headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
        });

        // PERBAIKAN UTAMA: Simpan token baru ke cookie browser agar request berikutnya valid
        response.cookies.set({
          name: "token",
          value: accessToken,
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15, // 15 menit, sesuaikan dengan backend
        });

        // Teruskan rotasi refresh_token jika ada
        if (setCookieHeader) {
          response.headers.append("Set-Cookie", setCookieHeader);
        }

        return response;
      }
    }

    // Response standar jika sukses atau refresh gagal
    const resBody = await res.arrayBuffer();
    const finalResponse = new NextResponse(resBody, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });

    return finalResponse;

  } catch (error) {
    console.error("❌ Proxy Critical Error:", error);
    return NextResponse.json({ message: "Internal Proxy Error" }, { status: 500 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;