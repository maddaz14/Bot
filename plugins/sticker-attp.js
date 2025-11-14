import fetch from 'node-fetch';
import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { args, usedPrefix, command, conn }) => {
    if (!args[0]) {
        return m.reply(`Penggunaan:\n${usedPrefix + command} <teks>`);
    }

    let text = args.join(' ');
    let apiUrl = `https://api.ubed.my.id/maker/attp?apikey=alhamdulilah&text=${encodeURIComponent(text)}&bg=transparent`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍋‍🟩', key: m.key } });

        let res = await fetch(apiUrl, {
            method: 'GET',
            headers: { Accept: 'image/gif' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        // Menangani buffer gambar langsung dari API
        let gifBuffer = await res.buffer();

        // Menggunakan wa-sticker-formatter untuk mengonversi buffer gambar menjadi stiker
        let sticker = new Sticker(gifBuffer, {
            type: 'full',
            pack: 'ATTP',
            author: 'Bot',
            categories: ['🖋️'],
        });

        await conn.sendMessage(m.chat, { sticker: await sticker.toBuffer() }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply('❌ Gagal membuat stiker ATTP. Coba lagi nanti.');
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['attp <teks>'];
handler.tags = ['sticker'];
handler.command = /^attp$/i;
handler.limit = 2;
handler.register = true;

export default handler;