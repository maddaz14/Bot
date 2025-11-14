import sharp from 'sharp';

let handler = async (m, { conn, usedPrefix, command }) => {
    const notImageMessage = `Reply gambar dengan perintah *${usedPrefix + command}* untuk mengonversi ke PNG.`;
    
    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    // Cek apakah ada pesan yang dibalas
    if (!m.quoted) throw notImageMessage;

    // Ambil pesan yang dibalas
    const q = m.quoted || m;

    // Periksa tipe MIME file
    const mime = (q.mimetype || '');
    if (!/image\/jpeg|image\/jpg/.test(mime)) throw notImageMessage;

    // Unduh media
    const media = await q.download();
    if (!media) throw `Gagal mengunduh gambar. Pastikan Anda membalas gambar dengan perintah ini.`;
    
    try {
        // Konversi gambar JPG ke PNG menggunakan sharp
        const pngBuffer = await sharp(media).png().toBuffer();

        // Kirim file hasil konversi
        await conn.sendFile(
            m.chat,
            pngBuffer,
            'converted.png',
            'Gambar berhasil dikonversi ke PNG.',
            m
        );
        
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (err) {
        throw `Terjadi kesalahan saat mengonversi gambar: ${err.message}`;
    }
};

handler.help = ['jpgtopng (reply)'];
handler.tags = ['tools'];
handler.command = ['jpgtopng', 'topng'];
handler.limit = true;

export default handler;