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

    // 2. Teruskan Code ke Backend Golang
    // Backend akan menukar code ini dengan Access Token & Data User
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI, // Pastikan sama dengan console google
      }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to exchange token" },
        { status: backendRes.status }
      );
    }

    // 3. Ambil Token & Expiry dari Respon Golang
    // Sesuai spec API kamu: result: { access_token, expires_in, ... }
    const { access_token, expires_in, user } = data.result;

    // 4. SIMPAN TOKEN KE DALAM HTTP-ONLY COOKIE (Bagian Paling Penting!)
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: "token",           // Nama cookie yang akan dibaca Middleware
      value: access_token,     // Isi token JWT
      httpOnly: true,          // AMAN: JS Browser tidak bisa baca (Anti XSS)
      path: "/",               // Tersedia di seluruh halaman
      secure: process.env.NODE_ENV === "production", // HTTPS only di production
      sameSite: "lax",         // Proteksi CSRF standar
      maxAge: expires_in,      // Sesuai umur token dari Golang (detik)
    });

    // 5. Kembalikan respons sukses ke Frontend
    // Kita bisa kirim data user juga biar Frontend bisa simpan nama/foto di state/context
    return NextResponse.json({ 
      success: true, 
      user: user 
    });

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}