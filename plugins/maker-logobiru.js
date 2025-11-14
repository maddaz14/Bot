import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} Aku sayang kamu`;

    try {
        // Kirim reaksi ⏳ sebagai tanda memproses
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Buat URL API
        const url = `https://api.ubed.my.id/maker/Logo-Text-blue?apikey=ubed2407&text=${encodeURIComponent(text)}`;

        // Ambil gambar sebagai arraybuffer
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 15000
        });

        // Kirim sebagai gambar ke pengguna
        let sentMsg = await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(response.data),
                caption: `Berhasil membuat logo teks biru untuk:\n*${text}*`
            },
            { quoted: m }
        );

        // Reaksi sukses
        await conn.sendMessage(m.chat, { react: { text: '✅', key: sentMsg.key } });
    } catch (err) {
        console.error('Gagal membuat logo teks:', err);
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat membuat logo. Coba lagi nanti.', m);
    }
};

handler.help = ['logobiru <teks>'];
handler.tags = ['maker'];
handler.command = /^logobiru$/i;
handler.limit = 3;
handler.register = true;

export default handler;