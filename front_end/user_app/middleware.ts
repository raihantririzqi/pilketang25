import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/dist/server/request/cookies";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

async function tryRefreshToken() {
  try {
    const cookieStore = await cookies();

    // 1. EARLY RETURN: Cek spesifik apakah refresh_token ada sebelum fetch
    const hasRefreshToken = cookieStore.has("refresh_token_cookie");
    if (!hasRefreshToken) {
      console.log("⚠️ Proxy: No refresh token found, skipping refresh attempt.");
      return { accessToken: null, setCookieHeader: null };
    }

    // 2. Gunakan toString() untuk meneruskan semua cookie dengan format yang benar
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
    const setCookie = res.headers.get("set-cookie");

    return {
      accessToken: data.result?.access_token || null,
      setCookieHeader: setCookie
    };
  } catch (err) {
    return { accessToken: null, setCookieHeader: null };
  }
}
export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refresh_token_cookie")?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ["/login"];
  const userRoutes = ["/dashboard", "/qr_generate"];
  const adminRoutes = ["/admin", "/scan", "/attendance"];

  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = [...userRoutes, ...adminRoutes].some((route) => pathname.startsWith(route));

  // --- LOGIKA GLOBAL ---
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  let payload: any = null;
  let newAccessToken: string | null = null;

  // 1. Cek validitas token yang ada (di semua route)
  if (token) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch (e) {
      token = undefined; // Token expired
    }
  }

  // 2. Global Refresh: Jika token mati tapi ada refresh_token, tarik token baru
  // Ini akan berjalan bahkan di landing page (/)
  if (!token && refreshToken) {
    const refreshResult = await tryRefreshToken();
    if (refreshResult.accessToken) {
      try {
        const { payload: verifiedPayload } = await jwtVerify(refreshResult.accessToken, secret);
        payload = verifiedPayload;
      } catch (e) {
        payload = null;
      }
    }
  }

  // --- LOGIKA REDIRECT & GUARD ---

  // A. Guest Guard: Jika sudah login (payload ada), dilarang ke /login
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // B. Protected Guard: Jika ke halaman internal tapi tidak punya payload (session gagal)
  if (isProtectedRoute && !payload) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete("token");
    return response;
  }

  // C. RBAC Check
  if (adminRoutes.some(r => pathname.startsWith(r)) && payload?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- FINAL RESPONSE ---
  const response = NextResponse.next();

  // Jika tadi ada refresh berhasil, pasang cookie baru di response sebelum dikirim ke browser
  if (newAccessToken) {
    response.cookies.set({
      name: "token",
      value: newAccessToken,
      httpOnly: true,
      path: "/",
      maxAge: 60, // Sesuai testing 1 menit
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};