// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // 1. Panggil Endpoint Refresh di Golang
    // Browser otomatis mengirim Cookie "refresh_token" ke Golang jika domain sama/diatur benar.
    // Jika Refresh Token ada di cookie HttpOnly, kita perlu meneruskannya.
    
    // Backend Elysia set Refresh Token di Cookie dengan nama "refresh_token_cookie"
    // Kita perlu mengambil cookie tersebut dari request browser lalu forward ke backend
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token_cookie")?.value;

    // Header Cookie manual untuk fetch ke Backend
    const cookieHeader = refreshToken ? `refresh_token_cookie=${refreshToken}` : "";

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

    // 2. DAPAT TOKEN BARU DARI BACKEND
    const { access_token } = data.result;

    // 3. UPDATE COOKIE "TOKEN" DI BROWSER
    // Ini poin pentingnya! Kita perpanjang nyawa Access Token di Cookie Browser.
    (await cookies()).set({
      name: "token",
      value: access_token,
      httpOnly: true,
      path: "/",
      maxAge: 30 * 60, // 30 menit (sesuai access token TTL)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ message: "Refresh Failed" }, { status: 401 });
  }
}