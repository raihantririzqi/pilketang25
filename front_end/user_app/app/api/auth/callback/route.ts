// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: "Code is required" }, { status: 400 });
    }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      }),
    });

    // --- PERBAIKAN START ---
    const contentType = backendRes.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await backendRes.json();
    } else {
      // Jika error berupa teks (Internal Server Error)
      const textError = await backendRes.text();
      console.error("Backend Raw Error:", textError);
      return NextResponse.json(
        { message: textError || "Backend returned non-JSON error" },
        { status: backendRes.status }
      );
    }
    // --- PERBAIKAN END ---

    if (!backendRes.ok) {
      console.log("Backend Logical Error:", data);
      return NextResponse.json(
        { message: data?.message || "Failed to exchange token" },
        { status: backendRes.status }
      );
    }

    const { signed_access_token, signed_refresh_token, user } = data.result;
    const cookieStore = await cookies();

    // 1. UPDATE ACCESS TOKEN COOKIE (Sesuai testing: 1 Menit)
    cookieStore.set({
      name: "token",
      value: signed_access_token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60, // Ubah ke 60 detik (1 menit) sesuai durasi JWT di backend
    });

    if (signed_refresh_token) {
      cookieStore.set({
        name: "refresh_token_cookie",
        value: signed_refresh_token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // Refresh token biarkan lama (7 hari)
      });
    }

    return NextResponse.json({
      success: true,
      user: user, // Gunakan data user dari backend, bukan string "user"
    });

  } catch (error: any) {
    console.error("Proxy Error Details:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}