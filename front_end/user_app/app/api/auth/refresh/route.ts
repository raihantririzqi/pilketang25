// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token_cookie")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    // Forward refresh token ke backend Elysia
    const res = await fetch(`${process.env.BACKEND_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token_cookie=${refreshToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Backend mengembalikan signed_access_token
    const { signed_access_token } = data.result;

    // Update cookie dengan access token baru
    cookieStore.set({
      name: "token",
      value: signed_access_token,
      httpOnly: true,
      path: "/",
      maxAge: 30 * 60, // 30 menit
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Refresh Failed" }, { status: 401 });
  }
}