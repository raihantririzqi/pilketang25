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
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      }),
    });
    console.log("Backend Response Status:", backendRes);


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

    console.log(data)

    const { access_token, refresh_token, user } = data.result;

    // Buat response
    const response = NextResponse.json({
      success: true,
      user: user,
    });

    // PENTING: Clear semua Set-Cookie dari backend
    response.headers.delete("set-cookie");

    // Set cookies langsung via Set-Cookie header untuk full control
    const tokenCookie = `token=${access_token}; Path=/; Max-Age=60; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`;

    const refreshCookie = `refresh_token_cookie=${refresh_token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`;

    response.headers.append("Set-Cookie", tokenCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;

  } catch (error: any) {
    console.error("Proxy Error Details:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}