import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Ambil secret dari environment server
    const MASTER_TOKEN = process.env.KIOSK_ACCESS_TOKEN;

    // Nama Cookie Penanda (Flag) bahwa device ini legal
    const COOKIE_NAME = 'x-kiosk-authorized-device';

    // ============================================================
    // 1. WHITELIST (JANGAN DIBLOKIR)
    // ============================================================
    // Halaman error & API internal Next.js harus tetap jalan
    if (pathname === '/kiosk-locked') {
        return NextResponse.next();
    }

    // ============================================================
    // 2. CEK STATUS DEVICE (Apakah sudah di-unlock?)
    // ============================================================
    const deviceCookie = request.cookies.get(COOKIE_NAME)?.value;
    const urlToken = searchParams.get('access_key'); // parameter di URL

    // SKENARIO A: Device sudah punya cookie (Sudah pernah di-unlock)
    // Logic: "Kalau cookie-nya 'true', silakan lewat."
    if (deviceCookie === 'true') {
        return NextResponse.next();
    }

    // SKENARIO B: Device baru pertama kali dibuka & bawa Token Benar
    // URL: localhost:3000?access_key=kiosk-angkatan-2024-secret
    if (urlToken === MASTER_TOKEN) {
        // Redirect ke URL bersih (hapus ?access_key=...)
        const response = NextResponse.redirect(new URL(pathname, request.url));

        // Tanam Cookie "Abadi" (misal 1 tahun)
        // Ini menandakan browser ini SAH sebagai Kiosk.
        response.cookies.set(COOKIE_NAME, 'true', {
            httpOnly: true, // Aman dari script client
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365, // 1 TAHUN (Biar ga repot login ulang)
            path: '/',
        });

        return response;
    }

    // ============================================================
    // 3. JIKA GAGAL (Bukan Kiosk Resmi) -> BLOCK
    // ============================================================
    // Lempar ke halaman "Layar Terkunci"
    return NextResponse.redirect(new URL('/kiosk-locked', request.url));
}

// Config: Terapkan ke semua route KECUALI file static/sistem
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};