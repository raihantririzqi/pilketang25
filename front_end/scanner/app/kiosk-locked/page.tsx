export default function KioskLocked() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
            <h1 className="text-5xl font-bold mb-4">⛔ AKSES DITOLAK</h1>
            <p className="text-xl text-gray-400">
                Aplikasi ini hanya dapat diakses melalui Kiosk Resmi Pemilihan.
            </p>
            <div className="mt-8 p-4 border border-gray-700 rounded bg-gray-900 text-sm font-mono text-gray-500">
                Error Code: ERR_KIOSK_TOKEN_MISSING
            </div>
        </div>
    );
}