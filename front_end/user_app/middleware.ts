// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Helper: Coba refresh token
async function tryRefreshToken(request: NextRequest): Promise<string | null> {
  const refreshToken = request.cookies.get("refresh_token_cookie")?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token_cookie=${refreshToken}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.result?.signed_access_token || null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // --- 1. KONFIGURASI ROUTE ---
  const authRoutes = ["/login"];

  // Halaman untuk User Biasa
  const userRoutes = ["/dashboard", "/qr_generate"];

  // Halaman Khusus Admin (Scan, Attendance, Admin Panel)
  const adminRoutes = ["/admin", "/scan", "/attendance"];

  // --- 2. LOGIC REDIRECT (Auth) ---
  // Jika user sudah login tapi buka /login, lempar ke dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- 3. LOGIC PROTEKSI (Login Check) ---
  const isProtectedRoute = [...userRoutes, ...adminRoutes].some((route) =>
    pathname.startsWith(route)
  );

  // Jika masuk halaman terproteksi TAPI tidak punya token -> Lempar ke Login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // --- 4. ROLE BASED ACCESS CONTROL (RBAC) ---
  if (token && isProtectedRoute) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    let newAccessToken: string | null = null;

    try {
      // Coba verify token
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (error) {
      // Token expired/invalid -> Coba refresh
      newAccessToken = await tryRefreshToken(request);

      if (!newAccessToken) {
        // Refresh gagal -> Paksa logout
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refresh_token_cookie");
        return response;
      }

      // Verify token baru
      try {
        const verified = await jwtVerify(newAccessToken, secret);
        payload = verified.payload;
      } catch {
        // Token baru juga invalid -> logout
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refresh_token_cookie");
        return response;
      }
    }

    // Cek role untuk admin routes
    const userRole = payload.role as string;
    const isTryingAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isTryingAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Jika ada token baru dari refresh, set di response
    if (newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set({
        name: "token",
        value: newAccessToken,
        httpOnly: true,
        path: "/",
        maxAge: 30 * 60, // 30 menit
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};