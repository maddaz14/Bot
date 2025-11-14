import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text }) => {
    // Memeriksa apakah ada pesan yang di-reply
    if (!m.quoted) throw 'Balas pesan yang ingin dikirim dengan perintah: togc <id grup>';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Memeriksa apakah owner memasukkan ID grup
    if (!text) throw 'Masukkan ID grup!\nContoh penggunaan: togc 120363210639096225@g.us';
    let groupId = text.trim(); // Mengambil ID grup dari input pengguna

    if (!groupId.endsWith('@g.us')) throw 'ID grup tidak valid. Pastikan menggunakan format yang benar.';

    let messageOptions = { text: q.text }; // Default hanya teks jika tidak ada gambar

    // Jika ada gambar yang di-reply atau dikirim
    if (/image/.test(mime)) {
        m.reply('Sedang memproses gambar, mohon tunggu sebentar...');
        try {
            let media = await q.download(); // Mengunduh gambar
            if (!media) throw 'Gambar tidak dapat diunduh, silakan coba lagi.';

            let url = await uploadImage(media); // Mengunggah gambar ke server
            if (!url) throw 'Gagal mendapatkan URL gambar, silakan coba lagi.';

            // Menambahkan gambar ke dalam opsi pesan
            messageOptions = {
                image: { url }, // Gambar yang dikirim
                caption: q.text || '', // Pesan yang dikirim bersama gambar
            };
        } catch (err) {
            console.error(err); // Log error ke console untuk debugging
            return m.reply(`Gagal mengunggah gambar: ${err.message || err}. Silakan coba lagi.`);
        }
    }

    // Mengirim pesan ke grup yang telah ditentukan
    try {
        await conn.sendMessage(groupId, messageOptions);
        m.reply('Pesan berhasil dikirim ke grup!');
    } catch (err) {
        console.error(err); // Log error pengiriman pesan
        return m.reply(`Gagal mengirim pesan ke grup: ${err.message || err}. Silakan coba lagi.`);
    }
}

handler.help = ['togc'];
handler.tags = ['owner'];
handler.command = /^(togc)$/i;
handler.rowner = true;

export default handler;