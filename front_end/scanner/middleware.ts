import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// middleware.ts
export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // ============================================================
    // 0. EXCLUDE API & INTERNAL (TAMBAHKAN INI!)
    // ============================================================
    // Jangan cegat request API. Biarkan Proxy & Backend yang urus.
    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    const MASTER_TOKEN = process.env.KIOSK_ACCESS_TOKEN;
    const COOKIE_NAME = 'x-kiosk-authorized-device';

    if (pathname === '/kiosk-locked') {
        return NextResponse.next();
    }

    const deviceCookie = request.cookies.get(COOKIE_NAME)?.value;
    const urlToken = searchParams.get('access_key');

    if (deviceCookie === 'true') {
        return NextResponse.next();
    }

    if (urlToken === MASTER_TOKEN) {
        const response = NextResponse.redirect(new URL(pathname, request.url));
        response.cookies.set(COOKIE_NAME, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
        });
        return response;
    }

    return NextResponse.redirect(new URL('/kiosk-locked', request.url));
}
// Config: Terapkan ke semua route KECUALI file static/sistem
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};