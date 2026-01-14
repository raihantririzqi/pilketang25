// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // 1. Terima Authorization Code dari Frontend
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: "Code is required" }, { status: 400 });
    }

    // 2. Teruskan Code ke Backend Elysia
    // Backend akan menukar code ini dengan Access Token & Data User
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to exchange token" },
        { status: backendRes.status }
      );
    }

    // 3. Ambil Token & User dari Respon Backend (Elysia)
    // Backend mengembalikan: result: { signed_access_token, user }
    // Note: Backend set refresh_token_cookie via Set-Cookie header, tapi karena ini proxy
    // Set-Cookie tidak otomatis diteruskan ke browser. Jika backend juga return
    // signed_refresh_token di body, kita set manual.
    const { signed_access_token, signed_refresh_token, user } = data.result;

    // 4. SIMPAN TOKEN KE DALAM HTTP-ONLY COOKIE
    const cookieStore = await cookies();

    // Access Token Cookie
    cookieStore.set({
      name: "token",
      value: signed_access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60, // 30 menit
    });

    // Refresh Token Cookie - hanya set jika ada di response body
    if (signed_refresh_token) {
      cookieStore.set({
        name: "refresh_token_cookie",
        value: signed_refresh_token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      });
    }

    // 5. Kembalikan respons sukses ke Frontend
    return NextResponse.json({
      success: true,
      user: user,
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}