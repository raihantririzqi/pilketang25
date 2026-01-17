// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("token")?.value;
    const refreshToken = cookieStore.get("refresh_token_cookie")?.value;

    // Panggil endpoint logout di backend untuk blacklist token
    if (accessToken || refreshToken) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (refreshToken) {
        headers["Cookie"] = `refresh_token_cookie=${refreshToken}`;
      }

      await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers,
      });
    }

    // Hapus cookies di browser
    cookieStore.delete("token");
    cookieStore.delete("refresh_token_cookie");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    // Tetap hapus cookie meski backend error
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("refresh_token_cookie");

    return NextResponse.json({ success: true });
  }
}
