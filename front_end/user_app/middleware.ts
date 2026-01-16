import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function tryRefreshToken(request: NextRequest): Promise<string | null> {
  const refreshToken = request.cookies.get("refresh_token_cookie")?.value;
  if (!refreshToken) return null;

  try {
    const apiUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Mengambil seluruh string cookie yang ada di request browser
        "Cookie": request.headers.get("cookie") || "",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result?.access_token || null;
  } catch (err) {
    return null;
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
    newAccessToken = await tryRefreshToken(request);
    if (newAccessToken) {
      try {
        const { payload: verifiedPayload } = await jwtVerify(newAccessToken, secret);
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