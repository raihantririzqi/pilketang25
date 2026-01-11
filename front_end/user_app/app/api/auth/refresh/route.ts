// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 1. Panggil Endpoint Refresh di Golang
    // Browser otomatis mengirim Cookie "refresh_token" ke Golang jika domain sama/diatur benar.
    // Jika Refresh Token ada di cookie HttpOnly, kita perlu meneruskannya.
    
    // Namun, karena Golang set Refresh Token di Cookie, dan Proxy ini berjalan di Server Next.js,
    // kita perlu mengambil cookie refresh_token dari request browser lalu forward ke Golang.
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    
    // Header Cookie manual untuk fetch ke Golang
    const cookieHeader = refreshToken ? `refresh_token=${refreshToken}` : "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // Teruskan Refresh Token ke Golang
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 2. DAPAT TOKEN BARU DARI GOLANG
    const { access_token, expires_in } = data.result;

    // 3. UPDATE COOKIE "TOKEN" DI BROWSER
    // Ini poin pentingnya! Kita perpanjang nyawa Access Token di Cookie Browser.
    (await cookies()).set({
      name: "token",
      value: access_token,
      httpOnly: true,
      path: "/",
      maxAge: expires_in,
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ message: "Refresh Failed" }, { status: 401 });
  }
}