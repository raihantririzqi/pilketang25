// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
  // Gabungkan semua route yang butuh login
  const isProtectedRoute = [...userRoutes, ...adminRoutes].some(route =>
    pathname.startsWith(route)
  );

  // Jika masuk halaman terproteksi TAPI tidak punya token -> Lempar ke Login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // --- 4. ROLE BASED ACCESS CONTROL (RBAC) ---
  // Cek apakah User Biasa mencoba masuk ke Halaman Admin
  if (token && isProtectedRoute) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Asumsi role di database/token adalah "user" atau "admin"
      const userRole = payload.role as string;

      // Cek apakah rute yang dituju adalah Rute Admin
      const isTryingAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

      // JIKA masuk rute admin TAPI role bukan admin -> Tendang ke Dashboard User
      if (isTryingAdminRoute && userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

    } catch (error) {
      // Token tidak valid/expired -> Paksa Logout
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};