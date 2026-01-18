import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        // Validasi Sederhana
        if (!message || message.length < 5) {
            return NextResponse.json({ error: "Pesan terlalu pendek" }, { status: 400 });
        }

        // Sanitasi input untuk mencegah karakter aneh masuk ke Telegram
        const cleanName = name.replace(/[<>]/g, "");
        const cleanMessage = message.replace(/[<>]/g, "");

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        const text = `
<b>📩 Feedback Baru</b>
<b>Pengirim:</b> ${cleanName}
<b>Kontak:</b> ${email}
<b>Isi:</b> ${cleanMessage}
    `.trim();

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: "HTML",
            }),
        });

        if (!response.ok) throw new Error("Gagal mengirim ke Telegram");

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}